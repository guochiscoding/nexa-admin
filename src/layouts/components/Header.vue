<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
} from 'ant-design-vue';
import { LogoutOutlined } from '@ant-design/icons-vue';

import Button from '@/components/Button.vue';
import IconFont from '@/components/IconFont';
import LogoMark from '@/components/LogoMark.vue';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore, type ThemeMode } from '@/stores/preferences';

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();
const preferences = usePreferencesStore();
const themeTriggerRef = ref<HTMLElement>();
const userName = computed(() => auth.user?.nickname || auth.user?.username || t('menu.administrator'));
const avatarLabel = computed(() => userName.value.trim().slice(0, 1).toUpperCase());
const localeLabel = computed(() => preferences.locale === 'zh-CN' ? t('layout.localeShortZhCn') : t('layout.localeShortEnUs'));
const themeOptions = computed<{ key: ThemeMode; label: string }[]>(() => [
  { key: 'light', label: t('preferences.modeLight') },
  { key: 'dark', label: t('preferences.modeDark') },
  { key: 'system', label: t('preferences.modeSystem') },
]);
const themeLabel = computed(() => themeOptions.value.find((item) => item.key === preferences.theme)?.label ?? t('preferences.modeLight'));

function toggleLocale() {
  preferences.locale = preferences.locale === 'zh-CN' ? 'en-US' : 'zh-CN';
}

async function handleLogout() {
  await auth.logout();
  await router.replace({ name: 'Login' });
}

function handleThemeMenuClick(info: { key: string }) {
  preferences.setTheme(info.key as ThemeMode, getThemeTransitionOrigin());
}

function getThemeTransitionOrigin() {
  const rect = themeTriggerRef.value?.getBoundingClientRect();

  if (!rect) {
    return {
      x: window.innerWidth - 32,
      y: 32,
    };
  }

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
</script>

<template>
  <header class="global-header">
    <div class="global-brand">
      <LogoMark class="global-brand-mark" />
      <span class="global-brand-name">{{ t('layout.productName') }}</span>
    </div>
    <div class="global-header-main">
      <div class="global-header-actions">
        <Button type="default" size="medium" @click="toggleLocale">
          <template #icon>
            <IconFont type="icon-icon-language-switch" />
          </template>
          {{ localeLabel }}
        </Button>
        <ADropdown :trigger="['click']" placement="bottomRight">
          <span ref="themeTriggerRef" class="theme-trigger">
            <Button type="default" size="medium">
              <template #icon>
                <IconFont type="icon-icon-setting" />
              </template>
              {{ themeLabel }}
              <template #suffixIcon>
                <IconFont type="icon-icon-chevron-down" />
              </template>
            </Button>
          </span>

          <template #overlay>
            <AMenu :selected-keys="[preferences.theme]" @click="handleThemeMenuClick">
              <AMenuItem v-for="item in themeOptions" :key="item.key">
                {{ item.label }}
              </AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
        <ADropdown :trigger="['click']" placement="bottomRight">
          <Button type="default" size="medium">
            <template #icon>
              <span class="global-account-avatar">{{ avatarLabel }}</span>
            </template>
            {{ userName }}
            <template #suffixIcon>
              <IconFont type="icon-icon-chevron-down" />
            </template>
          </Button>

          <template #overlay>
            <AMenu>
              <AMenuItem key="logout" @click="handleLogout">
                <span class="global-account-action">
                  <LogoutOutlined />
                  {{ t('auth.logout') }}
                </span>
              </AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </div>
    </div>
  </header>
</template>

<style scoped>
@reference "../../styles/index.css";

.global-header {
  @apply relative flex h-16 shrink-0 items-center border-b border-component-stroke bg-container px-4;
}

.global-brand {
  @apply flex shrink-0 items-center gap-2 whitespace-nowrap;
}

.global-brand-mark {
  @apply size-8 text-font-black-gy1;
}

.global-brand-name {
  @apply text-(length:--font-size-titleMedium) font-semibold text-font-black-gy1;
}

.global-header-main {
  @apply absolute inset-y-0 right-4 left-[272px] flex items-center;
}

.global-header-actions {
  @apply ml-auto flex shrink-0 items-center gap-3;
}

.theme-trigger {
  @apply inline-flex;
}

.global-account-avatar {
  @apply flex size-5 items-center justify-center rounded-full bg-brand-black text-xs text-font-white-gy1;
}

.global-account-action {
  @apply inline-flex items-center gap-2 text-font-black-gy1;
}
</style>
