import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { fetchCurrentUserDetail, loginWithPassword, logoutSession } from '@/api/auth';
import type { LoginRequest, UserResponse } from '@/api/auth';
import { appConfig } from '@/config/app';
import { usePermissionStore } from '@/stores/permission';

interface LoginFormCredentials extends LoginRequest {
  rememberMe: boolean;
}

interface StoredToken {
  access_token: string;
  expires_in: number;
  token_type?: string;
}

interface StoredSession {
  token: StoredToken;
  user: UserResponse;
}

const storageKey = `${appConfig.storageNamespace}:auth`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStoredString(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === 'string' ? value : null;
}

function parseStoredNumber(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseStoredUser(source: unknown): UserResponse | null {
  if (!isRecord(source)) return null;

  const created_at = parseStoredString(source, 'created_at');
  const email = parseStoredString(source, 'email');
  const id = parseStoredNumber(source, 'id');
  const mobile = parseStoredString(source, 'mobile');
  const nickname = parseStoredString(source, 'nickname');
  const real_name = parseStoredString(source, 'real_name');
  const status = source.status;
  const username = parseStoredString(source, 'username');
  const updated_at = parseStoredString(source, 'updated_at');

  if (
    created_at === null
    || email === null
    || id === null
    || nickname === null
    || real_name === null
    || (status !== 'normal' && status !== 'disabled')
    || username === null
    || updated_at === null
  ) {
    return null;
  }

  const user: UserResponse = {
    created_at,
    email,
    id,
    nickname,
    real_name,
    status,
    username,
    updated_at,
  };

  if (mobile !== null) {
    user.mobile = mobile;
  }

  return user;
}

function parseStoredToken(source: unknown): StoredToken | null {
  if (!isRecord(source)) return null;

  const access_token = parseStoredString(source, 'access_token');
  const expires_in = parseStoredNumber(source, 'expires_in');
  const token_type = parseStoredString(source, 'token_type');
  if (access_token === null || expires_in === null) return null;

  const token: StoredToken = { access_token, expires_in };
  if (token_type !== null) {
    token.token_type = token_type;
  }
  return token;
}

function parseStoredSession(value: string | null) {
  if (!value) return null;

  try {
    const session = JSON.parse(value) as unknown;
    if (!isRecord(session)) return null;

    const token = parseStoredToken(session.token);
    const user = parseStoredUser(session.user);
    if (!token || !user) return null;

    return {
      token,
      user,
    } satisfies StoredSession;
  } catch {
    return null;
  }
}

function loadStoredSession() {
  return parseStoredSession(localStorage.getItem(storageKey))
    ?? parseStoredSession(sessionStorage.getItem(storageKey));
}

function persistSession(session: StoredSession, rememberMe: boolean) {
  const targetStorage = rememberMe ? localStorage : sessionStorage;
  const staleStorage = rememberMe ? sessionStorage : localStorage;
  targetStorage.setItem(storageKey, JSON.stringify(session));
  staleStorage.removeItem(storageKey);
}

function removeStoredSession() {
  localStorage.removeItem(storageKey);
  sessionStorage.removeItem(storageKey);
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<StoredToken | null>(null);
  const user = ref<UserResponse | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value?.access_token && user.value));

  function setSession(session: StoredSession, rememberMe: boolean) {
    token.value = session.token;
    user.value = session.user;
    persistSession(session, rememberMe);
  }

  function setToken(nextToken: StoredToken) {
    token.value = nextToken;
  }

  function clearSession() {
    const permission = usePermissionStore();
    token.value = null;
    user.value = null;
    permission.clearPermission();
    removeStoredSession();
  }

  function initialize() {
    if (initialized.value) return;
    initialized.value = true;

    const storedSession = loadStoredSession();
    if (!storedSession) return;

    token.value = storedSession.token;
    user.value = storedSession.user;
  }

  async function login(credentials: LoginFormCredentials) {
    const loginResponse = await loginWithPassword({
      password: credentials.password,
      username: credentials.username,
    });
    const nextToken: StoredToken = {
      access_token: loginResponse.access_token,
      expires_in: loginResponse.expires_in,
    };
    if (loginResponse.token_type !== undefined) {
      nextToken.token_type = loginResponse.token_type;
    }
    setToken(nextToken);

    try {
      const permission = usePermissionStore();
      // 登录成功后立即拉取当前用户详情和权限资源，保证菜单、路由和控件权限共享同一份来源。
      const currentUser = await fetchCurrentUserDetail();
      const session: StoredSession = {
        token: nextToken,
        user: currentUser.user,
      };

      permission.setUserDetail(currentUser);
      setSession(session, credentials.rememberMe);
    } catch (error) {
      clearSession();
      throw error;
    }
  }

  async function logout() {
    const shouldNotifyServer = Boolean(token.value?.access_token);
    if (shouldNotifyServer) {
      try {
        await logoutSession();
      } catch {
        // Local logout is authoritative; backend logout failure should not restore the session.
      }
    }

    clearSession();
  }

  return {
    clearSession,
    initialize,
    initialized,
    isAuthenticated,
    login,
    logout,
    token,
    user,
  };
});
