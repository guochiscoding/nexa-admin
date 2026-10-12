<script setup lang="ts">
import { computed } from 'vue';
import { DatePicker as ADatePicker } from 'ant-design-vue';

import IconFont from '@/components/IconFont';

defineOptions({ inheritAttrs: false });

type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year';

const props = withDefaults(
  defineProps<{
    picker?: DatePickerMode;
    showTime?: boolean | Record<string, unknown>;
    valueFormat?: string;
    allowClear?: boolean;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  {
    picker: 'date',
    showTime: undefined,
    valueFormat: undefined,
    allowClear: undefined,
    disabled: undefined,
    placeholder: undefined,
  },
);

const value = defineModel<string | undefined>('value', {
  default: undefined,
});

const resolvedValueFormat = computed(() => {
  if (props.valueFormat) {
    return props.valueFormat;
  }

  if (props.showTime && props.picker === 'date') {
    return 'YYYY-MM-DD HH:mm:ss';
  }

  switch (props.picker) {
    case 'week':
      return 'gggg-wo';
    case 'month':
      return 'YYYY-MM';
    case 'quarter':
      return 'YYYY-[Q]Q';
    case 'year':
      return 'YYYY';
    default:
      return 'YYYY-MM-DD';
  }
});

function onUpdateValue(next: string | null) {
  value.value = next || undefined;
}
</script>

<template>
  <ADatePicker
    v-bind="$attrs"
    class="app-picker"
    popup-class-name="app-picker-dropdown"
    :picker="picker"
    :show-time="showTime"
    :value="value"
    :value-format="resolvedValueFormat"
    :allow-clear="allowClear"
    :disabled="disabled"
    :placeholder="placeholder"
    @update:value="onUpdateValue"
  >
    <template #suffixIcon>
      <slot name="suffixIcon">
        <IconFont type="icon-icon-calendar" />
      </slot>
    </template>
    <template #prevIcon>
      <IconFont type="icon-icon-chevron-left" />
    </template>
    <template #nextIcon>
      <IconFont type="icon-icon-chevron-right" />
    </template>
    <template #superPrevIcon>
      <IconFont type="icon-icon-chevron-left-double" />
    </template>
    <template #superNextIcon>
      <IconFont type="icon-icon-chevron-right-double" />
    </template>
  </ADatePicker>
</template>
