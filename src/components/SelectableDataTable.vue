<script setup lang="ts">
import { computed, h, useSlots } from 'vue';
import { useI18n } from 'vue-i18n';
import { Table as ATable } from 'ant-design-vue';
import AppEmpty from '@/components/Empty.vue';
import IconFont from './IconFont';
import { useExpandableRows } from './SelectableDataTable/useExpandableRows';
import { useRowDragSort } from './SelectableDataTable/useRowDragSort';
import { useTableColumns } from './SelectableDataTable/useTableColumns';
import { useTablePagination } from './SelectableDataTable/useTablePagination';
import { useTableSelection } from './SelectableDataTable/useTableSelection';
import type {
  ColumnWidth,
  PageChangePayload,
  RowClassName,
  RowDragSortPayload,
  RowExpandable,
  RowKey,
  SelectActionPayload,
  SelectableTableColumn,
} from './SelectableDataTable/types';

const props = withDefaults(defineProps<{
  columns: SelectableTableColumn[];
  dataSource: Record<string, unknown>[];
  rowKey?: string;
  rowDraggable?: boolean;
  dragHandleColumnWidth?: ColumnWidth;
  dragHandleAriaLabel?: string;
  expandable?: boolean;
  expandColumnWidth?: ColumnWidth;
  expandedRowKeys?: RowKey[];
  defaultExpandedRowKeys?: RowKey[];
  rowExpandable?: RowExpandable;
  selectable?: boolean;
  selectedRowKeys?: RowKey[];
  total?: number;
  current?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  remotePagination?: boolean;
  scrollX?: number | string;
  scrollY?: number | string;
  emptyText?: string;
  showSelectionActions?: boolean;
  showFooter?: boolean;
  rowClassName?: RowClassName;
}>(), {
  rowKey: 'id',
  rowDraggable: false,
  dragHandleColumnWidth: 48,
  dragHandleAriaLabel: '',
  expandable: false,
  expandColumnWidth: 48,
  expandedRowKeys: undefined,
  defaultExpandedRowKeys: () => [],
  rowExpandable: undefined,
  selectable: false,
  selectedRowKeys: () => [],
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 50],
  remotePagination: false,
  scrollX: undefined,
  scrollY: undefined,
  emptyText: '',
  showSelectionActions: true,
  showFooter: true,
  rowClassName: undefined,
});

const emit = defineEmits<{
  'update:current': [page: number];
  'update:dataSource': [rows: Record<string, unknown>[]];
  'update:expandedRowKeys': [keys: RowKey[]];
  'update:pageSize': [size: number];
  'update:selectedRowKeys': [keys: RowKey[]];
  rowDragSort: [payload: RowDragSortPayload<Record<string, unknown>>];
  rowClick: [record: Record<string, unknown>, event: MouseEvent];
  selectionChange: [payload: SelectActionPayload<Record<string, unknown>>];
  pageChange: [payload: PageChangePayload];
}>();

const { t } = useI18n();
const slots = useSlots();
const dragHandleLabel = computed(() => props.dragHandleAriaLabel || t('table.dragSort'));
const resolvedEmptyText = computed(() => props.emptyText || t('table.emptyText'));
const emptyContent = computed(() => h(AppEmpty, { class: 'table-empty-content', description: resolvedEmptyText.value }));
const tableBodyHeight = computed(() => {
  if (typeof props.scrollY === 'number') {
    return `${props.scrollY}px`;
  }

  return props.scrollY ?? '240px';
});

