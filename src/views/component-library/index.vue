<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

const { t } = useI18n();
const breadcrumbs = [{ titleKey: 'menu.componentLibrary' }];
const entries = computed(() => [
  { name: 'componentButtons', title: t('componentDocs.entries.buttons.title'), description: t('componentDocs.entries.buttons.description') },
  { name: 'componentForms', title: t('componentDocs.entries.forms.title'), description: t('componentDocs.entries.forms.description') },
  { name: 'componentDates', title: t('componentDocs.entries.dates.title'), description: t('componentDocs.entries.dates.description') },
  { name: 'componentTabs', title: t('componentDocs.entries.tabs.title'), description: t('componentDocs.entries.tabs.description') },
  { name: 'componentRadios', title: t('componentDocs.entries.radios.title'), description: t('componentDocs.entries.radios.description') },
  { name: 'componentSecondaryLayout', title: t('componentDocs.entries.secondaryLayout.title'), description: t('componentDocs.entries.secondaryLayout.description') },
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs" :show-back="false">
    <section class="component-index-page">
      <header class="component-index-header">
        <h1>{{ t('componentDocs.title') }}</h1>
        <p>{{ t('componentDocs.description') }}</p>
      </header>
      <div class="component-entry-grid">
        <RouterLink
          v-for="entry in entries"
          :key="entry.name"
          class="component-entry-card"
          :to="{ name: entry.name }"
        >
          <span class="entry-title">{{ entry.title }}</span>
          <span class="entry-description">{{ entry.description }}</span>
        </RouterLink>
      </div>
    </section>
  </SecondaryPageLayout>
</template>

<style scoped>
@reference "../../styles/index.css";

.component-index-page { @apply grid gap-5; }
.component-index-header { @apply grid gap-2; }
.component-index-header h1 { @apply m-0 text-title-medium font-semibold text-font-black-gy1; }
.component-index-header p { @apply m-0 max-w-[760px] text-body-medium leading-6 text-font-black-gy2; }
.component-entry-grid { @apply grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1; }
.component-entry-card { @apply grid min-h-32 gap-3 rounded border border-component-border bg-container p-5 no-underline shadow-td-shadow-0 hover:bg-container-hover; }
.entry-title { @apply text-title-small font-semibold text-font-black-gy1; }
.entry-description { @apply text-body-medium leading-6 text-font-black-gy2; }
</style>
