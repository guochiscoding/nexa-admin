<script setup lang="ts">
/**
 * SearchInput — 通用搜索输入框
 *
 * 状态约定（颜色一律走 styles Token，禁止写死色值）：
 * - Normal  ：边框 component-border
 * - Hover   ：边框 brand-black-hover
 * - Focus   ：边框 brand-black-active + 阴影 elevation-base（--td-shadow-4）
 * - Disabled：边框 component-border、背景 bg-page，不可交互
 *
 * 对外契约：
 * - v-model 绑定输入值
 * - search 事件抛出当前关键词（点击搜索图标 / 回车）
 * - placeholder 可配置；未传时使用 i18n 默认搜索占位文案
 */
import { computed } from 'vue';
import { Input as AInput } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import IconFont from '@/components/IconFont';

const props = withDefaults(
  defineProps<{
    /** 占位文案；不传则使用 common.searchPlaceholder */
    placeholder?: string;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
  }>(),
  {
    placeholder: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  /** 触发搜索时抛出当前关键词（点击图标 / 回车） */
  search: [value: string];
}>();

/**
 * 关键词本地状态：
 * - 父组件可用 v-model 双向绑定
 * - 未绑定时也在组件内保存输入，保证点击搜索能拿到内容
 */
const keyword = defineModel<string>({ default: '' });
const { t } = useI18n();

/** 解析占位文案：优先 props，否则使用全局 i18n 默认值。 */
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.searchPlaceholder'));

/** 输入框有内容时，搜索图标切换为更高强调的颜色 */
const hasKeyword = computed(() => keyword.value.length > 0);

/**
 * 抛出搜索：Disabled 时直接短路，避免误触发。
 * 父组件通过 @search="fn" 接收关键词。
 */
function emitSearch() {
  if (props.disabled) return;
  emit('search', keyword.value.trim());
}
</script>

<template>
  <AInput
    v-model:value="keyword"
    class="search-input"
    :placeholder="resolvedPlaceholder"
    :disabled="disabled"
    allow-clear
    @press-enter="emitSearch"
  >
    <template #suffix>
      <!-- 搜索图标作为触发器；禁用时不响应点击 -->
      <button
        type="button"
        class="search-input-trigger"
        :class="{ 'is-active': hasKeyword }"
        :disabled="disabled"
        :aria-label="resolvedPlaceholder"
        @click="emitSearch"
      >
        <IconFont type="icon-icon-search" aria-hidden="true" />
      </button>
    </template>
  </AInput>
</template>

<style scoped>
@reference "../styles/index.css";

/*
 * Ant Design Input 带 suffix 时，根节点是 .ant-input-affix-wrapper，
 * 因此状态类直接挂在 .search-input 上即可。
 */

/* Normal：默认描边 */
.search-input {
  @apply w-[240px];
}

/* 后缀搜索按钮：重置默认 button 样式，仅作点击热区 */
.search-input-trigger {
  @apply inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-(length:--font-size-linkLarge) text-font-black-gy3;
}

.search-input-trigger.is-active {
  @apply text-font-black-gy1;
}
</style>
