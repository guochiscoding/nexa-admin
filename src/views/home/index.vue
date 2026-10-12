<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import StatisticCards, { type StatisticCardItem } from '@/components/StatisticCards.vue';
import { usePreferencesStore } from '@/stores/preferences';

import HomeTrendChart from './components/HomeTrendChart.vue';

const { t } = useI18n();
const preferences = usePreferencesStore();

const statisticItems = computed<StatisticCardItem[]>(() => [
  {
    key: 'routes',
    title: t('home.dashboard.stats.routes'),
    value: 11,
    unit: t('home.dashboard.stats.routesUnit'),
    colorType: 'blue',
    updatedAt: t('home.dashboard.updatedAt'),
  },
  {
    key: 'components',
    title: t('home.dashboard.stats.components'),
    value: 16,
    unit: t('home.dashboard.stats.componentsUnit'),
    updatedAt: t('home.dashboard.updatedAt'),
  },
  {
    key: 'themes',
    title: t('home.dashboard.stats.themes'),
    value: 3,
    unit: t('home.dashboard.stats.themesUnit'),
    updatedAt: t('home.dashboard.updatedAt'),
  },
  {
    key: 'coverage',
    title: t('home.dashboard.stats.coverage'),
    value: '100',
    unit: '%',
    colorType: 'success',
    updatedAt: t('home.dashboard.updatedAt'),
  },
]);

const systemItems = computed(() => [
  {
    key: 'request',
    label: t('home.dashboard.system.request'),
    value: t('home.dashboard.system.ready'),
    barClass: 'is-complete',
  },
  {
    key: 'permission',
    label: t('home.dashboard.system.permission'),
    value: t('home.dashboard.system.ready'),
    barClass: 'is-complete',
  },
  {
    key: 'theme',
    label: t('home.dashboard.system.theme'),
    value: getThemeModeLabel(),
    barClass: 'is-strong',
  },
  {
    key: 'locale',
    label: t('home.dashboard.system.locale'),
    value: preferences.locale,
    barClass: 'is-medium',
  },
]);

const capabilityItems = computed(() => [
  {
    key: 'layout',
    label: t('home.dashboard.capabilities.layout'),
    value: t(`preferences.layout${preferences.layout === 'side' ? 'Side' : 'Top'}`),
  },
  {
    key: 'table',
    label: t('home.dashboard.capabilities.table'),
    value: t('home.dashboard.capabilities.tableValue'),
  },
  {
    key: 'docs',
    label: t('home.dashboard.capabilities.docs'),
    value: t('home.dashboard.capabilities.docsValue'),
  },
  {
    key: 'auth',
    label: t('home.dashboard.capabilities.auth'),
    value: t('home.dashboard.capabilities.authValue'),
  },
]);

const activityItems = computed(() => [
  {
    key: 'theme',
    title: t('home.dashboard.activity.theme'),
    meta: getThemeModeLabel(),
  },
  {
    key: 'i18n',
    title: t('home.dashboard.activity.i18n'),
    meta: preferences.locale,
  },
  {
    key: 'permission',
    title: t('home.dashboard.activity.permission'),
    meta: t('home.dashboard.activity.permissionMeta'),
  },
]);

const trendMetrics = computed(() => [
  {
    key: 'build',
    label: t('home.dashboard.trend.metrics.build'),
    value: '99.8%',
  },
  {
    key: 'response',
    label: t('home.dashboard.trend.metrics.response'),
    value: '126ms',
  },
]);

function getThemeModeLabel() {
  if (preferences.theme === 'system') return t('preferences.modeSystem');
  return t(`preferences.mode${preferences.theme === 'dark' ? 'Dark' : 'Light'}`);
}
</script>

<template>
  <section class="home-page">
    <header class="page-heading">
      <div>
        <p class="page-eyebrow">
          {{ t('home.capability') }}
        </p>
        <h1 class="page-title">
          {{ t('home.title') }}
        </h1>
        <span class="page-description">{{ t('home.description') }}</span>
      </div>
    </header>

    <StatisticCards class="home-statistics" :items="statisticItems" />

    <div class="dashboard-grid">
      <section class="dashboard-panel dashboard-panel-trend">
        <div class="dashboard-panel-header">
          <div>
            <h2 class="dashboard-panel-title">
              {{ t('home.dashboard.trend.title') }}
            </h2>
            <p class="dashboard-panel-subtitle">
              {{ t('home.dashboard.trend.subtitle') }}
            </p>
          </div>
        </div>

        <div class="dashboard-trend-body">
          <HomeTrendChart />
        </div>

        <div class="dashboard-trend-metrics">
          <article v-for="metric in trendMetrics" :key="metric.key" class="dashboard-trend-metric">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </article>
        </div>
      </section>

      <section class="dashboard-panel dashboard-panel-primary">
        <div class="dashboard-panel-header">
          <div>
            <h2 class="dashboard-panel-title">
              {{ t('home.dashboard.system.title') }}
            </h2>
            <p class="dashboard-panel-subtitle">
              {{ t('home.dashboard.system.subtitle') }}
            </p>
          </div>
          <span class="dashboard-status-pill">
            <i class="dashboard-status-dot" />
            {{ t('home.dashboard.system.status') }}
          </span>
        </div>

        <div class="dashboard-health-list">
          <article v-for="item in systemItems" :key="item.key" class="dashboard-health-item">
            <div class="dashboard-health-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
            <div class="dashboard-health-track">
              <i class="dashboard-health-bar" :class="item.barClass" />
            </div>
          </article>
        </div>
      </section>

      <div class="dashboard-side-stack">
        <section class="dashboard-panel dashboard-panel-secondary">
          <div class="dashboard-panel-header">
            <div>
              <h2 class="dashboard-panel-title">
                {{ t('home.dashboard.capabilities.title') }}
              </h2>
            </div>
          </div>

          <div class="dashboard-capability-grid">
            <article v-for="item in capabilityItems" :key="item.key" class="dashboard-capability-item">
              <span class="dashboard-capability-label">{{ item.label }}</span>
              <strong class="dashboard-capability-value">{{ item.value }}</strong>
            </article>
          </div>
        </section>

        <section class="dashboard-panel dashboard-panel-activity">
          <div class="dashboard-panel-header">
            <div>
              <h2 class="dashboard-panel-title">
                {{ t('home.dashboard.activity.title') }}
              </h2>
            </div>
          </div>

          <ol class="dashboard-activity-list">
            <li v-for="item in activityItems" :key="item.key" class="dashboard-activity-item">
              <i class="dashboard-activity-marker" />
              <span class="dashboard-activity-copy">
                <strong>{{ item.title }}</strong>
                <small>{{ item.meta }}</small>
              </span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../../styles/index.css";

