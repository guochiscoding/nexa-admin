<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import IconFont from '@/components/IconFont';

const props = withDefaults(
  defineProps<{
    /** 删除确认主文案，由业务页面传入具体对象和动作描述。 */
    title: string;
    /** 删除确认风险提示文案，用于承接权限页停用确认弹窗的红色提示样式。 */
    note: string;
    /** 确认按钮文案，默认交给调用方用 i18n 传入。 */
    okText: string;
    /** 取消按钮文案，默认交给调用方用 i18n 传入。 */
    cancelText: string;
    /** 确认动作加载态，接口删除中禁止重复确认。 */
    confirmLoading?: boolean;
    /** 取消按钮禁用态，通常与接口删除中保持一致。 */
    cancelDisabled?: boolean;
    /** 删除确认弹窗宽度，默认复用权限页停用确认弹窗尺寸。 */
    width?: number | string;
    /** 点击遮罩是否关闭，接口提交中应由调用方关闭。 */
    maskClosable?: boolean;
  }>(),
  {
    confirmLoading: false,
    cancelDisabled: false,
    width: '456px',
    maskClosable: true,
  },
);

const open = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  /** 点击确认按钮时触发，具体删除接口或本地删除逻辑由业务方处理。 */
  ok: [];
  /** 点击取消、关闭图标或遮罩时触发，业务方可在此清理待删除对象。 */
  cancel: [];
}>();

/** 透传确认事件，避免公共弹窗耦合任何业务删除接口。 */
function handleOk() {
  emit('ok');
}

/** 透传取消事件，避免公共弹窗持有业务侧待删除数据。 */
function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <Modal
    v-model:open="open"
    :show-header="false"
    :width="props.width"
    :ok-text="okText"
    :cancel-text="cancelText"
    :confirm-loading="confirmLoading"
    :cancel-disabled="cancelDisabled"
    :mask-closable="maskClosable"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="delete-confirm">
      <IconFont type="icon-icon-error-circle-filled" class="delete-confirm-icon" aria-hidden="true" />
      <div class="delete-confirm-content">
        <p class="delete-confirm-title">
          {{ title }}
        </p>
        <p class="delete-confirm-note">
          {{ note }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
@reference "../styles/index.css";

.delete-confirm { @apply flex items-start gap-2 pt-1; }
.delete-confirm-icon { @apply mt-0.5 shrink-0 text-(length:--font-size-titleLarge) text-warning-color; }
.delete-confirm-content { @apply grid gap-1; }
.delete-confirm-title { @apply m-0 text-body-medium font-medium text-font-black-gy1; }
.delete-confirm-note { @apply m-0 text-body-small text-error-color; }
</style>
