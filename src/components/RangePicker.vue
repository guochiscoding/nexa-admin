<script setup lang="ts">
import { computed } from 'vue';
import { DatePicker as ADatePicker } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';

import IconFont from '@/components/IconFont';

defineOptions({ inheritAttrs: false });

type DatePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year';

export type RangePreset = {
  label: string;
  value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs]);
};

const props = withDefaults(
  defineProps<{
    picker?: DatePickerMode;
    showTime?: boolean | Record<string, unknown>;
    valueFormat?: string;
    presets?: RangePreset[];
    allowClear?: boolean;
    disabled?: boolean;
    placeholder?: [string, string];
  }>(),
  {
    picker: 'date',
    showTime: undefined,
    valueFormat: undefined,
    presets: undefined,
    allowClear: undefined,
    disabled: undefined,
    placeholder: undefined,
  },
);

const value = defineModel<[string, string] | undefined>('value', {
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

function normalizeRangeValue(
  next: [string, string] | string[] | null | undefined,
): [string, string] | undefined {
  if (!Array.isArray(next)) {
    return undefined;
  }

  const [start, end] = next;

  if (typeof start !== 'string' || typeof end !== 'string' || !start || !end) {
    return undefined;
  }

  return [start, end];
}

function onUpdateValue(next: [string, string] | string[] | null) {
  value.value = normalizeRangeValue(next);
}
</script>

<template>
  <ADatePicker.RangePicker
    v-bind="$attrs"
    class="app-picker"
    popup-class-name="app-picker-dropdown"
    :picker="picker"
    :show-time="showTime"
    :value="value"
    :value-format="resolvedValueFormat"
    :presets="presets"
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
  </ADatePicker.RangePicker>
</template>
