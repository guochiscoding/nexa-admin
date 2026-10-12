<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tabs, { type TabItem, type TabKey } from '@/components/Tabs.vue';

const { t } = useI18n();
const activeTab = ref<TabKey>('quality');
const tabs = computed<TabItem[]>(() => [
  { key: 'coverage', label: t('tabsPreview.coverage') },
  { key: 'quality', label: t('tabsPreview.quality') },
  { key: 'operations', label: t('tabsPreview.operations') },
  { key: 'review', label: t('tabsPreview.review') },
]);
const activeWorkOrderTab = ref<TabKey>('all');
const workOrderTabs = computed<TabItem[]>(() => [
  { key: 'all', label: t('tabsPreview.allWorkOrders'), count: 51 },
  { key: 'pending', label: t('tabsPreview.pendingWorkOrders'), count: 4 },
  { key: 'completed', label: t('tabsPreview.completedWorkOrders'), count: 4 },
]);
</script>

<template>
  <section class="tabs-com-page">
    <h2 class="section-title">
      {{ t('tabsPreview.title') }}
    </h2>
    <div class="tabs-preview-group">
      <Tabs v-model="activeTab" :items="tabs" />
      <Tabs v-model="activeWorkOrderTab" :items="workOrderTabs" :font-size="14" />
    </div>
  </section>
</template>

<style scoped>
@reference "../../../styles/index.css";

.tabs-com-page {
  @apply min-w-0 p-6;
}

.section-title {
  @apply mb-4 text-title-small text-font-black-gy1;
}

.tabs-preview-group {
  @apply flex min-w-0 flex-col gap-6;
}
</style>
