import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

import { appConfig } from '@/config/app';

export const pinia = createPinia();

pinia.use(createPersistedState({
  key: (storeId) => `${appConfig.storageNamespace}:${storeId}`,
}));