const tableData = computed(() => props.dataSource);
const {
  canExpandRows,
  createExpandSlotProps,
  effectiveExpandedRowKeys,
  handleExpandedRowKeysUpdate,
  isRecordExpandable,
  isRecordExpanded,
  renderExpandIcon,
  renderExpandedRow,
  resolveExpandedRowClassName,
} = useExpandableRows({
  emit,
  getRecordKey,
  props,
  slots,
  t,
});
const {
  currentPageKeys,
  currentPageRows,
  effectiveTotal,
  emitPageChange,
  handleJump,
  handlePageSizeChange,
  innerCurrent,
  innerPageSize,
  isEmptyPage,
  jumpPage,
  pageNumbers,
  pagedData,
  totalPages,
} = useTablePagination({
  emit,
  getRecordKey,
  props,
  tableData,
});
const {
  draggedRowKey,
  dragInsertPosition,
  dragOverRowKey,
  dropAnimatingRowKey,
  dropAnimationDirection,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
} = useRowDragSort({
  emit,
  getRecordKey,
  innerCurrent,
  innerPageSize,
  props,
  tableData,
});
const {
  handleInvertCurrentPage,
  handleSelectAllCurrentPage,
  rowSelection,
} = useTableSelection({
  currentPageKeys,
  currentPageRows,
  emit,
  getRecordKey,
  props,
  tableData,
});
const {
  getExpandColumnWidth,
  handleResizeColumn,
  tableColumns,
  tableScroll,
  tableScrollXStyle,
} = useTableColumns({
  canExpandRows,
  createExpandSlotProps,
  dragHandleLabel,
  handleDragEnd,
  handleDragStart,
  props,
  slots,
});

function getRecordKey(record: Record<string, unknown>): RowKey {
  const key = record[props.rowKey];
  if (typeof key === 'number' || typeof key === 'string') {
    return key;
  }
  return String(key ?? '');
}

function resolveCustomRow(record: Record<string, unknown>) {
  const rowEvents: Record<string, (event: MouseEvent | DragEvent) => void> = {
    onClick: (event: MouseEvent | DragEvent) => emit('rowClick', record, event as MouseEvent),
  };

  if (props.rowDraggable) {
    rowEvents.onDragover = (event: MouseEvent | DragEvent) => handleDragOver(event as DragEvent, record);
    rowEvents.onDrop = (event: MouseEvent | DragEvent) => handleDrop(event as DragEvent, record);
  }

  return rowEvents;
}

function resolveRowClassName(record: Record<string, unknown>, index: number) {
  const customClass = typeof props.rowClassName === 'function' ? props.rowClassName(record, index) : props.rowClassName;
  const rowKey = getRecordKey(record);
  const dragClass = [
    isRecordExpanded(record) ? 'is-row-expanded' : '',
    draggedRowKey.value === rowKey ? 'is-row-dragging' : '',
    dragOverRowKey.value === rowKey && draggedRowKey.value !== rowKey ? 'is-row-drag-over' : '',
    dragOverRowKey.value === rowKey && draggedRowKey.value !== rowKey ? `is-row-drag-over-${dragInsertPosition.value}` : '',
    dropAnimatingRowKey.value === rowKey ? 'is-row-drop-animating' : '',
    dropAnimatingRowKey.value === rowKey ? `is-row-drop-${dropAnimationDirection.value}` : '',
  ].filter(Boolean).join(' ');

  return [customClass, dragClass].filter(Boolean).join(' ');
}
</script>

