<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Menu as AMenu } from 'ant-design-vue';
import IconFont from '@/components/IconFont';
import MenuIcon, { type MenuIconName } from './icons/MenuIcon.vue';
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';
import type { PermissionResourceNode } from '@/api/auth';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const permissionStore = usePermissionStore();
const expanded = defineModel<boolean>('expanded', { default: true });
const menuCollapsed = ref(!expanded.value);
const interactionState = ref<'collapsing' | 'expanding' | 'idle'>('idle');
const userName = computed(() => auth.user?.nickname || auth.user?.username || t('menu.administrator'));
const userRealName = computed(() => auth.user?.real_name || auth.user?.username || t('menu.administrator'));
const avatarLabel = computed(() => userName.value.trim().slice(0, 1).toUpperCase());
const moduleIconMap = {
  'demo.components': 'component-library',
  'demo.home': 'overview',
  'demo.project-intro': 'project-intro',
  'demo.table': 'data-table',
} satisfies Record<string, MenuIconName>;

function isMenuResource(node: PermissionResourceNode) {
  return node.has_permission && (node.type === 'module' || node.type === 'page');
}

const routeRecords = computed(() => router.getRoutes());
const staticRouteNames = computed(() => new Set(routeRecords.value
  .map((item) => item.name?.toString())
  .filter((name): name is string => typeof name === 'string')));
const clickableRouteNames = computed(() => new Set(menuItems.value
  .flatMap((item) => item.children?.length ? item.children : [item])
  .map((item) => item.key)
  .filter((key): key is string => typeof key === 'string')));

function getRouteNameByPermission(node: PermissionResourceNode) {
  // 菜单跳转只通过权限 key 映射到前端静态路由；接口 path 是后端鉴权字段，前端不参与路由匹配。
  return routeRecords.value
    .find((item) => item.meta.permission === node.permission_code)
    ?.name
    ?.toString();
}

function getModuleIconName(node: PermissionResourceNode) {
  const routeIconName = routeRecords.value
    .find((item) => item.meta.permission === node.permission_code)
    ?.meta
    .iconName;

  if (typeof routeIconName === 'string' && isMenuIconName(routeIconName)) return routeIconName;

  return moduleIconMap[node.permission_code];
}

function isMenuIconName(name: string): name is MenuIconName {
  return ['component-library', 'data-table', 'overview', 'project-intro'].includes(name);
}

function buildPageMenuItems(node: PermissionResourceNode) {
  return node.children
    .filter((child) => isMenuResource(child) && child.type === 'page')
    .map((child) => {
      const routeName = getRouteNameByPermission(child);
      if (!routeName) return undefined;

      return {
        key: routeName,
        label: getMenuLabel(child),
      };
    })
    .filter((item): item is { key: string; label: string } => Boolean(item));
}

function getMenuLabel(node: PermissionResourceNode) {
  const titleKey = node.meta?.titleKey;
  if (typeof titleKey === 'string') return t(titleKey);

  return node.name;
}

function buildModuleMenuItem(node: PermissionResourceNode) {
  const routeName = getRouteNameByPermission(node);
  const children = buildPageMenuItems(node);

  return {
    children,
    key: routeName ?? node.permission_code,
    label: getMenuLabel(node),
  };
}

const navigationModules = computed(() => permissionStore.permissionTree
  .filter((node) => isMenuResource(node) && node.type === 'module'));

const menuItems = computed(() => navigationModules.value.map((item) => {
  const menuItem = buildModuleMenuItem(item);
  const isSelected = route.matched.some((matched) => matched.meta.permission === item.permission_code)
    || item.children.some((child) => route.matched.some((matched) => matched.meta.permission === child.permission_code));
  const iconName = getModuleIconName(item);

  return {
    key: menuItem.key,
    icon: iconName
      ? () => h(MenuIcon, {
          class: 'navigation-route-icon',
          name: iconName,
          primaryColor: isSelected || route.name === menuItem.key ? 'var(--Font-Black-Gy2)' : 'var(--Font-Black-Gy3)',
          secondaryColor: isSelected || route.name === menuItem.key ? 'var(--Font-Black-Gy1)' : 'var(--Font-Black-Gy2)',
        })
      : undefined,
    label: menuItem.label,
    children: menuItem.children.length ? menuItem.children : undefined,
  };
}).filter((item) => item.children?.length || staticRouteNames.value.has(item.key)));
const openKeys = computed({
  get: () => expanded.value
    ? menuItems.value.filter((item) => item.children?.length).map((item) => item.key)
    : [],
  set: () => {},
});
const selectedKeys = computed(() => [(route.meta.activeMenu as string | undefined) ?? route.name?.toString() ?? 'Home']);

let collapseLayoutTimer: number | undefined;
let interactionTimer: number | undefined;

