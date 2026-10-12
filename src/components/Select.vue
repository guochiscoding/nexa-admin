<script setup lang="ts">
/**
 * Select — 通用选择器
 *
 * 对外契约：
 * - v-model 绑定选中值
 * - 默认单选，可通过 mode 配置 multiple / tags / combobox
 * - showSearch 可配置是否支持搜索
 * - change 事件在用户选择变化时抛出当前值和选中项
 * - 多选模式下，下拉项前置 Checkbox
 */
import { computed } from 'vue';
import { Select as ASelect, SelectOption as ASelectOption, Checkbox as ACheckbox } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import IconFont from '@/components/IconFont';

type SelectMode = 'multiple' | 'tags' | 'combobox';
type SelectOptionValue = string | number;
type SelectModelValue = SelectOptionValue | SelectOptionValue[] | undefined;
type SelectWidth = number | string;

export interface SelectOptionItem {
  label: string;
  value: SelectOptionValue;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** 选项列表 */
    options?: SelectOptionItem[];
    /** 占位文案；不传则使用 common.selectPlaceholder */
    placeholder?: string;
    /** 选择器模式；不传时为单选 */
    mode?: SelectMode;
    /** 禁用态：不可点击、不可聚焦 */
    disabled?: boolean;
    /** 整体宽度：数字按 px 处理，字符串原样作为 CSS width */
    width?: SelectWidth;
    /** 是否支持搜索 */
    showSearch?: boolean;
  }>(),
  {
    options: () => [],
    placeholder: undefined,
    mode: undefined,
    disabled: false,
    width: '240px',
    showSearch: true,
  },
);

const emit = defineEmits<{
  /** 用户选择变化时抛出当前值和选中项 */
  change: [value: SelectModelValue, selectedOptions: SelectOptionItem[]];
}>();

const selectedValue = defineModel<SelectModelValue>({ default: undefined });
const { t } = useI18n();

const resolvedPlaceholder = computed(() => props.placeholder ?? t('common.selectPlaceholder'));

const resolvedWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));

const selectedValues = computed(() => {
  if (Array.isArray(selectedValue.value)) return selectedValue.value;
  return selectedValue.value === undefined ? [] : [selectedValue.value];
});

const selectedOptions = computed(() =>
  props.options.filter((option) => selectedValues.value.includes(option.value)),
);

const isMultipleMode = computed(() => props.mode === 'multiple');

function isOptionSelected(value: SelectOptionValue) {
  return selectedValues.value.includes(value);
}

function handleUpdateValue(nextValue: SelectModelValue) {
  selectedValue.value = nextValue;
  emit('change', nextValue, selectedOptions.value);
}
</script>

<template>
  <ASelect
    :value="selectedValue"
    class="common-select"
    popup-class-name="common-select-dropdown"
    option-label-prop="label"
    option-filter-prop="label"
    show-arrow
    allow-clear
    :mode="mode"
    :placeholder="resolvedPlaceholder"
    :disabled="disabled"
    :virtual="false"
    :show-search="showSearch"
    max-tag-count="responsive"
    @update:value="handleUpdateValue"
  >
    <template #suffixIcon>
      <IconFont type="icon-icon-chevron-down" aria-hidden="true" />
    </template>

    <template #removeIcon>
      <IconFont type="icon-icon-close" aria-hidden="true" />
    </template>

    <ASelectOption
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :label="option.label"
      :disabled="option.disabled"
    >
      <span class="common-select-option-content">
        <ACheckbox
          v-if="isMultipleMode"
          class="common-select-option-checkbox"
          :checked="isOptionSelected(option.value)"
          tabindex="-1"
        />
        <span class="common-select-option-label">{{ option.label }}</span>
      </span>
    </ASelectOption>
  </ASelect>
</template>

<style scoped>
@reference "../styles/index.css";

.common-select {
  width: v-bind(resolvedWidth);
}
</style>
