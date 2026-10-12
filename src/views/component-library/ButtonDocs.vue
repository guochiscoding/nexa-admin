<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';
import ButtonCom from './components/ButtonCom.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.componentButtons' }];
const usage = computed(() => [
  t('componentDocs.docs.buttons.usage.primary'),
  t('componentDocs.docs.buttons.usage.text'),
  t('componentDocs.docs.buttons.usage.loading'),
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.buttons.title')"
      :description="t('componentDocs.docs.buttons.description')"
      :usage="usage"
    >
      <ButtonCom />
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>
