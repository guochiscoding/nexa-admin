<script setup lang="ts">
/**
 * LabelSelect — 带前置标签的一体式选择器。
 *
 * 外层容器负责边框、hover、focus、disabled 状态；内部复用通用 Select，
 * 并关闭 Select 自身视觉边框。
 */
import { computed } from 'vue';

import Select, { type SelectOptionItem } from '@/components/Select.vue';

defineOptions({ inheritAttrs: false });

type SelectMode = 'multiple' | 'tags' | 'combobox';
type SelectOptionValue = string | number;
type SelectModelValue = SelectOptionValue | SelectOptionValue[] | undefined;
type SelectWidth = number | string;

const props = withDefaults(
  defineProps<{
    /** 前置标签文案 */
    label: string;
    /** 选项列表 */
    options?: SelectOptionItem[];
    /** 占位文案；不传则沿用 Select 默认「请选择」 */
    placeholder?: string;
    /** 选择器模式；不传时为单选 */
    mode?: SelectMode;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: SelectWidth;
    /** 是否支持搜索 */
    showSearch?: boolean;
  }>(),
  {
    options: () => [],
    placeholder: undefined,
    mode: undefined,
    disabled: false,
    width: '240px',
    showSearch: true,
  },
);

const emit = defineEmits<{
  /** 用户选择变化时抛出当前值和选中项 */
  change: [value: SelectModelValue, selectedOptions: SelectOptionItem[]];
}>();

const selectedValue = defineModel<SelectModelValue>({ default: undefined });

const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));

function handleChange(value: SelectModelValue, selectedOptions: SelectOptionItem[]) {
  emit('change', value, selectedOptions);
}
</script>

<template>
  <div class="label-select" :class="{ 'is-disabled': disabled }">
    <span class="label-select-text">{{ label }}：</span>
    <Select
      v-bind="$attrs"
      v-model="selectedValue"
      class="label-select-control"
      width="100%"
      :options="options"
      :placeholder="placeholder"
      :mode="mode"
      :disabled="disabled"
      :virtual="false"
      :show-search="showSearch"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.label-select {
  @apply relative z-0 inline-flex h-8 min-w-0 items-center rounded border border-component-border bg-container pl-2 pr-2 transition-[border-color,box-shadow,background-color];
  width: v-bind(resolvedWidth);
}

.label-select:hover:not(.is-disabled):not(:focus-within) {
  @apply border-brand-black-hover;
}

.label-select:focus-within {
  @apply z-10 border-brand-black-active shadow-td-shadow-4;
}

.label-select.is-disabled {
  @apply cursor-not-allowed bg-color-page;
}

.label-select-text {
  @apply shrink-0 text-body-medium leading-[22px] font-medium text-font-black-gy2;
}

.label-select-control {
  @apply !h-[30px] min-w-0 flex-1;
}

.label-select .label-select-control :deep(.ant-select-selector),
.label-select .label-select-control:hover :deep(.ant-select-selector),
.label-select .label-select-control.ant-select-focused :deep(.ant-select-selector),
.label-select .label-select-control.ant-select-focused:hover :deep(.ant-select-selector),
.label-select .label-select-control.ant-select-disabled :deep(.ant-select-selector),
.label-select .label-select-control.ant-select-disabled:hover :deep(.ant-select-selector) {
  @apply !h-[30px] !min-h-[30px] !border-0 !bg-transparent !pl-0 !pr-8 !shadow-none;
}

.label-select-control :deep(.ant-select-selection-item),
.label-select-control :deep(.ant-select-selection-placeholder) {
  @apply !text-body-medium !leading-[30px];
}

.label-select-control :deep(.ant-select-selection-item) {
  @apply !text-font-black-gy1;
}

.label-select-control :deep(.ant-select-selection-placeholder),
.label-select.is-disabled .label-select-text,
.label-select.is-disabled :deep(.ant-select-selection-item) {
  @apply !text-font-black-gy4;
}

.label-select.is-disabled :deep(.ant-select-selector) {
  @apply !cursor-not-allowed;
}

.label-select-control :deep(.ant-select-selector .ant-select-selection-search),
.label-select-control :deep(.ant-select-selector .ant-select-selection-placeholder) {
  inset-inline-start: 0 !important;
  inset-inline-end: 0 !important;
}

.label-select-control :deep(.ant-select-arrow),
.label-select-control :deep(.ant-select-clear) {
  @apply !right-0;
  inset-inline-end: 0 !important;
}
</style>
