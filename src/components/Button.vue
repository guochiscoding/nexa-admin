<script setup lang="ts">
import { computed } from 'vue';
import { Button as AButton } from 'ant-design-vue';

import LoadingSpinner from '@/components/LoadingSpinner.vue';

defineOptions({ inheritAttrs: false });

/** 按钮外观类型 */
type ButtonType =
  | 'default' // 固定灰色边框、黑色文字，不随 colorType 换色
  | 'outline' // 描边；文字边框颜色一致,透明背景
  | 'primary' // 实心、白色文字
  | 'text' // 纯文字
  | 'solid' // 描边带底色
  | 'ghost-white' // 描边，透明背景，文字边框颜色不一致
  | 'ghost-gray'
  | 'link' // 纯文字带下划线

/** 按钮颜色类型：黑色、品牌蓝色、危险操作红色 */
type ButtonColorType = 'black' | 'blue' | 'red';

const props = withDefaults(
  defineProps<{
    /** 外观类型，默认 default */
    type?: ButtonType;
    /** 颜色类型，默认 black；type=default 时不参与换色 */
    colorType?: ButtonColorType;
    /** 尺寸：small 12px 字号 / 8px 横向间距；medium 14px / 16px；large 16px / 24px */
    size?: 'small' | 'medium' | 'large';
    /** 是否禁用，禁用时不触发点击 */
    disabled?: boolean;
    /** 是否加载，复用 LoadingSpinner 并禁止重复点击 */
    loading?: boolean;
    /** 是否有权限，false 时不渲染按钮 */
    hasPermission?: boolean;
    /** 原生表单行为：普通按钮、提交表单、重置表单 */
    htmlType?: 'button' | 'submit' | 'reset';
  }>(),
  {
    type: 'default',
    colorType: 'black',
    size: 'medium',
    disabled: false,
    loading: false,
    hasPermission: true,
    htmlType: 'button',
  },
);

const emit = defineEmits<{
  /** 按钮有权限、可用且非加载状态时触发 */
  click: [event: MouseEvent];
}>();

const slots = defineSlots<{
  /** 按钮文案，由调用方提供国际化内容 */
  default?: () => unknown;
  /** 左侧图标，loading 时由 LoadingSpinner 替换 */
  icon?: () => unknown;
  /** 右侧图标，例如下拉箭头 */
  suffixIcon?: () => unknown;
}>();

const isDisabled = computed(() => props.disabled || props.loading);

const spinnerSize = computed(() =>
  props.size === 'large' ? 'medium' : 'small',
);

