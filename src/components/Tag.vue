<script setup lang="ts">
import { computed } from 'vue';

const FONT_BLACK_GY1 = 'var(--Font-Black-Gy1)';

const props = withDefaults(
  defineProps<{
    /** 标签内容文字；也可使用默认插槽 */
    text?: string;
    /** 文字颜色，支持 CSS 颜色值或 var(--token) */
    color?: string;
    /** 背景色，支持 CSS 颜色值或 var(--token) */
    bgColor?: string;
    /** 是否展示边框 */
    bordered?: boolean;
  }>(),
  {
    text: '',
    color: FONT_BLACK_GY1,
    bgColor: 'transparent',
    bordered: true,
  },
);

defineSlots<{
  default?: () => unknown;
}>();

const borderColor = computed(() =>
  props.color === FONT_BLACK_GY1 ? 'var(--component-border)' : props.color,
);

const tagColor = computed(() => props.color);
const tagBackgroundColor = computed(() => props.bgColor);
const tagBorderColor = computed(() => (props.bordered ? borderColor.value : 'transparent'));
</script>

<template>
  <span class="tag" :class="{ 'is-borderless': !bordered }">
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
@reference "../styles/index.css";

.tag {
  @apply inline-flex max-w-full items-center rounded-[4px] border border-solid px-2 py-[2px] text-body-small;
  color: v-bind(tagColor);
  background-color: v-bind(tagBackgroundColor);
  border-color: v-bind(tagBorderColor);
}

.tag.is-borderless {
  @apply border-transparent;
}
</style>
