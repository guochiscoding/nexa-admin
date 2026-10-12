import type { Directive, DirectiveBinding } from 'vue';
import { watch } from 'vue';

import { checkPermissionCodes } from '@/composables/usePermission';
import type { PermissionCheckMode } from '@/composables/usePermission';
import { pinia } from '@/stores';
import { usePermissionStore } from '@/stores/permission';

type PermissionDirectiveValue = string | string[] | {
  /** 完整权限码，运行时按接口 permissions 扁平数组精确匹配。 */
  code?: string;
  /** 多个完整权限码，默认任一命中即显示。 */
  codes?: string[];
  /** 多权限码判断方式。 */
  mode?: PermissionCheckMode;
};

interface PermissionElement extends HTMLElement {
  __permissionOriginalDisplay?: string;
  __permissionStopWatch?: () => void;
}

function parsePermissionValue(value: PermissionDirectiveValue | undefined, binding: DirectiveBinding<PermissionDirectiveValue>) {
  const mode: PermissionCheckMode = binding.modifiers.every ? 'every' : 'some';

  if (typeof value === 'string' || Array.isArray(value)) {
    return {
      codes: value,
      mode,
    };
  }

  return {
    codes: value?.codes ?? value?.code ?? [],
    mode: value?.mode ?? mode,
  };
}

function setVisible(el: PermissionElement, visible: boolean) {
  if (el.__permissionOriginalDisplay === undefined) {
    el.__permissionOriginalDisplay = el.style.display;
  }

  el.style.display = visible ? el.__permissionOriginalDisplay : 'none';
}

function applyPermission(el: PermissionElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
  const permissionStore = usePermissionStore(pinia);
  const config = parsePermissionValue(binding.value, binding);
  const visible = checkPermissionCodes(config.codes, permissionStore.hasPermission, { mode: config.mode });

  // 指令只消费完整权限码；无权限元素直接隐藏，不保留禁用态按钮。
  setVisible(el, visible);
}

export const permissionDirective: Directive<PermissionElement, PermissionDirectiveValue> = {
  mounted(el, binding) {
    const permissionStore = usePermissionStore(pinia);
    applyPermission(el, binding);

    el.__permissionStopWatch = watch(
      () => [permissionStore.isLoaded, permissionStore.permissions.size],
      () => applyPermission(el, binding),
    );
  },
  updated(el, binding) {
    applyPermission(el, binding);
  },
  unmounted(el) {
    el.__permissionStopWatch?.();
    delete el.__permissionStopWatch;
  },
};
