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
      d="M3 4.4C3 3.07452 4.07452 2 5.4 2H11.735L17.4 6.4V15.6C17.4 16.9255 16.3255 18 15 18H5.4C4.07452 18 3 16.9255 3 15.6V4.4Z"
      :fill="primaryColor"
    />
    <path
      d="M17.3994 6.4L11.7344 2V5.35818C11.7344 6.33082 12.595 7.07846 13.5581 6.94246L17.3994 6.4Z"
      :fill="secondaryColor"
    />
    <rect
      x="5"
      y="8.40002"
      width="4.8"
      height="1.6"
      :fill="secondaryColor"
    />
    <rect
      x="5"
      y="11.6"
      width="7.2"
      height="1.6"
      :fill="secondaryColor"
    />
  </svg>
</template>