<template>
  <div class="selectable-data-table">
    <div
      v-if="$slots.toolbar"
      class="table-toolbar"
    >
      <slot name="toolbar" />
    </div>

    <ATable
      class="antd-data-table"
      :class="{ 'is-empty-table': isEmptyPage }"
      :columns="tableColumns"
      :data-source="pagedData"
      :pagination="false"
      :row-key="rowKey"
      :row-selection="rowSelection"
      :row-class-name="resolveRowClassName"
      :scroll="tableScroll"
      :custom-row="resolveCustomRow"
      :show-expand-column="canExpandRows"
      :expand-fixed="canExpandRows ? 'left' : false"
      :expand-column-width="getExpandColumnWidth()"
      :expanded-row-keys="effectiveExpandedRowKeys"
      :expanded-row-render="canExpandRows ? renderExpandedRow : undefined"
      :expanded-row-class-name="resolveExpandedRowClassName"
      :expand-icon="renderExpandIcon"
      :row-expandable="isRecordExpandable"
      :locale="{ emptyText: emptyContent }"
      table-layout="fixed"
      size="middle"
      @update:expanded-row-keys="handleExpandedRowKeysUpdate"
      @resize-column="handleResizeColumn"
    />

    <div v-if="showFooter" class="table-footer">
      <div
        v-if="showSelectionActions"
        class="selection-actions"
      >
        <button
          class="selection-action-btn"
          type="button"
          :disabled="!selectable"
          @click="handleSelectAllCurrentPage"
        >
          {{ t('table.selectCurrentPage') }}
        </button>
        <button
          class="selection-action-btn"
          type="button"
          :disabled="!selectable"
          @click="handleInvertCurrentPage"
        >
          {{ t('table.invertCurrentPage') }}
        </button>
      </div>

      <div class="pagination-controls">
        <span class="total-text">{{ t('table.total', { total: effectiveTotal }) }}</span>
        <button
          class="page-icon-btn"
          type="button"
          :disabled="innerCurrent <= 1"
          :aria-label="t('table.previousPage')"
          @click="emitPageChange(innerCurrent - 1)"
        >
          <IconFont type="icon-icon-chevron-left" />
        </button>
        <template
          v-for="(item, idx) in pageNumbers"
          :key="idx"
        >
          <span
            v-if="item === '...'"
            class="page-ellipsis"
          >...</span>
          <button
            v-else
            class="page-number-btn"
            :class="{ 'is-active': item === innerCurrent }"
            type="button"
            @click="emitPageChange(Number(item))"
          >
            {{ item }}
          </button>
        </template>
        <button
          class="page-icon-btn"
          type="button"
          :disabled="innerCurrent >= totalPages"
          :aria-label="t('table.nextPage')"
          @click="emitPageChange(innerCurrent + 1)"
        >
          <IconFont type="icon-icon-chevron-right" />
        </button>
        <div class="page-size-wrapper">
          <select
            class="page-size-select"
            :value="innerPageSize"
            @change="handlePageSizeChange"
          >
            <option
              v-for="option in pageSizeOptions"
              :key="option"
              :value="option"
            >
              {{ t('table.pageSize', { size: option }) }}
            </option>
          </select>
          <IconFont
            type="icon-icon-chevron-down"
            class="page-size-icon"
            aria-hidden="true"
          />
        </div>
        <span class="jump-label">{{ t('table.jumpTo') }}</span>
        <input
          v-model="jumpPage"
          class="jump-input"
          inputmode="numeric"
          :aria-label="t('table.jumpPageInput')"
          @keyup.enter="handleJump"
          @blur="handleJump"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.selectable-data-table {
  @apply flex w-full flex-col bg-container text-body-medium text-font-black-gy1;
  --table-scroll-x: v-bind(tableScrollXStyle);
}

.table-toolbar {
  @apply mb-4 flex items-center justify-between gap-4;
}

.antd-data-table {
  @apply w-full;
}

.antd-data-table :deep(.ant-table-content > table) {
  @apply !min-w-0;
}

.antd-data-table :deep(.ant-table-placeholder .ant-table-cell) {
  @apply !bg-container !p-0 align-middle;
  height: v-bind(tableBodyHeight);
}

.antd-data-table.is-empty-table :deep(.ant-table-body > table),
.antd-data-table.is-empty-table :deep(.ant-table-tbody),
.antd-data-table.is-empty-table :deep(.ant-table-placeholder),
.antd-data-table.is-empty-table :deep(.ant-table-placeholder .ant-table-cell) {
  @apply h-full;
}

.antd-data-table :deep(.ant-table-placeholder .ant-table-cell > div) {
  @apply flex h-full min-h-40 items-center justify-center;
}

.antd-data-table :deep(.ant-table-placeholder:hover .ant-table-cell) {
  @apply !bg-container;
}

.antd-data-table :deep(.table-empty-content) {
  @apply h-full min-h-40;
}

