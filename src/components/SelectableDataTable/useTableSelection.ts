import { computed, type ComputedRef } from 'vue';

import type { RowKey, SelectActionPayload } from './types';

type TableRow = Record<string, unknown>;

interface TableSelectionProps {
  selectable: boolean;
  selectedRowKeys: RowKey[];
}

type TableSelectionEmit = {
  (event: 'update:selectedRowKeys', keys: RowKey[]): void;
  (event: 'selectionChange', payload: SelectActionPayload<TableRow>): void;
};

export function useTableSelection(options: {
  currentPageKeys: ComputedRef<RowKey[]>;
  currentPageRows: ComputedRef<TableRow[]>;
  emit: TableSelectionEmit;
  getRecordKey: (record: TableRow) => RowKey;
  props: TableSelectionProps;
  tableData: ComputedRef<TableRow[]>;
}) {
  const { currentPageKeys, currentPageRows, emit, getRecordKey, props, tableData } = options;

  function emitSelection(keys: RowKey[], action: SelectActionPayload<TableRow>['action']) {
    const normalizedKeys = Array.from(new Set(keys));
    const normalizedKeySet = new Set(normalizedKeys);
    const rows = tableData.value.filter((record) => normalizedKeySet.has(getRecordKey(record)));
    emit('update:selectedRowKeys', normalizedKeys);
    emit('selectionChange', {
      action,
      selectedRowKeys: normalizedKeys,
      selectedRows: rows,
      currentPageRows: currentPageRows.value,
    });
  }

  function handleSelectAllCurrentPage() {
    emitSelection([...props.selectedRowKeys, ...currentPageKeys.value], 'selectAll');
  }

  function handleInvertCurrentPage() {
    const nextKeySet = new Set(props.selectedRowKeys);
    currentPageKeys.value.forEach((key) => {
      if (nextKeySet.has(key)) {
        nextKeySet.delete(key);
      } else {
        nextKeySet.add(key);
      }
    });
    emitSelection(Array.from(nextKeySet), 'invert');
  }

  const rowSelection = computed(() => {
    if (!props.selectable) {
      return undefined;
    }

    return {
      fixed: true,
      columnWidth: 48,
      selectedRowKeys: props.selectedRowKeys,
      onChange: (keys: RowKey[]) => emitSelection(keys, 'row'),
    };
  });

  return {
    handleInvertCurrentPage,
    handleSelectAllCurrentPage,
    rowSelection,
  };
}

