<script setup lang="ts">
/**
 * LabelInput — 带前置标签的一体式输入框。
 *
 * 外层容器负责边框、hover、focus、disabled 状态；内部复用通用 Input，
 * 并关闭 Input 自身边框，保持与项目输入能力一致。
 */
import { computed } from 'vue';

import Input from '@/components/Input.vue';

defineOptions({ inheritAttrs: false });

type InputWidth = number | string;

const props = withDefaults(
  defineProps<{
    /** 前置标签文案 */
    label: string;
    /** 占位文案；不传则沿用 Input 默认「请输入」 */
    placeholder?: string;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: InputWidth;
  }>(),
  {
    placeholder: undefined,
    disabled: false,
    width: '240px',
  },
);

const emit = defineEmits<{
  /** 用户输入或清空时抛出当前内容 */
  input: [value: string];
  /** 点击后缀区域时抛出当前内容 */
  suffixClick: [value: string];
}>();

const value = defineModel<string>({ default: '' });

defineSlots<{
  prefix?: (props: { value: string; disabled: boolean }) => unknown;
  suffix?: (props: { value: string; disabled: boolean }) => unknown;
}>();

const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));

function handleInput(nextValue: string) {
  emit('input', nextValue);
}

function handleSuffixClick(nextValue: string) {
  emit('suffixClick', nextValue);
}
</script>

<template>
  <div class="label-input" :class="{ 'is-disabled': disabled }">
    <span class="label-input-text">{{ label }}：</span>
    <Input
      v-bind="$attrs"
      v-model="value"
      class="label-input-control"
      width="100%"
      :placeholder="placeholder"
      :disabled="disabled"
      :bordered="false"
      @input="handleInput"
      @suffix-click="handleSuffixClick"
    >
      <template v-if="$slots.prefix" #prefix="{ value: slotValue, disabled: slotDisabled }">
        <slot name="prefix" :value="slotValue" :disabled="slotDisabled" />
      </template>
      <template v-if="$slots.suffix" #suffix="{ value: slotValue, disabled: slotDisabled }">
        <slot name="suffix" :value="slotValue" :disabled="slotDisabled" />
      </template>
    </Input>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.label-input {
  @apply relative z-0 inline-flex h-8 min-w-0 items-center rounded border border-component-border bg-container pl-2 pr-2 transition-[border-color,box-shadow,background-color];
  width: v-bind(resolvedWidth);
}

.label-input:hover:not(.is-disabled):not(:focus-within) {
  @apply border-brand-black-hover;
}

.label-input:focus-within {
  @apply z-10 border-brand-black-active shadow-td-shadow-4;
}

.label-input.is-disabled {
  @apply cursor-not-allowed bg-color-page;
}

.label-input-text {
  @apply shrink-0 text-body-medium leading-[22px] font-medium text-font-black-gy2;
}

.label-input-control,
.label-input-control:hover,
.label-input-control.ant-input-affix-wrapper-focused,
.label-input-control.ant-input-affix-wrapper-focused:hover,
.label-input-control.ant-input-affix-wrapper-disabled {
  @apply !h-[30px] min-w-0 flex-1 !border-0 !bg-transparent !px-0 !shadow-none;
}

.label-input-control :deep(.ant-input) {
  @apply !bg-transparent !text-body-medium !text-font-black-gy1;
}

.label-input.is-disabled .label-input-text,
.label-input.is-disabled :deep(.ant-input),
.label-input.is-disabled :deep(.ant-input::placeholder) {
  @apply !text-font-black-gy4;
}
</style>