watch(expanded, (nextExpanded) => {
  if (collapseLayoutTimer !== undefined) {
    window.clearTimeout(collapseLayoutTimer);
  }
  if (interactionTimer !== undefined) {
    window.clearTimeout(interactionTimer);
  }

  interactionState.value = nextExpanded ? 'expanding' : 'collapsing';

  if (nextExpanded) {
    menuCollapsed.value = false;
  } else {
    collapseLayoutTimer = window.setTimeout(() => {
      menuCollapsed.value = true;
      collapseLayoutTimer = undefined;
    }, 150);
  }

  interactionTimer = window.setTimeout(() => {
    interactionState.value = 'idle';
    menuCollapsed.value = !nextExpanded;
    interactionTimer = undefined;
  }, 240);
});

onBeforeUnmount(() => {
  if (collapseLayoutTimer !== undefined) window.clearTimeout(collapseLayoutTimer);
  if (interactionTimer !== undefined) window.clearTimeout(interactionTimer);
});

function navigate(info: { key: string }) {
  if (!clickableRouteNames.value.has(info.key)) return;
  void router.push({ name: info.key });
}

function renderExpandIcon(props: { isOpen?: boolean }) {
  const isDown = Boolean(expanded.value && props.isOpen);
  return h(IconFont, {
    type: isDown ? 'icon-icon-chevron-down' : 'icon-icon-chevron-right',
  });
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <aside
    class="navigation-shell"
    :class="{
      'is-collapsed': !expanded,
      'is-collapsing': interactionState === 'collapsing',
      'is-expanded': expanded,
      'is-expanding': interactionState === 'expanding',
    }"
  >
    <span class="navigation-caption" :class="{ 'is-collapsed': !expanded }">
      {{ t('menu.navigation') }}
    </span>
    <AMenu
      class="navigation-menu"
      mode="inline"
      :inline-collapsed="menuCollapsed"
      :expand-icon="renderExpandIcon"
      :items="menuItems"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      @click="navigate"
    />
    <footer class="navigation-footer" :class="{ 'is-collapsed': !expanded }">
      <span class="navigation-avatar">{{ avatarLabel }}</span>
      <span class="navigation-user">
        <strong>{{ userName }}</strong>
        <small>{{ userRealName }}</small>
      </span>
      <button
        type="button"
        class="navigation-toggle"
        :aria-label="expanded ? t('layout.collapse') : t('layout.expand')"
        @click="toggleExpanded"
      >
        <IconFont v-if="expanded" type="icon-icon-chevron-left-double" class="navigation-toggle-icon" />
        <IconFont v-else type="icon-icon-chevron-right-double" class="navigation-toggle-icon" />
      </button>
    </footer>
  </aside>
</template>

<style scoped>
@reference "../../styles/index.css";

.navigation-shell { @apply flex h-full flex-col border-r border-component-stroke bg-container transition-[width,min-width,border-color,background-color] duration-300 ease-out; }
.navigation-shell.is-expanded { @apply w-60 min-w-60; }
.navigation-shell.is-collapsed { @apply w-[156px] min-w-[156px]; }
.navigation-caption { @apply px-4 pt-7 pb-3 text-body-small text-font-black-gy4 transition-[opacity,transform,padding] duration-300 ease-out; }
.navigation-caption.is-collapsed { @apply px-4 text-body-small; }
.navigation-shell.is-collapsing .navigation-caption { @apply opacity-0; transform: translateY(-4px); }
.navigation-shell.is-expanding .navigation-caption { @apply opacity-100; transform: translateY(0); }
.navigation-menu { @apply min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-e-0 bg-transparent transition-[opacity,transform] duration-300 ease-out; }
.navigation-shell.is-collapsing .navigation-menu { @apply opacity-80; transform: translateX(-4px); }
.navigation-shell.is-expanding .navigation-menu { @apply opacity-100; transform: translateX(0); }
.navigation-footer { @apply flex items-center gap-2.5 border-t border-component-stroke px-4 py-4 transition-[gap,padding,background-color] duration-300 ease-out; }
.navigation-footer.is-collapsed { @apply gap-1.5 px-3 py-3; }
.navigation-avatar { @apply flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-semibold text-font-white-gy1; }
.navigation-user { @apply flex min-w-0 flex-1 flex-col text-xs text-font-black-gy2 transition-[opacity,transform,max-width] duration-300 ease-out; }
.navigation-footer.is-collapsed .navigation-user { @apply max-w-0 opacity-0; transform: translateX(-6px); }
.navigation-user strong { @apply truncate text-sm font-semibold text-font-black-gy1; }
.navigation-user small { @apply truncate text-xs text-font-black-gy2; }
.navigation-toggle { @apply  w-6 h-6 shrink-0 rounded bg-component cursor-pointer text-font-black-gy2 hover:text-font-black-gy1 text-center transition-[background-color,color,transform] duration-200; }
.navigation-toggle:hover { transform: translateX(-1px); }
.navigation-shell.is-collapsed .navigation-toggle:hover { transform: translateX(1px); }
.navigation-toggle-icon { @apply text-base text-font-black-gy2; }
</style>