function handleClick(event: MouseEvent) {
  if (!props.hasPermission || isDisabled.value) {
    event.preventDefault();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <AButton
    v-if="hasPermission"
    v-bind="$attrs"
    class="app-button"
    :class="[
      `app-button--${type}`,
      `app-button-color--${colorType}`,
      `app-button--${size}`,
      { 'is-loading': loading },
    ]"
    type="default"
    :disabled="isDisabled"
    :html-type="htmlType"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <span class="app-button-content">
      <span
        v-if="loading || slots.icon"
        class="app-button-icon"
        aria-hidden="true"
      >
        <LoadingSpinner v-if="loading" :size="spinnerSize" />
        <slot v-else name="icon" />
      </span>
      <span v-if="slots.default" class="app-button-label">
        <slot />
      </span>
      <span v-if="slots.suffixIcon" class="app-button-icon app-button-suffix-icon" aria-hidden="true">
        <slot name="suffixIcon" />
      </span>
    </span>
  </AButton>
</template>

<style scoped>
@reference "../styles/index.css";

.app-button.ant-btn {
  @apply inline-flex max-w-full items-center justify-center rounded-[4px] shadow-none;
}

.app-button--small {
  @apply px-2 text-xs;
}

.app-button--medium {
  @apply px-4 text-sm;
}

.app-button--large {
  @apply px-6 text-base;
}

.app-button-color--black {
  @apply [--button-color:var(--brand-black)]
    [--button-hover:var(--brand-black-hover)]
    [--button-active:var(--brand-black-active)]
    [--button-disabled:var(--brand-black-disabled)]
    [--button-outline-bg:var(--bg-color-container)];
}

.app-button-color--blue {
  @apply [--button-color:var(--brand-blue)]
    [--button-hover:var(--brand-blue-hover)]
    [--button-active:var(--brand-blue-active)]
    [--button-disabled:var(--brand-blue-disabled)]
    [--button-outline-bg:var(--brand-blue-light)];
}

.app-button-color--red {
  @apply [--button-color:var(--error-color)]
    [--button-hover:var(--error-hover)]
    [--button-active:var(--error-active)]
    [--button-disabled:var(--error-disabled)]
    [--button-outline-bg:var(--bg-color-container)];
}

:global(:root[data-theme='dark']) .app-button-color--black {
  --button-color: var(--Font-Black-Gy2);
  --button-hover: var(--Font-Black-Gy1);
  --button-active: var(--Font-Black-Gy3);
  --button-disabled: var(--brand-black-disabled);
  --button-outline-bg: var(--brand-black-light);
}

:global(:root[data-theme='dark']) .app-button-color--blue,
:global(:root[data-theme='dark']) .app-button-color--red {
  --button-outline-bg: var(--bg-color-container);
}

.app-button--default { @apply border-component-border text-font-black-gy1; }
.app-button--outline { @apply border-(--button-color) bg-transparent text-(--button-color); }
.app-button--primary { @apply border-(--button-color) bg-(--button-color) text-font-white-gy1; }
.app-button--text { @apply border-transparent bg-transparent text-(--button-color); }
.app-button--solid { @apply border-(--button-color) bg-(--button-outline-bg) text-(--button-color); }
.app-button--ghost-white { @apply border-font-white-gy1 bg-transparent text-font-white-gy1; }
.app-button--ghost-gray { @apply border-font-white-gy4 bg-transparent text-font-white-gy1; }
.app-button--link { @apply border-transparent bg-transparent text-(--button-color) underline underline-offset-[2px]; }

:global(:root[data-theme='dark']) .app-button-color--black.app-button--primary {
  @apply !text-font-white-gy1-anti;
}

:global(:root[data-theme='dark']) .app-button--default:not(:disabled):hover {
  @apply !border-font-black-gy2 !bg-container-hover !text-font-black-gy1;
}

:global(:root[data-theme='dark']) .app-button--default:not(:disabled):active {
  @apply !border-font-black-gy1 !bg-container-active !text-font-black-gy1;
}

.app-button--default:not(:disabled):hover { @apply border-brand-black-hover bg-transparent text-brand-black-hover; }
.app-button--outline:not(:disabled):hover { @apply border-(--button-hover) bg-transparent text-(--button-hover); }
.app-button--primary:not(:disabled):hover { @apply border-(--button-hover) bg-(--button-hover) text-font-white-gy1; }
.app-button--solid:not(:disabled):hover { @apply border-(--button-hover) bg-(--button-outline-bg) text-(--button-hover); }
.app-button--text:not(:disabled):hover { @apply text-(--button-hover) border-transparent }
.app-button--link:not(:disabled):hover { @apply text-(--button-hover) border-transparent underline underline-offset-[2px]; }
.app-button--solid:not(:disabled):hover { @apply border-(--button-hover) bg-(--button-outline-bg) text-(--button-hover); }
.app-button--ghost-white:not(:disabled):hover { @apply border-font-white-gy2 bg-but-white-hover text-font-white-gy1; }
.app-button--ghost-gray:not(:disabled):hover { @apply border-font-white-gy4 bg-but-white-hover text-font-white-gy1; }

:global(:root[data-theme='dark']) .app-button-color--black.app-button--primary:not(:disabled):hover {
  @apply !text-font-white-gy1-anti;
}


.app-button--default:not(:disabled):active { @apply border-brand-black-active bg-transparent text-brand-black-active; }
.app-button--outline:not(:disabled):active { @apply border-(--button-active) bg-transparent text-(--button-active); }
.app-button--primary:not(:disabled):active { @apply border-(--button-active) bg-(--button-active) text-font-white-gy1; }
.app-button--text:not(:disabled):active { @apply text-(--button-active) border-transparent }
.app-button--link:not(:disabled):active { @apply text-(--button-active) border-transparent underline underline-offset-[2px]; }
.app-button--solid:not(:disabled):active { @apply border-(--button-active) bg-(--button-outline-bg) text-(--button-active); }
.app-button--ghost-white:not(:disabled):active { @apply border-font-white-gy3 bg-but-white-active text-font-white-gy1; }
.app-button--ghost-gray:not(:disabled):active { @apply border-font-white-gy4 bg-but-white-active text-font-white-gy1; }

:global(:root[data-theme='dark']) .app-button-color--black.app-button--primary:not(:disabled):active {
  @apply !text-font-white-gy1-anti;
}


.app-button:disabled { @apply [--button-color:var(--button-disabled)] cursor-not-allowed; }
.app-button--default:disabled { @apply border-component-border bg-container text-font-black-gy4; }
.app-button--outline:disabled { @apply border-(--button-disabled) bg-transparent text-(--button-disabled); }
.app-button--primary:disabled { @apply border-(--button-disabled) bg-(--button-disabled) text-font-white-gy1; }
.app-button--text:disabled { @apply border-transparent bg-transparent text-(--button-disabled); }
.app-button--solid:disabled { @apply border-(--button-disabled) bg-(--button-outline-bg) text-(--button-disabled); }
.app-button--link:disabled { @apply border-transparent bg-transparent text-(--button-disabled) underline underline-offset-[2px]; }
.app-button--ghost-white:disabled { @apply border-font-white-gy4 bg-transparent text-font-white-gy4; }
.app-button--ghost-gray:disabled { @apply border-font-white-gy4 bg-transparent text-font-white-gy4; }

.app-button-content { @apply inline-flex max-w-full items-center justify-center gap-1.5; }
.app-button-label { @apply min-w-0 truncate; }
.app-button-icon {
  @apply inline-flex shrink-0 items-center justify-center leading-none text-current px-[-8px];
}
.app-button-suffix-icon {
  @apply px-[-8px];
}
</style>
