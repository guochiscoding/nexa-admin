import { computed } from 'vue';

import { usePermissionStore } from '@/stores/permission';

export type PermissionCheckMode = 'every' | 'some';

export interface PermissionCheckOptions {
  /** 多权限码判断方式：some 表示任一命中，every 表示全部命中。 */
  mode?: PermissionCheckMode;
}

export type PermissionCodeInput = string | string[];

function normalizePermissionCodes(input: PermissionCodeInput) {
  const codes = Array.isArray(input) ? input : [input];
  return codes.map((code) => code.trim()).filter(Boolean);
}

export function checkPermissionCodes(
  input: PermissionCodeInput,
  checker: (code: string) => boolean,
  options: PermissionCheckOptions = {},
) {
  const codes = normalizePermissionCodes(input);
  if (!codes.length) return false;

  // 权限判断只做 permissions 扁平数组的精确匹配，数组模式仅决定多个完整权限码之间的关系。
  return options.mode === 'every'
    ? codes.every((code) => checker(code))
    : codes.some((code) => checker(code));
}

export function usePermission() {
  const permissionStore = usePermissionStore();

  const permissions = computed(() => permissionStore.permissions);
  const isLoaded = computed(() => permissionStore.isLoaded);

  function hasPermission(code: string) {
    return checkPermissionCodes(code, permissionStore.hasPermission);
  }

  function hasAnyPermission(codes: string[]) {
    return checkPermissionCodes(codes, permissionStore.hasPermission, { mode: 'some' });
  }

  function hasEveryPermission(codes: string[]) {
    return checkPermissionCodes(codes, permissionStore.hasPermission, { mode: 'every' });
  }

  return {
    hasAnyPermission,
    hasEveryPermission,
    hasPermission,
    isLoaded,
    permissions,
  };
}
