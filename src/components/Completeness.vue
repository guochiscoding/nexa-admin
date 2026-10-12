<script setup lang="ts">
import { computed } from 'vue';

import IconFont from '@/components/IconFont';

type CompletenessLevel = 0 | '0' | 'half' | 'full';

type CompletenessConfig = {
  icon: string;
  textClass: string;
  backgroundClass: string;
};

const props = withDefaults(
  defineProps<{
    /** 完整度状态：0 未完整，half 一半，full 完整 */
    level?: CompletenessLevel;
    /** 展示文字 */
    text: string;
  }>(),
  {
    level: 'full',
  },
);

const configMap: Record<'empty' | 'half' | 'full', CompletenessConfig> = {
  empty: {
    icon: 'icon-icon-close',
    textClass: 'text-font-black-gy4',
    backgroundClass: 'bg-color-secondarycontainer',
  },
  half: {
    icon: 'icon-icon-half',
    textClass: 'text-warning-color',
    backgroundClass: 'bg-warning-light',
  },
  full: {
    icon: 'icon-icon-check',
    textClass: 'text-success-color',
    backgroundClass: 'bg-success-light',
  },
};

const normalizedLevel = computed(() => {
  if (props.level === 0 || props.level === '0') return 'empty';
  return props.level;
});

const completenessConfig = computed(() => configMap[normalizedLevel.value]);
</script>

<template>
  <span class="completeness" :class="completenessConfig.textClass">
    <span class="completeness-icon-wrap" :class="completenessConfig.backgroundClass">
      <IconFont
        :type="completenessConfig.icon"
        class="completeness-icon"
        aria-hidden="true"
      />
    </span>
    <span class="completeness-text">{{ text }}</span>
  </span>
</template>

<style scoped>
@reference "../styles/index.css";

.completeness {
  @apply inline-flex items-center gap-1;
}

.completeness-icon-wrap {
  @apply inline-flex size-4 shrink-0 items-center justify-center rounded-[1.6px];
}

.completeness-icon {
  @apply inline-flex items-center justify-center text-body-medium leading-none text-current;
}

.completeness-text {
  @apply text-body-medium leading-[14px] text-current;
}
</style>
