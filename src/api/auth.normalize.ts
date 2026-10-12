import type {
  CurrentUserDetailResponse,
  LoginResponse,
  PermissionResourceMeta,
  PermissionResourceNode,
  PermissionResourceType,
  PermissionResourcesResponse,
  UserResponse,
  UserStatus,
} from '@/api/auth.types';

type AuthResponseRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AuthResponseRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRequiredString(source: AuthResponseRecord, key: string) {
  const value = source[key];
  if (typeof value === 'string') return value;
  throw new Error(`Invalid auth response: ${key}.`);
}

function getOptionalString(source: AuthResponseRecord, key: string) {
  const value = source[key];
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  throw new Error(`Invalid auth response: ${key}.`);
}

function getRequiredNumber(source: AuthResponseRecord, key: string) {
  const value = source[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  throw new Error(`Invalid auth response: ${key}.`);
}

function getOptionalNumber(source: AuthResponseRecord, key: string) {
  const value = source[key];
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  throw new Error(`Invalid auth response: ${key}.`);
}

function getUserStatus(source: AuthResponseRecord, key: string): UserStatus {
  const value = source[key];
  if (value === 'normal' || value === 'disabled') return value;
  throw new Error(`Invalid auth response: ${key}.`);
}

function unwrapResponseBody(source: unknown) {
  if (!isRecord(source) || !isRecord(source.data)) {
    throw new Error('Invalid auth response.');
  }

  return source.data;
}

function normalizeUser(source: unknown): UserResponse {
  if (!isRecord(source)) {
    throw new Error('Invalid auth response: user.');
  }

  const last_login_at = getOptionalString(source, 'last_login_at');
  const mobile = getOptionalString(source, 'mobile');
  const version = getOptionalString(source, 'version');
  const user: UserResponse = {
    created_at: getRequiredString(source, 'created_at'),
    email: getRequiredString(source, 'email'),
    id: getRequiredNumber(source, 'id'),
    nickname: getRequiredString(source, 'nickname'),
    real_name: getRequiredString(source, 'real_name'),
    status: getUserStatus(source, 'status'),
    username: getRequiredString(source, 'username'),
    updated_at: getRequiredString(source, 'updated_at'),
  };

  if (last_login_at !== undefined) user.last_login_at = last_login_at;
  if (mobile !== undefined) user.mobile = mobile;
  if (version !== undefined) user.version = version;
  return user;
}

function getPermissionResourceType(source: AuthResponseRecord, key: string): PermissionResourceType {
  const value = source[key];
  if (value === 'module' || value === 'page' || value === 'button' || value === 'control') return value;
  throw new Error(`Invalid current user detail response: ${key}.`);
}

function normalizePermissionMeta(source: unknown): PermissionResourceMeta | null {
  if (source === undefined || source === null) return null;
  if (isRecord(source)) return source;
  throw new Error('Invalid current user detail response: permission resource meta.');
}

function normalizePermissionResourceNode(source: unknown): PermissionResourceNode {
  if (!isRecord(source)) {
    throw new Error('Invalid current user detail response: permission resource.');
  }

  const children = source.children;
  if (children !== undefined && children !== null && !Array.isArray(children)) {
    throw new Error('Invalid current user detail response: permission resource children.');
  }

  return {
    children: (children ?? []).map(normalizePermissionResourceNode),
    component: getOptionalString(source, 'component') ?? '',
    has_permission: source.has_permission === true,
    icon: getOptionalString(source, 'icon') ?? '',
    meta: normalizePermissionMeta(source.meta),
    name: getRequiredString(source, 'name'),
    path: getOptionalString(source, 'path') ?? '',
    permission_code: getRequiredString(source, 'permission_code'),
    sort: getOptionalNumber(source, 'sort'),
    type: getPermissionResourceType(source, 'type'),
  };
}

function normalizePermissionResources(source: unknown): PermissionResourcesResponse {
  if (!isRecord(source) || !Array.isArray(source.list) || !Array.isArray(source.permissions)) {
    throw new Error('Invalid current user detail response: permission_resources.');
  }

  return {
    list: source.list.map(normalizePermissionResourceNode),
    permissions: source.permissions.map((code) => {
      if (typeof code !== 'string') throw new Error('Invalid current user detail response: permissions.');
      return code;
    }),
    stats: isRecord(source.stats) ? source.stats : {},
  };
}

export function normalizeLoginResponse(source: unknown): LoginResponse {
  const body = unwrapResponseBody(source);
  const token_type = getOptionalString(body, 'token_type');
  const response: LoginResponse = {
    access_token: getRequiredString(body, 'access_token'),
    expires_in: getRequiredNumber(body, 'expires_in'),
    user: normalizeUser(body.user),
  };

  if (token_type !== undefined) response.token_type = token_type;
  return response;
}

export function normalizeCurrentUserDetailResponse(source: unknown): CurrentUserDetailResponse {
  const body = unwrapResponseBody(source);
  return {
    permission_resources: normalizePermissionResources(body.permission_resources),
    user: normalizeUser(body.user),
  };
}
