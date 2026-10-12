import type { App } from 'vue';

import { permissionDirective } from '@/directives/permission';

export function registerDirectives(app: App) {
  app.directive('permission', permissionDirective);
}
