<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <svg
    class="logo-mark"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="title"
    :aria-hidden="title ? undefined : true"
  >
    <path class="logo-mark-frame" d="M20 3L34.722 11.5V28.5L20 37L5.278 28.5V11.5L20 3Z" />
    <path class="logo-mark-accent" d="M12 28V12H16.4L24.2 22.35V12H28V28H23.95L15.8 17.25V28H12Z" />
    <path class="logo-mark-line" d="M14 30.5H26" />
  </svg>
</template>

<style scoped>
@reference "../styles/index.css";

.logo-mark {
  @apply inline-block shrink-0 text-current;
}

.logo-mark-frame {
  @apply stroke-current;
  stroke-width: 2.4;
}

.logo-mark-accent {
  @apply fill-current;
}

.logo-mark-line {
  @apply stroke-current;
  stroke-width: 2.4;
  stroke-linecap: round;
}
</style>
