import { defineStore } from 'pinia';

import { fetchCurrentUserDetail } from '@/api/auth';
import type { CurrentUserDetailResponse, PermissionResourceNode, UserResponse } from '@/api/auth';
import { appConfig } from '@/config/app';
import { createTemplatePermissionTree, templatePermissionCodes, templatePermissionSignature } from '@/config/navigation';

interface SerializedSet {
  __type: 'Set';
  values: string[];
}

export interface PermissionStoreState {
  /** 当前登录用户详情，来自 current-user/detail 的 data.user。 */
  userInfo: UserResponse | null;
  /** 已按 has_permission 过滤后的权限树，供后续菜单和页面内资源展示使用。 */
  permissionTree: PermissionResourceNode[];
  /** 扁平权限码集合，所有运行时权限判断只对这个集合做精确匹配。 */
  permissions: Set<string>;
  /** 是否已成功加载当前用户详情和权限资源。 */
  isLoaded: boolean;
  /** 权限版本预留字段，后续可用于后端权限变更后的本地缓存失效。 */
  version: string;
}

const permissionStorageKey = `${appConfig.storageNamespace}:permission`;

function serializePermissionState(state: Record<string, unknown>) {
  return JSON.stringify(state, (_, value: unknown) => {
    if (value instanceof Set) {
      return {
        __type: 'Set',
        values: Array.from(value),
      } satisfies SerializedSet;
    }
    return value;
  });
}

function deserializePermissionState(value: string) {
  return JSON.parse(value, (_, parsed: unknown) => {
    if (
      typeof parsed === 'object'
      && parsed !== null
      && !Array.isArray(parsed)
      && (parsed as SerializedSet).__type === 'Set'
      && Array.isArray((parsed as SerializedSet).values)
    ) {
      return new Set((parsed as SerializedSet).values.filter((code): code is string => typeof code === 'string'));
    }

    return parsed;
  }) as Record<string, unknown>;
}

function sortPermissionNodes(nodes: PermissionResourceNode[]) {
  return [...nodes].sort((current, next) => current.sort - next.sort);
}

function filterGrantedPermissionTree(nodes: PermissionResourceNode[]) {
  return sortPermissionNodes(nodes)
    .filter((node) => node.has_permission)
    .map((node) => ({
      ...node,
      children: filterGrantedPermissionTree(node.children),
    }));
}

function createPermissionSet(codes: string[]) {
  return new Set(codes.filter((code) => code.trim()));
}

function hasTemplatePermissionNode(nodes: PermissionResourceNode[]) {
  return nodes.some((node) => node.permission_code.startsWith('demo.') || hasTemplatePermissionNode(node.children));
}

function hasTemplatePermissionState(state: PermissionStoreState) {
  return Array.from(state.permissions).some((code) => code.startsWith('demo.'))
    || hasTemplatePermissionNode(state.permissionTree);
}

function refreshStaleTemplatePermissionState(state: PermissionStoreState) {
  if (!hasTemplatePermissionState(state) || state.version === templatePermissionSignature) return;

  // 模板 demo 权限来自本地导航配置；当新增演示菜单时，刷新旧缓存避免用户手动清 localStorage。
  state.permissionTree = filterGrantedPermissionTree(createTemplatePermissionTree());
  state.permissions = createPermissionSet(templatePermissionCodes);
  state.isLoaded = true;
  state.version = templatePermissionSignature;
}

function applyUserDetailToState(state: PermissionStoreState, detail: CurrentUserDetailResponse) {
  state.userInfo = detail.user;
  // 接口返回全量资源树，Store 只保留当前用户拥有的节点，避免菜单和页面误用无权限资源。
  state.permissionTree = filterGrantedPermissionTree(detail.permission_resources.list);
  state.permissions = createPermissionSet(detail.permission_resources.permissions);
  state.isLoaded = true;
  state.version = detail.user.version ?? '';
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStoreState => ({
    isLoaded: false,
    permissionTree: [],
    permissions: new Set<string>(),
    userInfo: null,
    version: '',
  }),
  actions: {
    async fetchUserDetail() {
      // 登录后或刷新丢失内存状态时调用，接口拆包和字段校验统一收敛在 api/auth.ts。
      const detail = await fetchCurrentUserDetail();
      applyUserDetailToState(this.$state, detail);
      return detail;
    },
    setUserDetail(detail: CurrentUserDetailResponse) {
      // 登录流程已拿到详情时直接写入，避免重复请求 current-user/detail。
      applyUserDetailToState(this.$state, detail);
    },
    clearPermission() {
      this.userInfo = null;
      this.permissionTree = [];
      this.permissions = new Set<string>();
      this.isLoaded = false;
      this.version = '';
    },
    hasPermission(code: string) {
      // 权限判断只认接口 permissions 扁平数组构建出的 Set，并且必须精确匹配。
      return this.permissions.has(code);
    },
  },
  persist: {
    key: permissionStorageKey,
    pick: ['userInfo', 'permissionTree', 'permissions', 'isLoaded', 'version'],
    serializer: {
      deserialize: deserializePermissionState,
      serialize: serializePermissionState,
    },
    afterHydrate: ({ store }) => {
      const permissionStore = store as ReturnType<typeof usePermissionStore>;
      if (!(permissionStore.permissions instanceof Set)) {
        const restored = Array.isArray(permissionStore.permissions)
          ? permissionStore.permissions
          : [];
        permissionStore.permissions = createPermissionSet(restored);
      }
      refreshStaleTemplatePermissionState(permissionStore.$state);
    },
  },
});
