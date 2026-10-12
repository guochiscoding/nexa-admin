<script setup lang="ts">
/**
 * Input — 通用输入框
 *
 * 对外契约：
 * - v-model 绑定输入值
 * - input 事件在用户输入/清空时同步抛出当前内容
 * - prefix / suffix 插槽可配置输入框前后内容
 * - suffix-click 事件在点击 suffix 区域时抛出当前内容
 * - width / backgroundColor / bordered 可配置整体宽度、背景色、边框显示
 * - placeholder 可配置；未传时使用 i18n 默认输入占位文案
 */
import { computed } from 'vue';
import { Input as AInput } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

type InputWidth = number | string;

const props = withDefaults(
  defineProps<{
    /** 占位文案；不传则使用 common.inputPlaceholder */
    placeholder?: string;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: InputWidth;
    /** 背景色：支持 CSS 颜色值或 var(--token) */
    backgroundColor?: string;
    /** 是否展示边框 */
    bordered?: boolean;
  }>(),
  {
    placeholder: undefined,
    disabled: false,
    width: '240px',
    backgroundColor: undefined,
    bordered: true,
  },
);

const emit = defineEmits<{
  /** 用户输入或清空时抛出当前内容 */
  input: [value: string];
  /** 点击后缀区域时抛出当前内容 */
  suffixClick: [value: string];
}>();

const value = defineModel<string>({ default: '' });
const { t } = useI18n();

defineSlots<{
  prefix?: (props: { value: string; disabled: boolean }) => unknown;
  suffix?: (props: { value: string; disabled: boolean }) => unknown;
}>();

/** 解析占位文案：优先 props，否则使用全局 i18n 默认值。 */
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.inputPlaceholder'));

const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const resolvedBackgroundColor = computed(() => props.backgroundColor ?? 'var(--bg-color-container)');

function handleUpdateValue(nextValue: string) {
  value.value = nextValue;
  emit('input', nextValue);
}

function handleSuffixClick() {
  if (props.disabled) return;
  emit('suffixClick', value.value);
}
</script>

<template>
  <AInput
    :value="value"
    class="common-input"
    :class="{ 'is-borderless': !bordered }"
    :placeholder="resolvedPlaceholder"
    :disabled="disabled"
    allow-clear
    @update:value="handleUpdateValue"
  >
    <template v-if="$slots.prefix" #prefix>
      <span class="common-input-prefix">
        <slot name="prefix" :value="value" :disabled="disabled" />
      </span>
    </template>

    <template v-if="$slots.suffix" #suffix>
      <button
        type="button"
        class="common-input-suffix"
        :disabled="disabled"
        @click="handleSuffixClick"
      >
        <slot name="suffix" :value="value" :disabled="disabled" />
      </button>
    </template>
  </AInput>
</template>

<style scoped>
@reference "../styles/index.css";

.common-input {
  @apply bg-container;
  width: v-bind(resolvedWidth);
  background-color: v-bind(resolvedBackgroundColor);
}

.common-input :deep(.ant-input) {
  @apply bg-transparent;
}

.common-input.is-borderless,
.common-input.is-borderless:hover,
.common-input.is-borderless.ant-input-affix-wrapper-focused,
.common-input.is-borderless.ant-input-affix-wrapper-focused:hover {
  border-color: transparent !important;
  box-shadow: none !important;
}

.common-input-prefix {
  @apply inline-flex items-center text-font-black-gy3;
}

.common-input-suffix {
  @apply inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-font-blue-link;
}

.common-input-suffix:disabled {
  @apply cursor-not-allowed text-font-black-gy3;
}
</style>
