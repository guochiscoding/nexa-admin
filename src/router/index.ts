import { createRouter, createWebHistory } from 'vue-router';

import { createTemplateRoutes } from '@/config/navigation';
import AppShell from '@/layouts/AppShell.vue';
import { pinia } from '@/stores';
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true, titleKey: 'auth.loginTitle' },
    },
    {
      path: '/',
      component: AppShell,
      meta: { requiresAuth: true },
      children: [
        {
          path: '401',
          name: 'Unauthorized',
          component: () => import('@/views/401.vue'),
          meta: { titleKey: 'unauthorized.expiredTitle', skipAuth: true, hidden: true },
        },
        {
          path: '403',
          name: 'Forbidden',
          component: () => import('@/views/403.vue'),
          meta: { titleKey: 'forbidden.title', skipAuth: true, hidden: true },
        },
        ...createTemplateRoutes(),
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia);
  const permission = usePermissionStore(pinia);
  auth.initialize();

  const hasToken = Boolean(auth.token?.access_token);
  const routePermission = [...to.matched]
    .reverse()
    .find((route) => typeof route.meta.permission === 'string')
    ?.meta.permission;
  const skipAuth = to.matched.some((route) => route.meta.skipAuth);

  if (skipAuth || to.name === 'Login') {
    return true;
  }

  if (!hasToken) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }

  if (!permission.isLoaded) {
    try {
      // 刷新后先恢复当前用户权限，再继续做页面权限判断。
      await permission.fetchUserDetail();
    } catch {
      auth.clearSession();
      return {
        name: 'Login',
        query: { redirect: to.fullPath },
      };
    }

    return {
      hash: to.hash,
      path: to.path,
      query: to.query,
      replace: true,
    };
  }

  if (routePermission && !permission.hasPermission(routePermission)) {
    return {
      name: 'Forbidden',
      replace: true,
    };
  }

  return true;
});
