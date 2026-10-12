import type { LayoutMode, LocaleCode, ThemeMode } from '@/stores/preferences';

export interface AppConfig {
  defaultLayout: LayoutMode;
  defaultLocale: LocaleCode;
  defaultTheme: ThemeMode;
  descriptionKey: string;
  name: string;
  storageNamespace: string;
}

export const appConfig: AppConfig = {
  defaultLayout: 'side',
  defaultLocale: 'zh-CN',
  defaultTheme: 'light',
  descriptionKey: 'app.description',
  name: 'Nexa Admin',
  storageNamespace: 'nexa-admin',
};
