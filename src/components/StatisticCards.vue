<script setup lang="ts">
import { computed, useId } from 'vue';
import { ClockCircleOutlined } from '@ant-design/icons-vue';

import LoadingSpinner from './LoadingSpinner.vue';

export interface StatisticCardItem {
  /** 卡片唯一标识，不使用标题或数组下标作为业务标识 */
  key: string | number;
  /** 卡片标题，由业务传入文案 */
  title: string;
  /** 数字按中文格式化，字符串原样展示，空值显示 -- */
  value?: number | string | null;
  /** 单项单位，不传则使用卡片区的 unit，空字符串表示隐藏 */
  unit?: string;
  /** 仅控制数值颜色，默认使用 Font-Black-Gy1 */
  colorType?: 'default' | 'blue' | 'warning' | 'success' | 'danger';
  /** 单项已格式化的更新时间，不传则使用卡片区的 updatedAt，空字符串表示隐藏 */
  updatedAt?: string;
  /** 单项加载状态；卡片区 loading 为 true 时全部显示加载 */
  loading?: boolean;
}

const props = withDefaults(defineProps<{
  /** 卡片数据，一项即单卡，多项自动排列，空数组不展示卡片 */
  items: readonly StatisticCardItem[];
  /** 兼容已有业务传参；卡片区始终按实际数量同一行均分宽度 */
  columns?: number;
  /** 所有卡片的默认单位，不传则不显示 */
  unit?: string;
  /** 所有卡片的默认更新时间，由业务传入，不自动生成 */
  updatedAt?: string;
  /** 统一加载状态，默认 false，复用 LoadingSpinner */
  loading?: boolean;
}>(), {
  columns: 4,
  unit: '',
  updatedAt: '',
  loading: false,
});

defineSlots<{
  /** 标题右侧内容，例如帮助图标、标签或操作按钮 */
  extra?: (props: { item: StatisticCardItem; index: number }) => unknown;
  /** 自定义数值，单位仍由 unit 控制；加载期间不显示 */
  value?: (props: { item: StatisticCardItem; index: number }) => unknown;
  /** 替换右下角的更新时间区域 */
  meta?: (props: { item: StatisticCardItem; index: number }) => unknown;
}>();

const titleId = `statistic-card-title-${useId()}`;
const numberFormatter = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 20 });
const gridTemplateColumns = computed(() => {
  const count = Math.max(1, props.items.length);
  return `repeat(${count}, minmax(0, 1fr))`;
});

function formatValue(value: StatisticCardItem['value']) {
  if (value == null || value === '') return '--';
  if (typeof value === 'string') return value;
  return Number.isFinite(value) ? numberFormatter.format(value) : '--';
}
</script>

<template>
  <section class="statistic-cards">
    <article
      v-for="(item, index) in items"
      :key="item.key"
      class="statistic-card"
      :aria-labelledby="`${titleId}-${index}`"
      :aria-busy="loading || !!item.loading"
    >
      <div class="statistic-card-header">
        <h2 :id="`${titleId}-${index}`" class="statistic-card-title">
          {{ item.title }}
        </h2>
        <div v-if="$slots.extra" class="statistic-card-extra">
          <slot name="extra" :item="item" :index="index" />
        </div>
      </div>
      <div class="statistic-card-details">
        <div class="statistic-card-value" :class="`is-${item.colorType ?? 'default'}`">
          <div v-if="loading || item.loading" class="statistic-card-loading">
            <LoadingSpinner size="large" aria-label="加载中" />
          </div>
          <template v-else>
            <slot name="value" :item="item" :index="index">
              {{ formatValue(item.value) }}
            </slot><span v-if="item.unit ?? unit" class="statistic-card-unit">{{ item.unit ?? unit }}</span>
          </template>
        </div>
        <div v-if="$slots.meta || (item.updatedAt ?? updatedAt)" class="statistic-card-meta">
          <slot name="meta" :item="item" :index="index">
            <ClockCircleOutlined class="statistic-card-time-icon" aria-hidden="true" />
            <span>数据更新于：{{ item.updatedAt ?? updatedAt }}</span>
          </slot>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
@reference "../styles/index.css";

.statistic-cards {
  @apply grid min-w-0 gap-6;
  grid-template-columns: v-bind(gridTemplateColumns);
}

.statistic-card { @apply flex min-w-0 flex-col rounded-lg bg-container px-5 py-4 shadow-td-shadow-0; }
.statistic-card-header { @apply flex min-w-0 flex-wrap items-center justify-between; }
.statistic-card-title { @apply m-0 min-w-0 text-(length:--font-size-titleMedium) leading-6 font-medium text-font-black-gy2 [overflow-wrap:anywhere]; }
.statistic-card-extra { @apply flex min-w-0 max-w-full items-center; }
.statistic-card-details { @apply mt-auto flex min-w-0 flex-wrap items-center justify-between; }
.statistic-card-value { @apply min-h-[38px] min-w-0 max-w-full text-headline-small leading-[38px] font-extrabold [overflow-wrap:anywhere]; }
.statistic-card-unit { @apply inline-block text-(length:--font-size-titleMedium) leading-6 font-medium text-font-black-gy2; }
.statistic-card-loading { @apply flex h-[38px] items-center; }
.statistic-card-meta { @apply flex min-w-0 max-w-full items-center gap-1 text-body-medium leading-[22px] font-normal text-font-black-gy4 [overflow-wrap:anywhere]; }
.statistic-card-time-icon { @apply shrink-0 text-(length:--font-size-titleMedium); }
.statistic-card-value.is-default { @apply text-font-black-gy1; }
.statistic-card-value.is-blue { @apply text-brand-blue; }
.statistic-card-value.is-warning { @apply text-warning-color; }
.statistic-card-value.is-success { @apply text-success-color; }
.statistic-card-value.is-danger { @apply text-error-color; }
</style>
