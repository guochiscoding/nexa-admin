import axios from 'axios';

import { pinia } from '@/stores';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipForbiddenRedirect?: boolean;
  }
}

// 开发环境由 Vite proxy 使用 VITE_API_BASE_URL 转发，浏览器保持同源请求以避开跨域偶发失败。
const apiBaseURL = import.meta.env.DEV ? undefined : import.meta.env.VITE_API_BASE_URL?.trim() || undefined;

export const request = axios.create({
  baseURL: apiBaseURL,
  timeout: 15_000,
});

request.interceptors.request.use((config) => {
  const auth = useAuthStore(pinia);
  const preferences = usePreferencesStore(pinia);
  config.headers['Accept-Language'] = preferences.locale;
  if (auth.token?.access_token) {
    config.headers.Authorization = `${auth.token.token_type ?? 'Bearer'} ${auth.token.access_token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || ![401, 403].includes(error.response?.status ?? 0)) {
      throw error;
    }

    const { router } = await import('@/router');
    const currentRoute = router.currentRoute.value;
    if (currentRoute.name === 'Login') {
      throw error;
    }

    if (error.response?.status === 401 && currentRoute.name !== 'Unauthorized') {
      const auth = useAuthStore(pinia);
      auth.clearSession();

      await router.replace({
        name: 'Unauthorized',
      });
    }

    if (error.response?.status === 403 && error.config?.skipForbiddenRedirect) {
      throw error;
    }

    if (error.response?.status === 403 && currentRoute.name !== 'Forbidden') {
      await router.replace({
        name: 'Forbidden',
      });
    }

    throw error;
  },
);
