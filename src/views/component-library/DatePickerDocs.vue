<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';
import DatePickerCom from './components/DatePickerCom.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.componentDates' }];
const usage = computed(() => [
  t('componentDocs.docs.dates.usage.labeled'),
  t('componentDocs.docs.dates.usage.time'),
  t('componentDocs.docs.dates.usage.disabled'),
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.dates.title')"
      :description="t('componentDocs.docs.dates.description')"
      :usage="usage"
    >
      <DatePickerCom />
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>
