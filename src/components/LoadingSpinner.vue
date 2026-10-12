<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  spinning?: boolean;
  color?: string;
}>(), {
  size: 'medium',
  spinning: true,
  color: '',
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'is-small';
    case 'large':
      return 'is-large';
    case 'xlarge':
      return 'is-xlarge';
    case 'medium':
    default:
      return 'is-medium';
  }
});
</script>

<template>
  <span
    class="loading-spinner-wrapper"
    :class="[sizeClass, { 'is-spinning': spinning }]"
    role="status"
    aria-label="Loading"
  >
    <svg
      class="loading-spinner-svg"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.33366 0.666504H8.00033C12.0504 0.666504 15.3337 3.94975 15.3337 7.99984C15.3337 12.0499 12.0504 15.3332 8.00033 15.3332C3.95024 15.3332 0.666992 12.0499 0.666992 7.99984V7.33317H2.00033V7.99984C2.00033 11.3135 4.68662 13.9998 8.00033 13.9998C11.314 13.9998 14.0003 11.3135 14.0003 7.99984C14.0003 4.68613 11.314 1.99984 8.00033 1.99984H7.33366V0.666504Z"
        :fill="color || 'currentColor'"
      />
    </svg>
  </span>
</template>

<style scoped>
@reference "../styles/index.css";

.loading-spinner-wrapper {
  @apply inline-flex shrink-0 items-center justify-center leading-none text-current;
}

.loading-spinner-wrapper.is-small {
  @apply size-3.5;
}

.loading-spinner-wrapper.is-medium {
  @apply size-4;
}

.loading-spinner-wrapper.is-large {
  @apply size-5;
}

.loading-spinner-wrapper.is-xlarge {
  @apply size-6;
}

.loading-spinner-wrapper.is-spinning {
  @apply animate-spin;
}

.loading-spinner-svg {
  @apply block size-full;
}
</style>
