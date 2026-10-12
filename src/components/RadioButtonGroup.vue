<script setup lang="ts">
import { useId } from 'vue';
import { RadioGroup as ARadioGroup, RadioButton as ARadioButton } from 'ant-design-vue';

defineOptions({ inheritAttrs: false });

/** 选项值，绑定值与选项 value 类型保持一致 */
export type RadioButtonValue = string | number;

export interface RadioButtonOption {
  /** 唯一且稳定的值，不使用翻译文字作为标识 */
  value: RadioButtonValue;
  /** 展示文字，由调用方提供国际化内容 */
  label: string;
  /** 是否禁用当前选项，默认 false */
  disabled?: boolean;
}

withDefaults(defineProps<{
  /** 选项列表；列表变化时由调用方维护有效的选中值 */
  options: RadioButtonOption[];
  /** 是否禁用整组，默认 false */
  disabled?: boolean;
}>(), {
  disabled: false,
});

/** 当前选中值，初始选中项由调用方指定；undefined 表示未选择 */
const selectedValue = defineModel<RadioButtonValue | undefined>({ required: true });

const emit = defineEmits<{
  /** 用户切换选项时触发，重复点击或外部赋值不触发 */
  change: [value: RadioButtonValue];
}>();

defineSlots<{
  /** 自定义单项内容，默认显示 label；可加入 IconFont、Tag */
  label?: (props: { option: RadioButtonOption; active: boolean }) => unknown;
}>();

const groupName = `radio-button-group-${useId()}`;

function handleUpdateValue(value: RadioButtonValue) {
  selectedValue.value = value;
  emit('change', value);
}
</script>

<template>
  <ARadioGroup
    :name="groupName"
    v-bind="$attrs"
    :value="selectedValue"
    :disabled="disabled"
    class="app-radio-button-group"
    role="radiogroup"
    button-style="outline"
    @update:value="handleUpdateValue"
  >
    <ARadioButton
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      <span class="app-radio-button-label">
        <slot name="label" :option="option" :active="selectedValue === option.value">
          {{ option.label }}
        </slot>
      </span>
    </ARadioButton>
  </ARadioGroup>
</template>

<style scoped>
@reference "../styles/index.css";

.app-radio-button-label {
  @apply inline-flex items-center justify-center gap-1 whitespace-nowrap;
}
</style>
