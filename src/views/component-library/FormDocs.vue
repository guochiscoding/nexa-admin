<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';
import TextCom from './components/TextCom.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.componentForms' }];
const usage = computed(() => [
  t('componentDocs.docs.forms.usage.filters'),
  t('componentDocs.docs.forms.usage.textarea'),
  t('componentDocs.docs.forms.usage.modal'),
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.forms.title')"
      :description="t('componentDocs.docs.forms.description')"
      :usage="usage"
    >
      <TextCom />
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>
