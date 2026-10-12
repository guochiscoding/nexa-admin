<script setup lang="ts">
import { computed } from 'vue';

import RangePicker from '@/components/RangePicker.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  /** 前置标签文案，冒号由组件添加 */
  label: string;
  /** 整体宽度：数字按 px 处理，字符串支持百分比等 CSS 宽度 */
  width?: number | string;
  /** 禁用整个选择器 */
  disabled?: boolean;
}>(), {
  width: 400,
  disabled: false,
});

/** 保持原选择器的数据格式；清空时为 undefined */
const value = defineModel<[string, string] | undefined>('value', { default: undefined });

defineSlots<{
  /** 自定义右侧图标，不传则沿用选择器默认日历图标 */
  suffixIcon?: () => unknown;
}>();

const resolvedWidth = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width);
</script>

<template>
  <div class="label-picker" :class="[$attrs.class, { 'is-disabled': disabled }]">
    <span class="label-picker-text">{{ label }}：</span>
    <RangePicker
      v-model:value="value"
      :aria-label="label"
      v-bind="{ ...$attrs, class: undefined }"
      class="label-picker-control"
      :disabled="disabled"
      :bordered="false"
    >
      <template v-if="$slots.suffixIcon" #suffixIcon>
        <slot name="suffixIcon" />
      </template>
    </RangePicker>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.label-picker {
  @apply inline-flex h-8 min-w-0 max-w-full items-center rounded border border-component-border bg-container pl-3 pr-2 transition-[border-color,box-shadow,background-color];
  width: v-bind(resolvedWidth);
}

.label-picker:hover:not(.is-disabled):not(:focus-within) { @apply border-brand-black-hover; }
.label-picker:focus-within:not(.is-disabled) { @apply border-brand-black-active shadow-td-shadow-4; }
.label-picker.is-disabled { @apply cursor-not-allowed bg-color-page; }
.label-picker-text { @apply shrink-0 whitespace-nowrap text-body-medium leading-[22px] font-medium text-font-black-gy2; }
.label-picker.is-disabled .label-picker-text { @apply text-font-black-gy4; }
</style>
