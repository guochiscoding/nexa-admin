<script setup lang="ts">
import { computed } from 'vue';

import ComponentLibraryIcon from './ComponentLibraryIcon.vue';
import OverviewIcon from './OverviewIcon.vue';
import ProjectIntroIcon from './ProjectIntroIcon.vue';
import TableIcon from './TableIcon.vue';

export type MenuIconName = 'component-library' | 'data-table' | 'overview' | 'project-intro';

const props = withDefaults(defineProps<{
  name?: MenuIconName;
  primaryColor?: string;
  secondaryColor?: string;
}>(), {
  name: 'overview',
  primaryColor: 'var(--Font-Black-Gy3)',
  secondaryColor: 'var(--Font-Black-Gy2)',
});

const iconMap = {
  'component-library': ComponentLibraryIcon,
  'data-table': TableIcon,
  overview: OverviewIcon,
  'project-intro': ProjectIntroIcon,
} as const;

const iconComponent = computed(() => iconMap[props.name]);
</script>

<template>
  <component
    :is="iconComponent"
    class="menu-icon"
    :primary-color="primaryColor"
    :secondary-color="secondaryColor"
  />
</template>

<style scoped>
@reference "../../../styles/index.css";

.menu-icon {
  @apply block size-5 shrink-0;
}
</style>

