<script setup lang="ts">
import { computed } from 'vue';

import IconFont from '@/components/IconFont';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

type StatusConfig = {
  icon?: string;
  iconColor: string;
  textColor?: string;
  loading?: boolean;
};

const props = withDefaults(
  defineProps<{
    /** 样式状态，例如“已完成”；不传时按 text 匹配，沿用原有用法 */
    status?: string;
    /** 展示文案，可直接传接口返回的文本 */
    text: string;
  }>(),
  { status: undefined },
);

const statusConfigMap: Record<string, StatusConfig> = {
  failed: {
    icon: 'icon-icon-close-circle-filled',
    iconColor: 'var(--error-color)',
  },
  processing: {
    iconColor: 'var(--brand-blue)',
    textColor: 'var(--brand-blue)',
    loading: true,
  },
  pending: {
    icon: 'icon-icon-shield-alert-filled',
    iconColor: 'var(--warning-color)',
  },
  enabled: {
    icon: 'icon-icon-status-success-filled',
    iconColor: 'var(--success-color)',
  },
  disabled: {
    icon: 'icon-icon-send-filled',
    iconColor: 'var(--warning-color)',
  },
  completed: {
    icon: 'icon-icon-shield-check-filled',
    iconColor: 'var(--success-color)',
  },
  queued: {
    iconColor: 'var(--brand-blue)',
    textColor: 'var(--brand-blue)',
    loading: true,
  },
  draft: {
    icon: 'icon-icon-delete-cross-filled',
    iconColor: 'var(--error-color)',
  },
  notStarted: {
    icon: 'icon-icon-error-circle-filled',
    iconColor: 'var(--error-color)',
  },
  normal: {
    icon: 'icon-icon-home-work',
    iconColor: 'var(--success-color)',
  },
  失败: {
    icon: 'icon-icon-close-circle-filled',
    iconColor: 'var(--error-color)',
  },
  处理中: {
    iconColor: 'var(--brand-blue)',
    textColor: 'var(--brand-blue)',
    loading: true,
  },
  待处理: {
    icon: 'icon-icon-shield-alert-filled',
    iconColor: 'var(--warning-color)',
  },
  已启用: {
    icon: 'icon-icon-status-success-filled',
    iconColor: 'var(--success-color)',
  },
  已停用: {
    icon: 'icon-icon-send-filled',
    iconColor: 'var(--warning-color)',
  },
  已完成: {
    icon: 'icon-icon-shield-check-filled',
    iconColor: 'var(--success-color)',
  },
  排队中: {
    iconColor: 'var(--brand-blue)',
    textColor: 'var(--brand-blue)',
    loading: true,
  },
  草稿: {
    icon: 'icon-icon-delete-cross-filled',
    iconColor: 'var(--error-color)',
  },
  未开始: {
    icon: 'icon-icon-error-circle-filled',
    iconColor: 'var(--error-color)',
  },
  正常: {
    icon: 'icon-icon-home-work',
    iconColor: 'var(--success-color)',
  },
};

const fallbackConfig: StatusConfig = {
  icon: 'icon-icon-workspace-grid',
  iconColor: 'var(--Font-Black-Gy3)',
};

const statusConfig = computed(() => statusConfigMap[props.status ?? props.text] ?? fallbackConfig);

const statusIconColor = computed(() => statusConfig.value.iconColor);
const statusTextColor = computed(() => statusConfig.value.textColor ?? statusConfig.value.iconColor);
</script>

<template>
  <span class="status">
    <LoadingSpinner
      v-if="statusConfig.loading"
      class="status-icon"
      size="medium"
      :color="statusConfig.iconColor"
    />
    <IconFont
      v-else-if="statusConfig.icon"
      :type="statusConfig.icon"
      class="status-icon"
      aria-hidden="true"
    />
    <span class="status-text">{{ text }}</span>
  </span>
</template>

<style scoped>
@reference "../styles/index.css";

.status {
  @apply inline-flex items-center gap-1;
}

.status-icon {
  @apply  inline-flex shrink-0 items-center justify-center w-4 h-4 text-(length:--font-size-linkLarge) leading-4;
  color: v-bind(statusIconColor)
  
}

.status-text {
  @apply  text-body-medium leading-[14px];
  color: v-bind(statusTextColor)
}
</style>
