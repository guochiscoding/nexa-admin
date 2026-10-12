<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Empty } from 'ant-design-vue';

const props = withDefaults(defineProps<{
  description?: string;
}>(), {
  description: '',
});

const { t } = useI18n();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const resolvedDescription = computed(() => props.description || t('common.empty'));
</script>

<template>
  <div class="empty-wrapper" role="status">
    <Empty
      class="empty-content"
      :description="resolvedDescription"
      :image="simpleImage"
    />
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.empty-wrapper {
  @apply flex h-full w-full min-h-0 min-w-0 items-center justify-center;
}

.empty-content {
  @apply m-0 text-font-black-gy3;
}

.empty-content :deep(.ant-empty-description) {
  @apply text-body-medium text-font-black-gy3;
}
</style>
