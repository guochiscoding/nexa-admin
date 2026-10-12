<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  LayoutSider as ALayoutSider,
} from 'ant-design-vue';

import Header from '@/layouts/components/Header.vue';
import FloatingSupport from '@/layouts/components/FloatingSupport.vue';
import NavigationMenu from '@/layouts/components/NavigationMenu.vue';

const sidebarExpanded = ref(true);
const pointerX = ref(50);
const pointerY = ref(50);
const pointerXPosition = computed(() => `${pointerX.value}%`);
const pointerYPosition = computed(() => `${pointerY.value}%`);

function handleShellPointerMove(event: PointerEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  pointerX.value = Math.round(((event.clientX - rect.left) / rect.width) * 100);
  pointerY.value = Math.round(((event.clientY - rect.top) / rect.height) * 100);
}
</script>

<template>
  <ALayout class="app-layout shell-pointer-surface">
    <Header />
    <ALayout class="app-body-layout">
      <ALayoutSider
        class="app-sider"
        :width="240"
        :collapsed-width="156"
        :collapsed="!sidebarExpanded"
        :trigger="null"
      >
        <NavigationMenu v-model:expanded="sidebarExpanded" />
      </ALayoutSider>
      <ALayoutContent class="app-content" @pointermove="handleShellPointerMove">
        <div class="shell-pointer-layer" aria-hidden="true">
          <div class="shell-pointer-glow" />
        </div>
        <div class="app-content-stack">
          <RouterView />
          <FloatingSupport />
        </div>
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<style scoped>
@reference "../styles/index.css";

.shell-pointer-surface {
  @apply relative;
  --shell-pointer-x: v-bind(pointerXPosition);
  --shell-pointer-y: v-bind(pointerYPosition);
}

.shell-pointer-layer {
  @apply pointer-events-none absolute inset-0 z-0 overflow-hidden;
}

.shell-pointer-glow {
  @apply absolute size-[560px] rounded-full bg-brand-blue-light opacity-100 blur-3xl;
  left: calc(var(--shell-pointer-x) - 192px);
  top: calc(var(--shell-pointer-y) - 192px);
  transition: left 120ms ease-out, top 120ms ease-out;
}

.app-content-stack {
  @apply relative z-10 flex min-h-0 flex-1 flex-col;
}
</style>
