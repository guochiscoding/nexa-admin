<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/Button.vue';
import DetailInfoTable from '@/components/DetailInfoTable.vue';
import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

import ComponentDocLayout from './components/ComponentDocLayout.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.secondaryLayoutDocs' }];
const previewBreadcrumbs = [{ titleKey: 'menu.componentLibrary', to: { name: 'componentLibrary' } }, { titleKey: 'menu.secondaryLayoutDocs' }];
const usage = computed(() => [
  t('componentDocs.docs.secondaryLayout.usage.detail'),
  t('componentDocs.docs.secondaryLayout.usage.actions'),
  t('componentDocs.docs.secondaryLayout.usage.scroll'),
]);
const infoItems = computed(() => [
  { key: 'layout', label: t('componentDocs.secondaryLayout.fields.layout'), value: 'SecondaryPageLayout' },
  { key: 'breadcrumb', label: t('componentDocs.secondaryLayout.fields.breadcrumb'), value: 'Slot / props' },
  { key: 'footer', label: t('componentDocs.secondaryLayout.fields.footer'), value: t('componentDocs.secondaryLayout.fields.optional') },
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs">
    <ComponentDocLayout
      :title="t('componentDocs.docs.secondaryLayout.title')"
      :description="t('componentDocs.docs.secondaryLayout.description')"
      :usage="usage"
    >
      <div class="layout-preview-shell">
        <SecondaryPageLayout :breadcrumbs="previewBreadcrumbs">
          <section class="layout-preview-section">
            <h2 class="layout-preview-title">
              {{ t('componentDocs.secondaryLayout.previewTitle') }}
            </h2>
            <p class="layout-preview-copy">
              {{ t('componentDocs.secondaryLayout.previewDescription') }}
            </p>
            <DetailInfoTable :items="infoItems" />
          </section>

          <template #actions>
            <Button type="primary" color-type="black">
              {{ t('common.save') }}
            </Button>
            <Button>
              {{ t('common.cancel') }}
            </Button>
          </template>
        </SecondaryPageLayout>
      </div>
    </ComponentDocLayout>
  </SecondaryPageLayout>
</template>

<style scoped>
@reference "../../styles/index.css";

.layout-preview-shell { @apply h-[520px] min-h-0 overflow-hidden rounded border border-component-border; }
.layout-preview-section { @apply rounded border border-component-border bg-container p-5 shadow-td-shadow-0; }
.layout-preview-title { @apply m-0 text-title-medium font-semibold text-font-black-gy1; }
.layout-preview-copy { @apply mb-4 mt-2 text-body-medium leading-6 text-font-black-gy2; }
</style>
