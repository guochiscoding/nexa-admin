<script setup lang="ts">
import { computed } from 'vue';
import { Modal as AModal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import AppButton from '@/components/Button.vue';
import IconFont from '@/components/IconFont';

type ModalWidth = number | string;

const props = withDefaults(
  defineProps<{
    /** 弹窗标题 */
    title?: string;
    /** 弹窗宽度，最大不超过 960px */
    width?: ModalWidth;
    /** 确定按钮文案 */
    okText?: string;
    /** 取消按钮文案 */
    cancelText?: string;
    /** 确定按钮加载态 */
    confirmLoading?: boolean;
    /** 确定按钮禁用态 */
    okDisabled?: boolean;
    /** 取消按钮禁用态 */
    cancelDisabled?: boolean;
    /** 是否展示底部按钮 */
    showFooter?: boolean;
    /** 是否展示标题栏 */
    showHeader?: boolean;
    /** 点击遮罩是否关闭 */
    maskClosable?: boolean;
  }>(),
  {
    title: '',
    width: '640px',
    okText: undefined,
    cancelText: undefined,
    confirmLoading: false,
    okDisabled: false,
    cancelDisabled: false,
    showFooter: true,
    showHeader: true,
    maskClosable: true,
  },
);

const emit = defineEmits<{
  /** 点击确定按钮时触发 */
  ok: [];
  /** 点击取消、关闭图标或遮罩时触发 */
  cancel: [];
}>();

const open = defineModel<boolean>('open', { default: false });
const { t } = useI18n();

defineSlots<{
  default?: () => unknown;
  title?: () => unknown;
  footer?: () => unknown;
}>();

const modalWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
);
const resolvedOkText = computed(() => props.okText ?? t('common.confirm'));
const resolvedCancelText = computed(() => props.cancelText ?? t('common.cancel'));
const closeLabel = computed(() => t('common.close'));

function handleOk() {
  if (props.confirmLoading || props.okDisabled) return;
  emit('ok');
}

function handleCancel() {
  if (props.cancelDisabled) return;
  open.value = false;
  emit('cancel');
}
</script>

<template>
  <AModal
    v-model:open="open"
    class="app-modal"
    wrap-class-name="app-modal-wrap"
    centered
    :width="modalWidth"
    :footer="null"
    :closable="false"
    :mask-closable="maskClosable"
    @cancel="handleCancel"
  >
    <section class="app-modal-shell">
      <header v-if="showHeader" class="app-modal-header">
        <h2 class="app-modal-title">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>
        <button
          type="button"
          class="app-modal-close"
          :aria-label="closeLabel"
          @click="handleCancel"
        >
          <IconFont type="icon-icon-close" aria-hidden="true" />
        </button>
      </header>

      <div class="app-modal-body">
        <slot />
      </div>

      <footer v-if="showFooter" class="app-modal-footer">
        <slot name="footer">
          <AppButton
            type="primary"
            color-type="black"
            :disabled="okDisabled"
            :loading="confirmLoading"
            @click="handleOk"
          >
            {{ resolvedOkText }}
          </AppButton>
          <AppButton
            :disabled="cancelDisabled"
            @click="handleCancel"
          >
            {{ resolvedCancelText }}
          </AppButton>
        </slot>
      </footer>
    </section>
  </AModal>
</template>