.home-page {
  @apply relative grid h-full min-h-0 flex-1 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden gap-4 px-5 py-4 max-lg:overflow-y-auto max-sm:p-4;
}

.home-page::before {
  @apply pointer-events-none absolute inset-0 bg-brand-blue-light opacity-30;
  content: "";
  mask-image: radial-gradient(circle at top right, black, transparent 42%);
}

.dashboard-grid {
  @apply relative grid min-h-0 min-w-0 grid-cols-12 gap-4 max-xl:grid-cols-6 max-lg:grid-cols-1;
}

.dashboard-panel {
  @apply relative min-h-0 min-w-0 overflow-hidden rounded-lg border border-component-stroke bg-container p-4 shadow-td-shadow-0;
}

.home-statistics {
  @apply gap-4;
}

.home-statistics :deep(.statistic-card) {
  @apply relative overflow-hidden border border-component-stroke px-4 py-3;
}

.home-statistics :deep(.statistic-card-title) {
  @apply text-body-medium;
}

.home-statistics :deep(.statistic-card-value) {
  @apply min-h-8 text-title-large leading-8;
}

.home-statistics :deep(.statistic-card-meta) {
  @apply hidden;
}

.dashboard-panel-trend {
  @apply col-span-5 grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] max-xl:col-span-3 max-lg:col-span-1;
}

.dashboard-panel-primary {
  @apply col-span-4 max-xl:col-span-3 max-lg:col-span-1;
}

.dashboard-side-stack {
  @apply col-span-3 grid min-h-0 gap-4 max-xl:col-span-6 max-xl:grid-cols-2 max-lg:col-span-1 max-lg:grid-cols-1;
}

.dashboard-panel-header {
  @apply mb-4 flex min-w-0 items-start justify-between gap-4;
}

.dashboard-panel-title {
  @apply m-0 text-title-medium font-semibold text-font-black-gy1;
}

.dashboard-panel-subtitle {
  @apply mt-1 mb-0 text-body-medium text-font-black-gy3;
}

.dashboard-trend-body {
  @apply min-h-0 rounded border border-component-border bg-container px-2 py-1 shadow-td-shadow-0;
}

.dashboard-trend-metrics {
  @apply mt-3 grid grid-cols-2 gap-3;
}

.dashboard-trend-metric {
  @apply rounded border border-component-border bg-container px-3 py-2 shadow-td-shadow-0;
}

.dashboard-trend-metric span {
  @apply block text-body-small text-font-black-gy3;
}

.dashboard-trend-metric strong {
  @apply mt-1 block text-title-medium font-semibold text-font-black-gy1;
}

.dashboard-status-pill {
  @apply inline-flex shrink-0 items-center gap-1.5 rounded border border-brand-blue bg-brand-blue-light px-2 py-1 text-body-small font-medium text-brand-blue;
}

.dashboard-status-dot {
  @apply size-1.5 rounded-full bg-brand-blue;
}

.dashboard-health-list {
  @apply grid gap-3;
}

.dashboard-health-item {
  @apply grid gap-2;
}

.dashboard-health-row {
  @apply flex items-center justify-between gap-3 text-body-medium text-font-black-gy2;
}

.dashboard-health-row strong {
  @apply font-semibold text-font-black-gy1;
}

.dashboard-health-track {
  @apply h-2 overflow-hidden rounded-full bg-brand-blue-light;
}

.dashboard-health-bar {
  @apply block h-full rounded-full bg-brand-blue;
}

.dashboard-health-bar.is-complete {
  @apply w-full;
}

.dashboard-health-bar.is-strong {
  @apply w-11/12;
}

.dashboard-health-bar.is-medium {
  @apply w-4/5 bg-brand-black;
}

.dashboard-capability-grid {
  @apply grid grid-cols-2 gap-3;
}

.dashboard-capability-item {
  @apply grid min-h-16 content-between gap-2 rounded border border-component-border bg-container-hover p-3;
}

.dashboard-capability-label {
  @apply text-body-small text-font-black-gy3;
}

.dashboard-capability-value {
  @apply text-title-small font-semibold text-font-black-gy1;
}

.dashboard-activity-list {
  @apply m-0 grid list-none gap-4 p-0;
}

.dashboard-activity-item {
  @apply grid grid-cols-[auto_minmax(0,1fr)] gap-3;
}

.dashboard-activity-marker {
  @apply mt-1.5 size-2 rounded-full bg-brand-blue shadow-td-shadow-4;
}

.dashboard-activity-copy {
  @apply grid min-w-0 gap-1;
}

.dashboard-activity-copy strong {
  @apply text-body-medium font-semibold text-font-black-gy1;
}

.dashboard-activity-copy small {
  @apply text-body-small text-font-black-gy3;
}
</style>