.antd-data-table :deep(.drag-handle-header-cell),
.antd-data-table :deep(.drag-handle-cell) {
  @apply !px-4 !py-2 !text-center;
}

.antd-data-table :deep(.ant-table-row-expand-icon-cell) {
  @apply !px-3 !py-2 !text-center;
}

.antd-data-table :deep(.selectable-table-expand-toggle) {
  @apply mx-auto inline-flex size-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-font-black-gy3 outline-none hover:text-brand-blue-hover;
}

.antd-data-table :deep(.selectable-table-expand-toggle.is-expanded) {
  @apply text-brand-blue;
}

.antd-data-table :deep(.selectable-table-expand-toggle .iconfont) {
  @apply inline-flex size-4 items-center justify-center text-body-medium leading-none;
}

.antd-data-table :deep(.selectable-table-expand-placeholder) {
  @apply mx-auto block size-5;
}

.antd-data-table :deep(.drag-handle-cell *) {
  @apply !text-center;
}

.antd-data-table :deep(.drag-handle-header-icon) {
  @apply mx-auto inline-flex size-6 items-center justify-center text-body-medium leading-none text-font-black-gy4;
}

.antd-data-table :deep(.row-drag-handle) {
  @apply mx-auto inline-flex size-6 cursor-grab items-center justify-center rounded border-0 bg-transparent p-0 text-font-black-gy1 outline-none hover:bg-container-hover active:cursor-grabbing;
}

.antd-data-table :deep(.drag-handle-header-icon .iconfont),
.antd-data-table :deep(.row-drag-handle .iconfont) {
  @apply inline-flex size-4 items-center justify-center text-body-medium leading-none;
}

.antd-data-table :deep(.ant-table-tbody > tr:not(.ant-table-measure-row) > td) {
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease,
    transform 260ms ease;
}

.antd-data-table :deep(.ant-table-tbody > tr:not(.ant-table-measure-row):last-child > td) {
  @apply !border-b-0;
}

.antd-data-table :deep(.ant-table-tbody > tr.is-row-expanded > td),
.antd-data-table :deep(.ant-table-tbody > tr.is-row-expanded > td.ant-table-cell-row-hover) {
  @apply !border-b-0 !bg-color-container-active !font-medium;
}

.antd-data-table :deep(.ant-table-tbody > tr.is-row-expanded:hover > td) {
  @apply !bg-color-container-active !font-medium;
}

.antd-data-table :deep(.ant-table-tbody > tr.ant-table-expanded-row > td),
.antd-data-table :deep(.ant-table-tbody > tr.ant-table-expanded-row > td.ant-table-cell-row-hover),
.antd-data-table :deep(.ant-table-tbody > tr.selectable-table-expanded-row > td),
.antd-data-table :deep(.ant-table-tbody > tr.selectable-table-expanded-row > td.ant-table-cell-row-hover) {
  @apply !border-t-0 !bg-color-container-active !p-0;
}

.antd-data-table :deep(.ant-table-tbody > tr.ant-table-expanded-row:hover > td),
.antd-data-table :deep(.ant-table-tbody > tr.selectable-table-expanded-row:hover > td) {
  @apply !bg-color-container-active;
}

.antd-data-table :deep(.ant-table-expanded-row .ant-table-expanded-row-fixed),
.antd-data-table :deep(.selectable-table-expanded-row .ant-table-expanded-row-fixed) {
  @apply !m-0 !bg-color-page !p-0;
}

.antd-data-table :deep(.selectable-table-expanded-content) {
  @apply w-full bg-color-container p-4 text-body-medium text-font-black-gy1;
}

.antd-data-table :deep(.is-row-dragging > td) {
  @apply !bg-color-secondarycontainer opacity-60;
}

.antd-data-table :deep(.is-row-drag-over > td) {
  @apply !bg-brand-blue-light;
}

.antd-data-table :deep(.is-row-drag-over-before > td) {
  box-shadow: inset 0 2px 0 var(--brand-blue) !important;
}

