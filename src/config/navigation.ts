import type { RouteRecordRaw } from 'vue-router';
import type { PermissionResourceNode } from '@/api/auth.types';

export type DemoPermissionResourceType = 'module' | 'page';

export interface DemoPermissionRouteConfig {
  component: RouteRecordRaw['component'];
  iconName?: string;
  name: string;
  path: string;
  permission: string;
  sort: number;
  title: string;
  titleKey: string;
  type?: DemoPermissionResourceType;
}

export interface DemoPermissionModuleConfig extends DemoPermissionRouteConfig {
  children?: DemoPermissionRouteConfig[];
}

export const templateNavigationConfig = [
  {
    component: () => import('@/views/home/index.vue'),
    iconName: 'overview',
    name: 'Home',
    path: '',
    permission: 'demo.home',
    sort: 10,
    title: 'Home',
    titleKey: 'menu.home',
    type: 'module',
  },
  {
    component: () => import('@/views/TableExampleView.vue'),
    iconName: 'data-table',
    name: 'tableExample',
    path: 'table-example',
    permission: 'demo.table',
    sort: 20,
    title: 'Table Example',
    titleKey: 'menu.tableExample',
    type: 'module',
  },
  {
    component: () => import('@/views/ProjectIntroView.vue'),
    iconName: 'project-intro',
    name: 'projectIntro',
    path: 'project-intro',
    permission: 'demo.project-intro',
    sort: 25,
    title: 'Project Intro',
    titleKey: 'menu.projectIntro',
    type: 'module',
  },
  {
    children: [
      {
        component: () => import('@/views/component-library/ButtonDocs.vue'),
        name: 'componentButtons',
        path: 'component-library/buttons',
        permission: 'demo.components.buttons',
        sort: 10,
        title: 'Button',
        titleKey: 'menu.componentButtons',
      },
      {
        component: () => import('@/views/component-library/FormDocs.vue'),
        name: 'componentForms',
        path: 'component-library/forms',
        permission: 'demo.components.forms',
        sort: 20,
        title: 'Input / Select / Modal',
        titleKey: 'menu.componentForms',
      },
      {
        component: () => import('@/views/component-library/DatePickerDocs.vue'),
        name: 'componentDates',
        path: 'component-library/dates',
        permission: 'demo.components.dates',
        sort: 30,
        title: 'DatePicker',
        titleKey: 'menu.componentDates',
      },
      {
        component: () => import('@/views/component-library/TabsDocs.vue'),
        name: 'componentTabs',
        path: 'component-library/tabs',
        permission: 'demo.components.tabs',
        sort: 40,
        title: 'Tabs',
        titleKey: 'menu.componentTabs',
      },
      {
        component: () => import('@/views/component-library/RadioDocs.vue'),
        name: 'componentRadios',
        path: 'component-library/radios',
        permission: 'demo.components.radios',
        sort: 50,
        title: 'RadioButtonGroup',
        titleKey: 'menu.componentRadios',
      },
      {
        component: () => import('@/views/component-library/SecondaryLayoutDocs.vue'),
        name: 'componentSecondaryLayout',
        path: 'component-library/secondary-layout',
        permission: 'demo.components.secondary-layout',
        sort: 60,
        title: 'SecondaryPageLayout',
        titleKey: 'menu.secondaryLayoutDocs',
      },
    ],
    component: () => import('@/views/component-library/index.vue'),
    iconName: 'component-library',
    name: 'componentLibrary',
    path: 'component-library',
    permission: 'demo.components',
    sort: 30,
    title: 'Component Library',
    titleKey: 'menu.componentLibrary',
    type: 'module',
  },
] satisfies DemoPermissionModuleConfig[];

function flattenNavigation(items: DemoPermissionModuleConfig[]): DemoPermissionRouteConfig[] {
  return items.flatMap((item) => [item, ...(item.children ?? [])]);
}

export const templateNavigationItems = flattenNavigation(templateNavigationConfig);
export const templatePermissionCodes = templateNavigationItems.map((item) => item.permission);
export const templatePermissionSignature = templatePermissionCodes.join('|');

export function createTemplatePermissionTree(): PermissionResourceNode[] {
  return templateNavigationConfig.map(createTemplatePermissionResource);
}

function createTemplatePermissionResource(options: DemoPermissionRouteConfig | DemoPermissionModuleConfig): PermissionResourceNode {
  return {
    children: 'children' in options ? (options.children ?? []).map(createTemplatePermissionResource) : [],
    component: '',
    has_permission: true,
    icon: '',
    meta: { titleKey: options.titleKey },
    name: options.title,
    path: options.path,
    permission_code: options.permission,
    sort: options.sort,
    type: options.type ?? 'page',
  };
}

export function createTemplateRoutes() {
  return templateNavigationConfig.flatMap<RouteRecordRaw>((item) => {
    const parentRoute: RouteRecordRaw = {
      path: item.path,
      name: item.name,
      component: item.component,
      meta: {
        iconName: item.iconName,
        permission: item.permission,
        titleKey: item.titleKey,
      },
    };

    const childRoutes = (item.children ?? []).map<RouteRecordRaw>((child) => ({
      path: child.path,
      name: child.name,
      component: child.component,
      meta: {
        activeMenu: child.name,
        permission: child.permission,
        titleKey: child.titleKey,
      },
    }));

    return [parentRoute, ...childRoutes];
  });
}
