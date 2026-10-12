<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  ConfigProvider as AConfigProvider,
  theme as antdTheme,
} from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

import { appConfig } from '@/config/app';
import { getColorTokens } from '@/config/theme';
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();
const { locale, t } = useI18n();

preferences.initialize();

watch(
  () => preferences.locale,
  (value) => {
    locale.value = value;
    dayjs.locale(value === 'zh-CN' ? 'zh-cn' : 'en');
    document.documentElement.lang = value;
    document.title = `${appConfig.name} · ${t(appConfig.descriptionKey)}`;
  },
  { immediate: true },
);

const antdLocale = computed(() =>
  preferences.locale === 'zh-CN' ? zhCN : enUS,
);
const activeColorTokens = computed(() => getColorTokens(preferences.resolvedTheme));
const themeConfig = computed(() => ({
  algorithm:
    preferences.resolvedTheme === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
  token: {
    borderRadius: 4,
    colorBgContainer: activeColorTokens.value['bg-color-container'],
    colorBgElevated: activeColorTokens.value['bg-color-container'],
    colorBgLayout: activeColorTokens.value['bg-color-page'],
    colorBgSpotlight: activeColorTokens.value['bg-color-container-active'],
    colorBorder: activeColorTokens.value['component-border'],
    colorBorderSecondary: activeColorTokens.value['component-stroke'],
    colorError: activeColorTokens.value['error-color'],
    colorErrorBg: activeColorTokens.value['error-light'],
    colorFillAlter: activeColorTokens.value['bg-color-secondarycontainer'],
    colorFillSecondary: activeColorTokens.value['bg-color-component'],
    colorInfo: activeColorTokens.value['brand-blue'],
    colorInfoBg: activeColorTokens.value['brand-blue-light'],
    colorPrimary: activeColorTokens.value['brand-black'],
    colorPrimaryActive: activeColorTokens.value['brand-black-active'],
    colorPrimaryHover: activeColorTokens.value['brand-black-hover'],
    colorSuccess: activeColorTokens.value['success-color'],
    colorSuccessBg: activeColorTokens.value['success-light'],
    colorText: activeColorTokens.value['Font-Black-Gy1'],
    colorTextDescription: activeColorTokens.value['Font-Black-Gy2'],
    colorTextDisabled: activeColorTokens.value['Font-Black-Gy4'],
    colorTextPlaceholder: activeColorTokens.value['Font-Black-Gy3'],
    colorWarning: activeColorTokens.value['warning-color'],
    colorWarningBg: activeColorTokens.value['warning-light'],
  },
  components: {
    Alert: {
      defaultPadding: '10px 12px',
    },
    Card: {
      colorBorderSecondary: activeColorTokens.value['component-stroke'],
    },
    Modal: {
      contentBg: activeColorTokens.value['bg-color-container'],
      headerBg: activeColorTokens.value['bg-color-container'],
    },
    Table: {
      borderRadiusLG: 4,
      headerBg: activeColorTokens.value['bg-color-page'],
      headerColor: activeColorTokens.value['Font-Black-Gy1'],
      rowHoverBg: activeColorTokens.value['bg-color-container-hover'],
    },
  },
}));
</script>

<template>
  <AConfigProvider :locale="antdLocale" :theme="themeConfig">
    <RouterView />
  </AConfigProvider>
</template>
