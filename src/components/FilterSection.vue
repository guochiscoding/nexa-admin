<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import IconFont from '@/components/IconFont';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  collapsedRows?: number;
}>(), {
  collapsedRows: 1,
});

const emit = defineEmits<{
  submit: [];
}>();

const { t } = useI18n();
const gridRef = ref<HTMLElement>();
const expanded = ref(false);
const canToggle = ref(false);
const collapsedHeight = ref<number>();

let resizeObserver: ResizeObserver | undefined;

const resolvedCollapsedHeight = computed(() => `${collapsedHeight.value ?? 0}px`);

function measureRows() {
  const grid = gridRef.value;
  if (!grid) return;

  const children = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.offsetParent !== null);
  if (children.length === 0) {
    canToggle.value = false;
    collapsedHeight.value = undefined;
    return;
  }

  const gridTop = grid.getBoundingClientRect().top;
  const { paddingBottom } = getComputedStyle(grid);
  const bottomPadding = Number.parseFloat(paddingBottom) || 0;
  const rowTops = [...new Set(children.map((child) => Math.round(child.getBoundingClientRect().top - gridTop)))].sort((a, b) => a - b);
  canToggle.value = rowTops.length > props.collapsedRows;

  if (!canToggle.value) {
    expanded.value = false;
    collapsedHeight.value = undefined;
    return;
  }

  const visibleRowTops = new Set(rowTops.slice(0, props.collapsedRows));
  collapsedHeight.value = Math.max(
    ...children
      .map((child) => {
        const rect = child.getBoundingClientRect();
        const top = Math.round(rect.top - gridTop);
        return { bottom: Math.ceil(rect.bottom - gridTop), top };
      })
      .filter((child) => visibleRowTops.has(child.top))
      .map((child) => child.bottom),
  ) + Math.ceil(bottomPadding);
}

function scheduleMeasureRows() {
  void nextTick(measureRows);
}

function handleSubmit() {
  emit('submit');
}

function toggleExpanded() {
  expanded.value = !expanded.value;
  scheduleMeasureRows();
}

onMounted(() => {
  scheduleMeasureRows();
  if (gridRef.value) {
    resizeObserver = new ResizeObserver(measureRows);
    resizeObserver.observe(gridRef.value);
  }
  window.addEventListener('resize', measureRows);
});

onUpdated(scheduleMeasureRows);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', measureRows);
});
</script>

<template>
  <form v-bind="$attrs" class="filter-section" @submit.prevent="handleSubmit">
    <div ref="gridRef" class="filter-section-grid" :class="{ 'is-collapsed': !expanded && canToggle }">
      <slot />
    </div>

    <div class="filter-section-footer">
      <div class="filter-section-actions">
        <slot name="actions" />
      </div>
      <button
        v-if="canToggle"
        class="filter-toggle-button"
        type="button"
        :aria-expanded="expanded"
        @click="toggleExpanded"
      >
        <span>{{ expanded ? t('common.collapse') : t('common.expand') }}</span>
        <IconFont
          :type="expanded ? 'icon-icon-chevron-up' : 'icon-icon-chevron-down'"
          class="filter-toggle-icon"
          aria-hidden="true"
        />
      </button>
    </div>
  </form>
</template>

<style scoped>
@reference "../styles/index.css";

.filter-section {
  @apply @container flex min-w-0 flex-col rounded-lg bg-container px-5 py-4 shadow-td-shadow-0;
}

.filter-section-grid {
  @apply relative -m-1 grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 overflow-hidden p-1 transition-[max-height] duration-200 @min-[640px]:grid-cols-2 @min-[1100px]:grid-cols-4;
}

.filter-section-grid.is-collapsed {
  max-height: v-bind(resolvedCollapsedHeight);
}

.filter-section-footer {
  @apply mt-4 flex min-w-0 flex-wrap items-center gap-4;
}

.filter-section-actions {
  @apply flex min-w-0 flex-wrap items-center gap-4;
}

.filter-toggle-button {
  @apply inline-flex h-8 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-body-medium text-font-blue-link;
}

.filter-toggle-icon {
  @apply text-(length:--font-size-titleMedium);
}

:deep(.filter-field) {
  @apply flex min-w-0 items-center gap-2 text-body-medium leading-[22px] text-font-black-gy1;
}

:deep(.filter-field label) {
  @apply shrink-0 whitespace-nowrap font-medium text-font-black-gy1;
}

:deep(.filter-field .common-input),
:deep(.filter-field .common-select),
:deep(.filter-field .label-input),
:deep(.filter-field .label-select),
:deep(.filter-field .app-picker) {
  @apply min-w-0 flex-1;
}
</style>
