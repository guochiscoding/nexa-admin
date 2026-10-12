<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import RadioButtonGroup, {
  type RadioButtonOption,
  type RadioButtonValue,
} from '@/components/RadioButtonGroup.vue';

const { t } = useI18n();
const selected = ref<RadioButtonValue>('article');
const selectedDashboard = ref<RadioButtonValue>('dashboard');
const options = computed<RadioButtonOption[]>(() => [
  {
    value: 'article',
    label: t('radioButtonGroupPreview.article', { count: 23 }),
  },
  {
    value: 'model',
    label: t('radioButtonGroupPreview.model', { count: 14 }),
  },
]);
const dashboardOptions = computed<RadioButtonOption[]>(() => [
  { value: 'dashboard', label: t('radioButtonGroupPreview.dashboard') },
  {
    value: 'dashboardDetail',
    label: t('radioButtonGroupPreview.dashboard'),
  },
  { value: 'rules', label: t('radioButtonGroupPreview.rules') },
]);
</script>

<template>
  <section class="radio-button-group-preview">
    <h2 class="section-title">
      {{ t('radioButtonGroupPreview.title') }}
    </h2>
    <div class="preview-group">
      <RadioButtonGroup
        v-model="selected"
        :options="options"
        :aria-label="t('radioButtonGroupPreview.title')"
      />
      <RadioButtonGroup
        v-model="selectedDashboard"
        :options="dashboardOptions"
        :aria-label="t('radioButtonGroupPreview.title')"
      />
    </div>
  </section>
</template>

<style scoped>
@reference "../../../styles/index.css";

.radio-button-group-preview {
  @apply min-w-0 p-6;
}

.section-title {
  @apply mb-4 text-title-small text-font-black-gy1;
}

.preview-group {
  @apply flex min-w-0 flex-col items-start gap-4;
}
</style>
