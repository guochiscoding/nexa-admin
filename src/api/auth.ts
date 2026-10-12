import { fetchMockCurrentUserDetail, loginWithMock } from '@/api/auth.mock';
import { normalizeCurrentUserDetailResponse, normalizeLoginResponse } from '@/api/auth.normalize';
import { request } from '@/api/request';
import type { CurrentUserResponse, LoginRequest } from '@/api/auth.types';

export type {
  CurrentUserDetailResponse,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  PermissionResourceMeta,
  PermissionResourceNode,
  PermissionResourceStats,
  PermissionResourceType,
  PermissionResourcesResponse,
  UserResponse,
  UserStatus,
} from '@/api/auth.types';

function shouldUseMockAuth() {
  return import.meta.env.VITE_AUTH_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL?.trim();
}

export async function loginWithPassword(credentials: LoginRequest) {
  if (shouldUseMockAuth()) {
    return loginWithMock(credentials);
  }

  // 登录接口参数完全来自登录表单；响应拆包和字段校验收敛在 normalizeLoginResponse。
  const response = await request.post<unknown>('/api/auth/login', {
    password: credentials.password,
    username: credentials.username,
  });
  return normalizeLoginResponse(response.data);
}

export async function fetchCurrentUser() {
  const response = await fetchCurrentUserDetail();
  return { user: response.user } satisfies CurrentUserResponse;
}

export async function fetchCurrentUserDetail() {
  if (shouldUseMockAuth()) {
    return fetchMockCurrentUserDetail();
  }

  // 当前用户详情接口同时返回用户信息和权限资源，权限 Store 统一从这里拆包入库。
  const response = await request.get<unknown>('/api/auth/current-user/detail');
  return normalizeCurrentUserDetailResponse(response.data);
}

export async function logoutSession() {
  if (shouldUseMockAuth()) return;
  // 退出登录只通知服务端结束当前会话，本地清理由 auth store 负责。
  await request.post('/api/auth/logout');
}
