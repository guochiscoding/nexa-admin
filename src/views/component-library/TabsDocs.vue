<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';
import TabsCom from './components/TabsCom.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.componentTabs' }];
const usage = computed(() => [
  t('componentDocs.docs.tabs.usage.short'),
  t('componentDocs.docs.tabs.usage.count'),
  t('componentDocs.docs.tabs.usage.navigation'),
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.tabs.title')"
      :description="t('componentDocs.docs.tabs.description')"
      :usage="usage"
    >
      <TabsCom />
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>
