import type { CurrentUserDetailResponse, LoginRequest, LoginResponse, UserResponse } from '@/api/auth.types';
import { createTemplatePermissionTree, templatePermissionCodes, templatePermissionSignature } from '@/config/navigation';

let mockUser: UserResponse | null = null;

const demoPermissionTree = createTemplatePermissionTree();

function createMockUser(username: string): UserResponse {
  const now = new Date().toISOString();
  return {
    created_at: now,
    email: `${username}@nexa.local`,
    id: 1,
    last_login_at: now,
    mobile: '',
    nickname: 'Nexa Admin',
    real_name: 'Demo Administrator',
    status: 'normal',
    username,
    updated_at: now,
    version: templatePermissionSignature,
  };
}

export async function loginWithMock(credentials: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 300);
  });

  if (!credentials.username.trim() || !credentials.password.trim()) {
    throw new Error('Invalid credentials.');
  }

  mockUser = createMockUser(credentials.username.trim());
  return {
    access_token: `mock-token-${Date.now()}`,
    expires_in: 2 * 60 * 60,
    token_type: 'Bearer',
    user: mockUser,
  };
}

export async function fetchMockCurrentUserDetail(): Promise<CurrentUserDetailResponse> {
  if (!mockUser) {
    throw new Error('Invalid auth response: user.');
  }

  return {
    permission_resources: {
      // 演示模式只授权模板保留页面，确保开箱即用且不带业务菜单。
      list: demoPermissionTree,
      permissions: [...templatePermissionCodes],
      stats: {},
    },
    user: mockUser,
  };
}
