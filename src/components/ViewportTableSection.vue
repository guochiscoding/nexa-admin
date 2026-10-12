<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useSlots } from 'vue';

/*
 * 使用说明：
 * 页面底部是 SelectableDataTable，且页面需要保持一屏展示、表格内容在 card 内部滚动时，
 * 使用该组件包裹表格。页面级按钮放在 #toolbar；如果使用 SelectableDataTable 自带的
 * #toolbar，也可以继续放在默认插槽中。必须把默认插槽暴露的 scrollY 传给表格的
 * scroll-y 属性。
 *
 * 该组件只负责表格 card 内部的高度计算：扣除 toolbar、表头、分页区域后得到 table body
 * 的 scrollY。页面自身仍然必须提供可计算的剩余高度，父级容器需要具备 h-full min-h-0，
 * 并用 grid/flex 让该组件所在区域占用剩余空间，例如：
 * .page-content { @apply grid h-full min-h-0 min-w-0 gap-6; grid-template-rows: auto auto minmax(0, 1fr); }
 * 如果父级没有剩余高度约束，该组件也会被内容撑开，无法保证一屏内展示。
 *
 * <ViewportTableSection :min-scroll-y="96">
 *   <template #toolbar>...</template>
 *   <template #default="{ scrollY }">
 *     <SelectableDataTable :scroll-y="scrollY" ... />
 *   </template>
 * </ViewportTableSection>
 */

const props = withDefaults(defineProps<{
  fitContent?: boolean;
  minScrollY?: number;
}>(), {
  fitContent: false,
  minScrollY: 96,
});

const slots = useSlots();
const sectionRef = ref<HTMLElement>();
const bodyRef = ref<HTMLElement>();
const scrollY = ref(96);

let resizeObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;
const observedElements = new Set<Element>();

function getElementHeight(root: HTMLElement, selector: string) {
  return root.querySelector<HTMLElement>(selector)?.offsetHeight ?? 0;
}

function getElementVerticalMargins(root: HTMLElement, selector: string) {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return 0;

  const computedStyle = window.getComputedStyle(element);
  return (Number.parseFloat(computedStyle.marginTop) || 0) + (Number.parseFloat(computedStyle.marginBottom) || 0);
}

function getElementVerticalPadding(element: HTMLElement | null | undefined) {
  if (!element) return 0;

  const computedStyle = window.getComputedStyle(element);
  return (Number.parseFloat(computedStyle.paddingTop) || 0) + (Number.parseFloat(computedStyle.paddingBottom) || 0);
}

function getDescendantVerticalPadding(root: HTMLElement, selector: string) {
  return getElementVerticalPadding(root.querySelector<HTMLElement>(selector));
}

function getAvailableBodyHeight(body: HTMLElement) {
  if (!props.fitContent) {
    return body.clientHeight;
  }

  const section = sectionRef.value;
  const parent = section?.parentElement;
  if (!section || !parent) {
    return body.clientHeight;
  }

  const sectionRect = section.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const sectionStyle = window.getComputedStyle(section);
  const paddingY = (Number.parseFloat(sectionStyle.paddingTop) || 0) + (Number.parseFloat(sectionStyle.paddingBottom) || 0);
  const viewportToolbarHeight = getElementHeight(section, '.viewport-table-toolbar');
  const viewportToolbarMargins = getElementVerticalMargins(section, '.viewport-table-toolbar');
  const availableSectionHeight = Math.max(0, parentRect.bottom - sectionRect.top);
  const availableBodyHeight = availableSectionHeight - paddingY - viewportToolbarHeight - viewportToolbarMargins;

  // 筛选区展开后需要按父级剩余空间收缩，避免沿用旧表格高度把底部分页挤出视口。
  return Math.max(0, availableBodyHeight || body.clientHeight);
}

function updateScrollY() {
  const body = bodyRef.value;
  if (!body) return;

  const availableBodyHeight = getAvailableBodyHeight(body);
  const bodyPadding = getElementVerticalPadding(body);
  const tablePadding = getDescendantVerticalPadding(body, '.selectable-data-table');
  const headerHeight = getElementHeight(body, '.ant-table-thead');
  const tableToolbarHeight = getElementHeight(body, '.table-toolbar');
  const tableToolbarMargins = getElementVerticalMargins(body, '.table-toolbar');
  const footerHeight = getElementHeight(body, '.table-footer');
  const borderAllowance = 2;
  const nextHeight = availableBodyHeight - bodyPadding - tablePadding - tableToolbarHeight - tableToolbarMargins - headerHeight - footerHeight - borderAllowance;

  scrollY.value = Math.max(props.minScrollY, Math.floor(nextHeight));
}

function scheduleUpdateScrollY() {
  void nextTick(updateScrollY);
}

function observeElement(element: Element | undefined | null) {
  if (!element || !resizeObserver || observedElements.has(element)) {
    return;
  }

  resizeObserver.observe(element);
  observedElements.add(element);
}

function observeLayoutElements() {
  const section = sectionRef.value;
  const body = bodyRef.value;
  const parent = section?.parentElement;

  // 表格高度受同级筛选区影响，监听父级与兄弟节点尺寸变化后同步重算 scrollY。
  observeElement(section);
  observeElement(body);
  observeElement(parent);

  parent?.childNodes.forEach((node) => {
    if (node instanceof Element) {
      observeElement(node);
    }
  });
}

onMounted(() => {
  scheduleUpdateScrollY();
  resizeObserver = new ResizeObserver(updateScrollY);
  observeLayoutElements();

  const parent = sectionRef.value?.parentElement;
  if (parent) {
    mutationObserver = new MutationObserver(() => {
      observeLayoutElements();
      scheduleUpdateScrollY();
    });
    mutationObserver.observe(parent, { childList: true });
  }
  window.addEventListener('resize', updateScrollY);
});

onUpdated(() => {
  observeLayoutElements();
  scheduleUpdateScrollY();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  observedElements.clear();
  window.removeEventListener('resize', updateScrollY);
});
</script>

<template>
  <section ref="sectionRef" class="viewport-table-section" :class="{ 'is-fit-content': props.fitContent }">
    <div v-if="slots.toolbar" class="viewport-table-toolbar">
      <slot name="toolbar" />
    </div>
    <div ref="bodyRef" class="viewport-table-body">
      <slot :scroll-y="scrollY" />
    </div>
  </section>
</template>

<style scoped>
@reference "../styles/index.css";

.viewport-table-section {
  @apply flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg bg-container px-5 py-4 shadow-td-shadow-0;
}

.viewport-table-section.is-fit-content {
  @apply h-auto self-start;
  max-height: 100%;
}

.viewport-table-toolbar {
  @apply mb-5 flex min-w-0 flex-wrap items-center gap-3;
}

.viewport-table-body {
  @apply flex min-h-0 min-w-0 flex-1 flex-col overflow-visible;
}

.viewport-table-body :deep(.selectable-data-table),
.viewport-table-body :deep(.table-toolbar) {
  /* 工具栏控件 focus 阴影需要穿出表格外层，实际滚动裁剪由 Ant 表格主体负责。 */
  @apply box-border !overflow-visible;
}

.viewport-table-body :deep(.antd-data-table),
.viewport-table-body :deep(.ant-table-wrapper),
.viewport-table-body :deep(.ant-spin-nested-loading),
.viewport-table-body :deep(.ant-spin-container),
.viewport-table-body :deep(.ant-table),
.viewport-table-body :deep(.ant-table-container) {
  @apply min-h-0 min-w-0 overflow-hidden;
}

.viewport-table-section.is-fit-content .viewport-table-body {
  @apply flex-none;
}
</style>
