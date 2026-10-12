<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { Select as ASelect } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

defineOptions({ inheritAttrs: false });

type SelectWidth = number | string;

export interface LabelFuzzyOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    /** 前置标签文案 */
    label: string;
    /** 占位符 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否允许清空 */
    allowClear?: boolean;
    /** 防抖延迟（ms） */
    debounce?: number;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: SelectWidth;
    /** 远程搜索方法，返回选项数组 */
    fetchOptions: (keyword: string) => Promise<LabelFuzzyOption[]>;
  }>(),
  {
    placeholder: undefined,
    disabled: false,
    allowClear: true,
    debounce: 300,
    width: '240px',
  },
);

const emit = defineEmits<{
  /** 选中值变化 */
  change: [value: string | undefined, option: LabelFuzzyOption | undefined];
  /** 搜索关键词变化 */
  search: [keyword: string];
}>();

const value = defineModel<string | undefined>({ default: undefined });
const { t } = useI18n();
const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.searchContentPlaceholder'));
const notFoundContent = computed(() => (loading.value ? t('common.searching') : null));
const options = ref<LabelFuzzyOption[]>([]);
const loading = ref(false);

let timer: ReturnType<typeof setTimeout> | undefined;

function clearTimer() {
  if (timer === undefined) return;
  clearTimeout(timer);
  timer = undefined;
}

function handleSearch(keyword: string) {
  emit('search', keyword);
  clearTimer();

  if (!keyword) {
    options.value = [];
    return;
  }

  timer = setTimeout(async () => {
    loading.value = true;
    try {
      options.value = await props.fetchOptions(keyword);
      //options.value=[{ value: '1', label: '文档'},{ value: '2', label: '2'}]
    } catch (error) {
      console.error('LabelFuzzyInput fetch error:', error);
      options.value = [];
    } finally {
      loading.value = false;
    }
  }, props.debounce);
}

function handleChange(nextValue: string | undefined, option: LabelFuzzyOption | LabelFuzzyOption[] | undefined) {
  const single = Array.isArray(option) ? option[0] : option;
  emit('change', nextValue, single);
}

watch(value, (nextValue) => {
  if (!nextValue) {
    options.value = [];
  }
});

onBeforeUnmount(clearTimer);
</script>

<template>
  <div class="label-fuzzy-input" :class="{ 'is-disabled': disabled }">
    <span class="label-fuzzy-input-text">{{ label }}：</span>
    <ASelect
      v-bind="$attrs"
      v-model:value="value"
      class="label-fuzzy-input-control common-select"
      popup-class-name="common-select-dropdown"
      show-search
      :placeholder="resolvedPlaceholder"
      :disabled="disabled"
      :allow-clear="allowClear"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="notFoundContent"
      :options="options"
      :loading="loading"
      @search="handleSearch"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.label-fuzzy-input {
  @apply relative z-0 inline-flex h-8 min-w-0 items-center rounded border border-component-border bg-container pl-2 pr-2 transition-[border-color,box-shadow,background-color];
  width: v-bind(resolvedWidth);
}

.label-fuzzy-input:hover:not(.is-disabled):not(:focus-within) {
  @apply border-brand-black-hover;
}

.label-fuzzy-input:focus-within {
  @apply z-10 border-brand-black-active shadow-td-shadow-4;
}

.label-fuzzy-input.is-disabled {
  @apply cursor-not-allowed bg-color-page;
}

.label-fuzzy-input-text {
  @apply shrink-0 text-body-medium leading-[22px] font-medium text-font-black-gy2;
}

.label-fuzzy-input-control {
  @apply h-[30px] min-w-0 flex-1 !shadow-none;
}

.label-fuzzy-input-control.ant-select-focused,
.label-fuzzy-input-control.ant-select-focused:hover {
  @apply !shadow-none;
}

.label-fuzzy-input-control :deep(.ant-select-selector) {
  @apply !h-[30px] !border-0 !bg-transparent !p-0 !shadow-none;
}

.label-fuzzy-input-control.ant-select-focused :deep(.ant-select-selector),
.label-fuzzy-input-control.ant-select-focused:hover :deep(.ant-select-selector) {
  @apply !border-0 !shadow-none;
}

.label-fuzzy-input-control :deep(.ant-select-selection-search) {
  inset-inline-start: 0 !important;
  inset-inline-end: 0 !important;
}

.label-fuzzy-input-control :deep(.ant-select-selection-search-input) {
  @apply !h-[30px] !text-body-medium !text-font-black-gy1;
}

.label-fuzzy-input-control :deep(.ant-select-selection-placeholder),
.label-fuzzy-input-control :deep(.ant-select-selection-item) {
  @apply !text-body-medium;
  line-height: 30px !important;
}

.label-fuzzy-input-control :deep(.ant-select-selection-item) {
  @apply !text-font-black-gy1;
}

.label-fuzzy-input.is-disabled .label-fuzzy-input-text,
.label-fuzzy-input.is-disabled :deep(.ant-select-selection-placeholder),
.label-fuzzy-input.is-disabled :deep(.ant-select-selection-item) {
  @apply !text-font-black-gy4;
}
</style>
