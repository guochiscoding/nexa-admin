<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  description: string;
  title: string;
  usage: string[];
}>();

const { t } = useI18n();
const expanded = ref(true);
const usageItems = computed(() => props.usage.filter((item) => item.trim()));
</script>

<template>
  <section class="component-doc-layout">
    <header class="component-doc-header">
      <div>
        <h1 class="component-doc-title">
          {{ title }}
        </h1>
        <p class="component-doc-description">
          {{ description }}
        </p>
      </div>
      <button class="usage-toggle" type="button" @click="expanded = !expanded">
        {{ expanded ? t('componentDocs.collapseUsage') : t('componentDocs.expandUsage') }}
      </button>
    </header>

    <div v-if="expanded" class="usage-panel">
      <ol class="usage-list">
        <li v-for="item in usageItems" :key="item">
          {{ item }}
        </li>
      </ol>
    </div>

    <div class="component-doc-demo">
      <slot />
    </div>
  </section>
</template>

<style scoped>
@reference "../../../styles/index.css";

.component-doc-layout { @apply grid gap-4; }
.component-doc-header { @apply flex items-start justify-between gap-4 border-b border-component-stroke pb-4; }
.component-doc-title { @apply m-0 text-title-medium font-semibold text-font-black-gy1; }
.component-doc-description { @apply m-0 mt-2 max-w-[760px] text-body-medium leading-6 text-font-black-gy2; }
.usage-toggle { @apply h-8 shrink-0 cursor-pointer rounded border border-component-border bg-container px-3 text-body-medium text-font-black-gy1 hover:bg-container-hover; }
.usage-panel { @apply rounded border border-component-border bg-color-secondarycontainer px-4 py-3; }
.usage-list { @apply m-0 grid gap-2 pl-4 text-body-medium leading-6 text-font-black-gy2; }
.component-doc-demo { @apply min-w-0; }
</style>
