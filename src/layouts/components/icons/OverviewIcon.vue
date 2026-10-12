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
      width="6.125"
      height="6.125"
      rx="1.09375"
      :fill="secondaryColor"
    />
    <path
      d="M8.03125 10.875C8.63531 10.875 9.125 11.3647 9.125 11.9688V15.9062C9.125 16.5103 8.63531 17 8.03125 17H4.09375C3.48969 17 3 16.5103 3 15.9062V11.9688C3 11.3647 3.48969 10.875 4.09375 10.875H8.03125ZM15.9062 10.875C16.5103 10.875 17 11.3647 17 11.9688V15.9062C17 16.5103 16.5103 17 15.9062 17H11.9688C11.3647 17 10.875 16.5103 10.875 15.9062V11.9688C10.875 11.3647 11.3647 10.875 11.9688 10.875H15.9062ZM15.9062 3C16.5103 3 17 3.48969 17 4.09375V8.03125C17 8.63531 16.5103 9.125 15.9062 9.125H11.9688C11.3647 9.125 10.875 8.63531 10.875 8.03125V4.09375C10.875 3.48969 11.3647 3 11.9688 3H15.9062Z"
      :fill="primaryColor"
    />
  </svg>
</template>
