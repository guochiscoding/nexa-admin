import 'vue-router';
import type { Component } from 'vue';

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string;
    icon?: Component;
    iconName?: string;
    hidden?: boolean;
    activeMenu?: string;
    guestOnly?: boolean;
    permission?: string;
    requiresAuth?: boolean;
    skipAuth?: boolean;
  }
}
