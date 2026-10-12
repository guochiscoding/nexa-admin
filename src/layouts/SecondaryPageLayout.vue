<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import IconFont from '@/components/IconFont';

interface BreadcrumbItemConfig {
  title?: string;
  titleKey?: string;
  to?: string | object;
}

const props = withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItemConfig[];
  showBack?: boolean;
  contentClass?: string;
}>(), {
  breadcrumbs: () => [],
  showBack: true,
  contentClass: '',
});

const emit = defineEmits<{
  back: [];
}>();

const { t } = useI18n();
const router = useRouter();

const computedBreadcrumbs = computed(() => props.breadcrumbs);

function handleBack() {
  emit('back');
  router.back();
}
</script>

<template>
  <div class="secondary-layout-shell">
    <header class="secondary-top-bar">
      <slot name="breadcrumb">
        <nav class="custom-breadcrumb-nav" aria-label="Breadcrumb">
          <button
            v-if="showBack"
            type="button"
            class="back-icon-btn"
            :aria-label="t('layout.back', '返回')"
            @click="handleBack"
          >
            <IconFont type="icon-icon-arrow-left" class="back-icon" />
          </button>
          <ol class="breadcrumb-list">
            <li
              v-for="(item, index) in computedBreadcrumbs"
              :key="index"
              class="breadcrumb-item"
            >
              <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">/</span>
              <router-link
                v-if="item.to"
                :to="item.to"
                class="breadcrumb-link"
              >
                {{ item.title ?? (item.titleKey ? t(item.titleKey) : '') }}
              </router-link>
              <span
                v-else
                class="breadcrumb-text"
                :class="{ 'is-current': index === computedBreadcrumbs.length - 1 }"
              >
                {{ item.title ?? (item.titleKey ? t(item.titleKey) : '') }}
              </span>
            </li>
          </ol>
        </nav>
      </slot>
    </header>

    <main class="secondary-main-content" :class="contentClass">
      <slot />
    </main>

    <footer v-if="$slots.actions || $slots.footer" class="secondary-bottom-bar">
      <div class="secondary-actions-center">
        <slot name="actions">
          <slot name="footer" />
        </slot>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.secondary-layout-shell {
  @apply flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-page;
}

.secondary-top-bar {
  @apply flex w-full shrink-0 items-center bg-transparent px-6 pt-6 pb-5;
}

.custom-breadcrumb-nav {
  @apply flex items-center gap-2;
}

.back-icon-btn {
  @apply flex size-5 cursor-pointer items-center justify-center rounded border-0 bg-color-container p-0 text-font-black-gy2 transition-colors hover:text-font-black-gy1;
}

.back-icon {
  @apply text-base text-font-black-gy1;
}

.breadcrumb-list {
  @apply m-0 flex list-none items-center p-0 text-body-small text-font-black-gy3;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-separator {
  @apply select-none text-font-black-gy4;
}

.breadcrumb-link {
  @apply text-font-black-gy3 no-underline transition-colors hover:text-font-blue-link;
}

.breadcrumb-text {
  @apply text-font-black-gy3;
}

.breadcrumb-text.is-current {
  @apply text-font-black-gy1 font-medium;
}

.secondary-main-content {
  @apply min-h-0 w-full flex-1 overflow-y-auto px-6 pb-6;
}

.secondary-bottom-bar {
  @apply flex h-14 w-full shrink-0 items-center justify-center border-t border-component-stroke bg-container px-6 shadow-td-shadow-5;
}

.secondary-actions-center {
  @apply flex items-center justify-center gap-3;
}
</style>
