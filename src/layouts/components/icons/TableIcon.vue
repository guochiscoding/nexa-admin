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
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      rx="2"
      :fill="primaryColor"
    />
    <path
      d="M7.66667 5V15"
      :stroke="secondaryColor"
      stroke-width="1"
      stroke-linecap="round"
    />
    <path
      d="M12.3333 5V15"
      :stroke="secondaryColor"
      stroke-width="1"
      stroke-linecap="round"
    />
    <path
      d="M5 7.66667H15"
      :stroke="secondaryColor"
      stroke-width="1"
      stroke-linecap="round"
      opacity="0.78"
    />
    <path
      d="M5 12.3333H15"
      :stroke="secondaryColor"
      stroke-width="1"
      stroke-linecap="round"
      opacity="0.78"
    />
  </svg>
</template>

