<script setup lang="ts">
withDefaults(defineProps<{
  primaryColor?: string;
  secondaryColor?: string;
}>(), {
  primaryColor: 'var(--Font-Black-Gy3)',
  secondaryColor: 'var(--Font-Black-Gy2)',
});
</script>

<template>
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 3.25H15C15.6904 3.25 16.25 3.80964 16.25 4.5V8.5C16.25 9.19036 15.6904 9.75 15 9.75H5C4.30964 9.75 3.75 9.19036 3.75 8.5V4.5C3.75 3.80964 4.30964 3.25 5 3.25Z"
      :fill="secondaryColor"
    />
    <path
      d="M3.75 11.5C3.75 10.8096 4.30964 10.25 5 10.25H8.75C9.44036 10.25 10 10.8096 10 11.5V15.5C10 16.1904 9.44036 16.75 8.75 16.75H5C4.30964 16.75 3.75 16.1904 3.75 15.5V11.5Z"
      :fill="primaryColor"
    />
    <path
      d="M10 11.5C10 10.8096 10.5596 10.25 11.25 10.25H15C15.6904 10.25 16.25 10.8096 16.25 11.5V15.5C16.25 16.1904 15.6904 16.75 15 16.75H11.25C10.5596 16.75 10 16.1904 10 15.5V11.5Z"
      :fill="primaryColor"
      opacity="0.78"
    />
  </svg>
</template>