.antd-data-table :deep(.is-row-drag-over-after > td) {
  box-shadow: inset 0 -2px 0 var(--brand-blue) !important;
}

.antd-data-table :deep(.is-row-drop-animating > td) {
  @apply !bg-brand-blue-light;
  animation-duration: 260ms;
  animation-timing-function: ease-out;
}

.antd-data-table :deep(.is-row-drop-up > td) {
  animation-name: row-drop-settle-up;
}

.antd-data-table :deep(.is-row-drop-down > td) {
  animation-name: row-drop-settle-down;
}

@keyframes row-drop-settle-up {
  from {
    transform: translateY(8px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes row-drop-settle-down {
  from {
    transform: translateY(-8px);
  }
  to {
    transform: translateY(0);
  }
}

.align-left {
  @apply text-left;
}

.align-center {
  @apply text-center;
}

.align-right {
  @apply text-right;
}

.cell-wrap {
  @apply whitespace-normal break-words text-left;
}

.cell-ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap text-left;
}

.cell-text-wrap {
  @apply block w-full whitespace-normal break-words text-left;
}

.cell-text-ellipsis {
  @apply block max-w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left;
}

.selectable-data-table :deep(.selectable-table-header-title) {
  @apply inline-flex min-w-0 items-center;
}

.selectable-data-table :deep(.selectable-table-header-required-mark) {
  @apply text-error-color;
}

.group-accent-default {
  @apply border-brand-black;
}

.group-accent-success {
  @apply border-success-color;
}

.group-accent-none {
  @apply border-component-border;
}

.table-footer {
  @apply flex w-full items-center justify-between gap-4 pt-3;
}

.selection-actions {
  @apply inline-flex h-8 items-center overflow-hidden rounded border border-component-border bg-container p-0.5;
}

.selection-action-btn {
  @apply h-7 cursor-pointer rounded-sm border-0 bg-transparent px-3 text-body-medium text-font-black-gy1 hover:bg-container-hover disabled:cursor-not-allowed disabled:text-font-black-gy4;
}

.selection-action-btn + .selection-action-btn {
  @apply relative ml-2 border-l-0;
}

.selection-action-btn + .selection-action-btn::before {
  @apply absolute top-1/2 h-3 w-px -translate-y-1/2 bg-component-border;
  content: "";
  left: -4px;
}

.pagination-controls {
  @apply ml-auto flex items-center gap-2 text-body-medium text-font-black-gy2;
}

.total-text {
  @apply mr-2 whitespace-nowrap text-font-black-gy1;
}

.page-icon-btn,
.page-number-btn {
  @apply flex size-8 cursor-pointer items-center justify-center rounded border border-component-border bg-container text-body-medium text-font-black-gy3 hover:bg-container-hover hover:text-brand-black;
}

.page-icon-btn {
  @apply disabled:cursor-not-allowed disabled:text-font-black-gy4 hover:disabled:bg-container hover:disabled:text-font-black-gy4;
}

.page-number-btn.is-active {
  @apply border-brand-black font-medium text-font-black-gy1;
}

.page-ellipsis {
  @apply flex size-8 items-center justify-center text-body-medium text-font-black-gy3 select-none;
}

.page-size-wrapper {
  @apply relative ml-1 inline-flex items-center;
}

.page-size-select {
  @apply h-8 cursor-pointer appearance-none rounded border border-component-border bg-container pl-2 pr-7 text-body-medium text-font-black-gy1 outline-none hover:bg-container-hover focus:border-brand-black;
}

.page-size-icon {
  @apply pointer-events-none absolute right-2 text-font-black-gy3;
}

.jump-label {
  @apply ml-1 whitespace-nowrap text-brand-black;
}

.jump-input {
  @apply h-8 w-12 rounded border border-component-border bg-container px-2 text-center text-body-medium text-font-black-gy1 outline-none focus:border-brand-black;
}
</style>
