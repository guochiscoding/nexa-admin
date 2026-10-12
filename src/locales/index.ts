import { createI18n } from 'vue-i18n';

import { appConfig } from '@/config/app';

import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

export const messages = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

export const i18n = createI18n({
  fallbackLocale: 'en-US',
  legacy: false,
  locale: appConfig.defaultLocale,
  messages,
  missingWarn: import.meta.env.DEV,
});
