<script setup lang="ts">
import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';

import IconFont from '@/components/IconFont';

defineOptions({ inheritAttrs: false });

/** 标签标识，绑定值与选项 key 保持相同类型 */
export type TabKey = string | number;

export interface TabItem {
  /** 唯一且稳定的标识，不使用数组下标或翻译文案 */
  key: TabKey;
  /** 标签文字，由调用方提供国际化内容 */
  label: string;
  /** 是否禁用当前标签，默认 false */
  disabled?: boolean;
  /** 可选前置 IconFont 图标名称 */
  icon?: string;
  /** 可选计数，不传则隐藏，0 正常显示 */
  count?: number;
}

withDefaults(defineProps<{
  /** 标签列表；列表变化时，由调用方保证选中 key 仍然有效 */
  items: TabItem[];
  /** 标签字号：16px / 24px 行高，或 14px / 22px 行高；默认 16 */
  fontSize?: 14 | 16;
}>(), {
  fontSize: 16,
});

/** 当前选中标识，由调用方指定初始值 */
const activeKey = defineModel<TabKey>({ required: true });

const emit = defineEmits<{
  /** 用户切换标签时触发，重复点击当前标签不触发 */
  change: [key: TabKey];
}>();

const slots = defineSlots<{
  /** 自定义标签，默认显示图标和文字 */
  label?: (props: { item: TabItem; active: boolean }) => unknown;
  /** 文字后方的自定义 Tag 等内容，有内容时替换该项默认计数 */
  labelSuffix?: (props: { item: TabItem; active: boolean }) => unknown;
  /** 对应标签的内容，由 Ant TabPane 管理渲染与保留 */
  default?: (props: { item: TabItem }) => unknown;
  /** 标签栏右侧操作区 */
  extra?: () => unknown;
}>();
</script>

<template>
  <ATabs
    v-bind="$attrs"
    v-model:active-key="activeKey"
    class="app-tabs"
    :class="{ 'app-tabs--14': fontSize === 14 }"
    type="line"
    tab-position="top"
    :tab-bar-gutter="48"
    @change="emit('change', $event)"
  >
    <ATabPane v-for="item in items" :key="item.key" :disabled="item.disabled">
      <template #tab>
        <slot name="label" :item="item" :active="activeKey === item.key">
          <span class="app-tabs-label">
            <span class="app-tabs-label-content">
              <IconFont
                v-if="item.icon"
                :type="item.icon"
                class="app-tabs-icon"
                aria-hidden="true"
              />
              <span>{{ item.label }}</span>
            </span>
            <slot name="labelSuffix" :item="item" :active="activeKey === item.key">
              <span
                v-if="item.count !== undefined"
                class="app-tabs-count"
                :class="{ 'is-active': activeKey === item.key, 'is-disabled': item.disabled }"
              >
                {{ item.count }}
              </span>
            </slot>
          </span>
        </slot>
      </template>
      <slot :item="item" />
    </ATabPane>
    <template v-if="slots.extra" #rightExtra>
      <slot name="extra" />
    </template>
  </ATabs>
</template>

<style scoped>
@reference "../styles/index.css";

.app-tabs {
  @apply min-w-0 max-w-full;
}

.app-tabs-label {
  @apply inline-flex items-center gap-2;
}

.app-tabs-label-content {
  @apply inline-flex items-center gap-1;
}

.app-tabs-count {
  @apply inline-flex h-[22px] shrink-0 items-center justify-center !px-1.5 rounded-[12px]  bg-secondarycontainer text-title-small text-font-black-gy3 border border-solid border-component-border hover:border-brand-blue-active;
}

.app-tabs-count.is-active {
  @apply bg-brand-blue-active text-font-white-gy1 border-brand-blue-active;
}

.app-tabs-count.is-disabled {
  @apply bg-secondarycontainer text-font-black-gy4;
}

.app-tabs-label .app-tabs-icon {
  @apply text-inherit;
}
</style>
