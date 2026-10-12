<script setup lang="ts">
/**
 * Textarea — 通用多行输入框
 *
 * 对外契约：
 * - v-model 绑定输入值
 * - input 事件在用户输入时同步抛出当前内容
 * - type 可配置为 textarea / input，默认 textarea
 * - maxLength 不传时不限制字数；传入时限制输入并显示字数统计
 * - 不限制字数时支持鼠标拖动调整高度；限制字数时高度由 height 控制
 */
import { computed } from 'vue';
import { Input as AInput, Textarea as ATextarea } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

type TextareaSize = number | string;
type TextareaType = 'textarea' | 'input';

const props = withDefaults(
  defineProps<{
    /** 展示形式：textarea 为多行输入，input 为单行输入 */
    type?: TextareaType;
    /** 占位文案；不传则使用 common.inputPlaceholder */
    placeholder?: string;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: TextareaSize;
    /** 输入区域高度：数字按 px 处理，字符串原样作为 CSS height */
    height?: TextareaSize;
    /** 背景色：支持 CSS 颜色值或 var(--token) */
    backgroundColor?: string;
    /** 是否展示边框 */
    bordered?: boolean;
    /** 最大字数；不传时不限制且不显示字数统计 */
    maxLength?: number;
  }>(),
  {
    type: 'textarea',
    placeholder: undefined,
    disabled: false,
    width: '400px',
    height: undefined,
    backgroundColor: undefined,
    bordered: true,
    maxLength: undefined,
  },
);

const emit = defineEmits<{
  /** 用户输入时抛出当前内容 */
  input: [value: string];
}>();

const value = defineModel<string>({ default: '' });
const { t } = useI18n();

const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.inputPlaceholder'));
const isInputType = computed(() => props.type === 'input');
const isLimited = computed(() => typeof props.maxLength === 'number');

const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const resolvedHeight = computed(() => resolveSize(props.height ?? (isInputType.value ? '32px' : '120px')));
const resolvedBackgroundColor = computed(() => props.backgroundColor ?? 'var(--bg-color-container)');

const displayValue = computed(() => {
  if (!isLimited.value || props.maxLength === undefined) return value.value;
  return value.value.slice(0, props.maxLength);
});

const countText = computed(() => {
  if (!isLimited.value || props.maxLength === undefined) return '';
  return `${displayValue.value.length}/${props.maxLength}`;
});

function resolveSize(size: TextareaSize) {
  return typeof size === 'number' ? `${size}px` : size;
}

function handleUpdateValue(nextValue: string) {
  const resolvedValue = isLimited.value && props.maxLength !== undefined
    ? nextValue.slice(0, props.maxLength)
    : nextValue;

  value.value = resolvedValue;
  emit('input', resolvedValue);
}
</script>

<template>
  <div class="common-textarea">
    <div
      class="common-textarea-control"
      :class="{
        'is-disabled': disabled,
        'is-borderless': !bordered,
        'is-input': isInputType,
        'is-limited': isLimited,
      }"
    >
      <template v-if="isInputType">
        <AInput
          :value="displayValue"
          class="common-textarea-field common-textarea-input-field"
          :placeholder="resolvedPlaceholder"
          :disabled="disabled"
          :maxlength="maxLength"
          @update:value="handleUpdateValue"
        />

        <span v-if="isLimited" class="common-textarea-input-count">
          {{ countText }}
        </span>
      </template>

      <ATextarea
        v-else
        :value="displayValue"
        autosize
        class="common-textarea-field"
        :placeholder="resolvedPlaceholder"
        :disabled="disabled"
        :maxlength="maxLength"
        @update:value="handleUpdateValue"
      />

      <div v-if="!isInputType && isLimited" class="common-textarea-count-row">
        <span class="common-textarea-count">{{ countText }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.common-textarea {
  width: v-bind(resolvedWidth);
}

.common-textarea-control {
  height: v-bind(resolvedHeight);
  background-color: v-bind(resolvedBackgroundColor);
}
</style>
