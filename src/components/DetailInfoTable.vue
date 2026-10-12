<script setup lang="ts">
import { computed } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';

type Tone = 'danger' | 'success' | 'default';

export interface DetailInfoItem {
  key: string | number;
  label: string;
  value: unknown;
  tone?: Tone;
  ellipsis?: boolean;
}

type LabelWidth = number | `${number}px`;

const props = withDefaults(defineProps<{
  items: DetailInfoItem[];
  labelWidth?: LabelWidth;
  bordered?: boolean;
}>(), {
  labelWidth: '88px',
  bordered: true,
});

defineSlots<Record<string, (props: { item: DetailInfoItem; value: unknown }) => unknown>>();

const gridTemplateColumns = computed(() => {
  const labelWidth = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth;
  return `${labelWidth} minmax(0, 1fr)`;
});

function getValueClass(item: DetailInfoItem) {
  return [
    'detail-info-value',
    item.ellipsis ? 'is-ellipsis' : undefined,
    item.tone && item.tone !== 'default' ? `tone-${item.tone}` : undefined,
  ].filter(Boolean).join(' ');
}

function getDisplayValue(value: unknown) {
  return value == null ? '' : String(value);
}
</script>

<template>
  <div class="detail-info-table" :class="{ 'is-bordered': bordered }">
    <div
      v-for="item in items"
      :key="item.key"
      class="detail-info-row"
      role="row"
    >
      <div class="detail-info-label" role="rowheader">
        {{ item.label }}
      </div>
      <ATooltip
        v-if="item.ellipsis"
        :title="getDisplayValue(item.value)"
        placement="topLeft"
      >
        <div :class="getValueClass(item)" role="cell">
          <slot :name="`item-${item.key}`" :item="item" :value="item.value">
            {{ getDisplayValue(item.value) }}
          </slot>
        </div>
      </ATooltip>
      <div v-else :class="getValueClass(item)" role="cell">
        <slot :name="`item-${item.key}`" :item="item" :value="item.value">
          {{ getDisplayValue(item.value) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.detail-info-table {
  @apply w-full overflow-hidden bg-container text-body-medium text-font-black-gy1 rounded-sm;
}

.detail-info-table.is-bordered {
  @apply border border-component-stroke;
}

.detail-info-row {
  @apply grid;
  grid-template-columns: v-bind(gridTemplateColumns);
}

.detail-info-label,
.detail-info-value {
  @apply  h-10 min-w-0 items-center border-r border-b border-component-stroke text-center leading-10;
}

.detail-info-label {
  @apply bg-color-page font-medium text-font-black-gy2;
}

.detail-info-value {

  @apply text-left px-4
}
.detail-info-row:last-child .detail-info-label,
.detail-info-row:last-child .detail-info-value {
  @apply border-b-0;
}

.detail-info-value {
  @apply border-r-0;
}

.detail-info-value {
  @apply bg-container text-font-black-gy1;
}

.detail-info-value.is-ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
}

.tone-danger {
  @apply text-error-color;
}

.tone-success {
  @apply text-success-color;
}
</style>
