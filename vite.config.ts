import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowedHostsValue = process.env.ALLOWED_HOSTS ?? env.ALLOWED_HOSTS;
  const allowedHosts = allowedHostsValue
    ? allowedHostsValue
        .split(',')
        .map((host) => host.trim())
        .filter(Boolean)
    : [];
  const apiProxyTarget = (process.env.VITE_API_BASE_URL ?? env.VITE_API_BASE_URL)?.trim();

  return {
    build: {
      chunkSizeWarningLimit: 700,
    },
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: allowedHosts,
      proxy: apiProxyTarget
        ? {
            '/api': {
              target: apiProxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});
