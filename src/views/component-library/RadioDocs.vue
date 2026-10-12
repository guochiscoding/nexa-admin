<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';
import RadioButtonGroupCom from './components/RadioButtonGroupCom.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.componentRadios' }];
const usage = computed(() => [
  t('componentDocs.docs.radios.usage.count'),
  t('componentDocs.docs.radios.usage.description'),
  t('componentDocs.docs.radios.usage.intent'),
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.radios.title')"
      :description="t('componentDocs.docs.radios.description')"
      :usage="usage"
    >
      <RadioButtonGroupCom />
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>
