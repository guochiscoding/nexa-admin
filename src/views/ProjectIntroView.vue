<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

const { t } = useI18n();
const breadcrumbs = computed(() => [{ title: t('menu.projectIntro') }]);

const featureItems = computed(() => [
  {
    key: 'foundation',
    title: t('projectIntro.features.foundation.title'),
    description: t('projectIntro.features.foundation.description'),
  },
  {
    key: 'permission',
    title: t('projectIntro.features.permission.title'),
    description: t('projectIntro.features.permission.description'),
  },
  {
    key: 'theme',
    title: t('projectIntro.features.theme.title'),
    description: t('projectIntro.features.theme.description'),
  },
  {
    key: 'table',
    title: t('projectIntro.features.table.title'),
    description: t('projectIntro.features.table.description'),
  },
  {
    key: 'docs',
    title: t('projectIntro.features.docs.title'),
    description: t('projectIntro.features.docs.description'),
  },
  {
    key: 'quality',
    title: t('projectIntro.features.quality.title'),
    description: t('projectIntro.features.quality.description'),
  },
]);

const scenarioItems = computed(() => [
  t('projectIntro.scenarios.admin'),
  t('projectIntro.scenarios.operation'),
  t('projectIntro.scenarios.saas'),
  t('projectIntro.scenarios.internal'),
]);

const stackRows = computed(() => [
  {
    key: 'framework',
    module: t('projectIntro.stack.framework.module'),
    content: t('projectIntro.stack.framework.content'),
  },
  {
    key: 'ui',
    module: t('projectIntro.stack.ui.module'),
    content: t('projectIntro.stack.ui.content'),
  },
  {
    key: 'state',
    module: t('projectIntro.stack.state.module'),
    content: t('projectIntro.stack.state.content'),
  },
  {
    key: 'style',
    module: t('projectIntro.stack.style.module'),
    content: t('projectIntro.stack.style.content'),
  },
  {
    key: 'quality',
    module: t('projectIntro.stack.quality.module'),
    content: t('projectIntro.stack.quality.content'),
  },
]);

const browserRows = computed(() => [
  {
    key: 'development',
    environment: t('projectIntro.browser.development.environment'),
    support: t('projectIntro.browser.development.support'),
  },
  {
    key: 'production',
    environment: t('projectIntro.browser.production.environment'),
    support: t('projectIntro.browser.production.support'),
  },
]);
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs" :show-back="false">
    <article class="project-doc-page">
      <header class="project-doc-header">
        <h1>{{ t('projectIntro.title') }}</h1>
        <p>{{ t('projectIntro.description') }}</p>
      </header>

      <section class="project-doc-section">
        <h2>{{ t('projectIntro.about.title') }}</h2>
        <p>{{ t('projectIntro.about.paragraphOne') }}</p>
        <p>{{ t('projectIntro.about.paragraphTwo') }}</p>
      </section>

      <section class="project-doc-section">
        <h2>{{ t('projectIntro.features.title') }}</h2>
        <ul class="feature-list">
          <li v-for="item in featureItems" :key="item.key">
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </li>
        </ul>
      </section>

      <section class="project-doc-section">
        <h2>{{ t('projectIntro.scenarios.title') }}</h2>
        <p>{{ t('projectIntro.scenarios.description') }}</p>
        <ul class="simple-list">
          <li v-for="item in scenarioItems" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="project-doc-section">
        <h2>{{ t('projectIntro.stack.title') }}</h2>
        <div class="doc-table-wrap">
          <table class="doc-table">
            <thead>
              <tr>
                <th>{{ t('projectIntro.stack.columns.module') }}</th>
                <th>{{ t('projectIntro.stack.columns.content') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in stackRows" :key="row.key">
                <td>{{ row.module }}</td>
                <td>{{ row.content }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="project-doc-section">
        <h2>{{ t('projectIntro.browser.title') }}</h2>
        <div class="doc-table-wrap">
          <table class="doc-table">
            <thead>
              <tr>
                <th>{{ t('projectIntro.browser.columns.environment') }}</th>
                <th>{{ t('projectIntro.browser.columns.support') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in browserRows" :key="row.key">
                <td>{{ row.environment }}</td>
                <td>{{ row.support }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  </SecondaryPageLayout>
</template>

<style scoped>
@reference "../styles/index.css";

.project-doc-page { @apply mx-auto grid w-full max-w-[920px] gap-8 pb-8; }
.project-doc-header { @apply grid gap-3 border-b border-component-stroke pb-6; }
.project-doc-header h1 { @apply m-0 text-headline-small font-semibold leading-tight text-font-black-gy1; }
.project-doc-header p { @apply m-0 max-w-[820px] text-body-medium leading-7 text-font-black-gy2; }
.project-doc-section { @apply grid gap-3; }
.project-doc-section h2 { @apply m-0 border-b border-component-stroke pb-2 text-title-medium font-semibold text-font-black-gy1; }
.project-doc-section p { @apply m-0 text-body-medium leading-7 text-font-black-gy2; }
.feature-list { @apply m-0 grid gap-2 pl-5 text-body-medium leading-7 text-font-black-gy2; }
.feature-list li { @apply pl-1; }
.feature-list strong { @apply font-semibold text-font-black-gy1; }
.feature-list span { @apply ml-1; }
.simple-list { @apply m-0 grid gap-2 pl-5 text-body-medium leading-7 text-font-black-gy2; }
.doc-table-wrap { @apply overflow-hidden rounded border border-component-border bg-container; }
.doc-table { @apply w-full border-collapse text-left text-body-medium text-font-black-gy2; }
.doc-table th { @apply bg-color-secondarycontainer px-4 py-3 font-semibold text-font-black-gy1; }
.doc-table td { @apply border-t border-component-border px-4 py-3 align-top leading-6; }
</style>
