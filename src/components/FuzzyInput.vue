<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Select as ASelect } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
type SelectWidth = number | string;
/** 下拉选项 */
export interface FuzzyOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
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
    fetchOptions: (keyword: string) => Promise<FuzzyOption[]>;
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
  change: [value: string | undefined, option: FuzzyOption | undefined];
  /** 搜索关键词变化 */
  search: [keyword: string];
}>();

const value = defineModel<string | undefined>({ default: undefined });
const { t } = useI18n();
const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.searchContentPlaceholder'));
const notFoundContent = computed(() => (loading.value ? t('common.searching') : null));
const options = ref<FuzzyOption[]>([]);
const loading = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;

/** 防抖执行远程搜索 */
function handleSearch(keyword: string) {
  emit('search', keyword);

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  if (!keyword) {
    options.value = [];
    return;
  }

  timer = setTimeout(async () => {
    loading.value = true;
    try {
      options.value = await props.fetchOptions(keyword);
      // options.value=[{ value: '1', label: '文档'},{ value: '2', label: '2'}]
    } catch (error) {
      console.error('FuzzyInput fetch error:', error);
      options.value = [];
    } finally {
      loading.value = false;
    }
  }, props.debounce);
}

function handleChange(val: string | undefined, option: FuzzyOption | FuzzyOption[] | undefined) {
  const single = Array.isArray(option) ? option[0] : option;
  emit('change', val, single);
}

/** 清空时同步清空选项 */
watch(value, (val) => {
  if (!val) {
    options.value = [];
  }
});
</script>

<template>
  <ASelect
    v-model:value="value"
    class="fuzzy-input common-select"
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
</template>

<style scoped>
@reference "../styles/index.css";

.fuzzy-input {
  width: v-bind(resolvedWidth);
}

.fuzzy-input :deep(.ant-select-selector) {
  @apply rounded-[4px] border-component-border;
} 

 .fuzzy-input :deep(.ant-select-selection-search-input) {
  @apply text-font-black-gy1;
}
</style>
