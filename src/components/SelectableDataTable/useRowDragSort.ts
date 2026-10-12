import { ref, type ComputedRef, type Ref } from 'vue';

import type { DragInsertPosition, DropAnimationDirection, RowDragSortPayload, RowKey } from './types';

type TableRow = Record<string, unknown>;

interface RowDragSortProps {
  rowDraggable: boolean;
}

type RowDragSortEmit = {
  (event: 'update:dataSource', rows: TableRow[]): void;
  (event: 'rowDragSort', payload: RowDragSortPayload<TableRow>): void;
};

export function useRowDragSort(options: {
  emit: RowDragSortEmit;
  getRecordKey: (record: TableRow) => RowKey;
  innerCurrent: Ref<number>;
  innerPageSize: Ref<number>;
  props: RowDragSortProps;
  tableData: ComputedRef<TableRow[]>;
}) {
  const { emit, getRecordKey, innerCurrent, innerPageSize, props, tableData } = options;
  const draggedRowKey = ref<RowKey>();
  const dragOverRowKey = ref<RowKey>();
  const dragInsertPosition = ref<DragInsertPosition>('before');
  const dropAnimatingRowKey = ref<RowKey>();
  const dropAnimationDirection = ref<DropAnimationDirection>('down');
  let dropAnimationTimer: number | undefined;

  function handleDragStart(event: DragEvent, record: TableRow) {
    if (!props.rowDraggable) {
      event.preventDefault();
      return;
    }

    const key = getRecordKey(record);
    draggedRowKey.value = key;
    dragOverRowKey.value = key;
    dragInsertPosition.value = 'before';

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(key));
    }
  }

  function handleDragOver(event: DragEvent, record: TableRow) {
    if (!props.rowDraggable || draggedRowKey.value === undefined) {
      return;
    }

    event.preventDefault();
    dragOverRowKey.value = getRecordKey(record);
    dragInsertPosition.value = getDragInsertPosition(event);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDrop(event: DragEvent, record: TableRow) {
    if (!props.rowDraggable || draggedRowKey.value === undefined) {
      return;
    }

    event.preventDefault();
    dragInsertPosition.value = getDragInsertPosition(event);

    const targetKey = getRecordKey(record);
    const sourceIndex = findRowIndexByKey(draggedRowKey.value);
    const targetIndex = findRowIndexByKey(targetKey);
    let insertIndex = targetIndex + (dragInsertPosition.value === 'after' ? 1 : 0);

    if (sourceIndex < 0 || targetIndex < 0) {
      resetDragState();
      return;
    }

    if (sourceIndex < insertIndex) {
      insertIndex -= 1;
    }

    if (sourceIndex === insertIndex) {
      resetDragState();
      return;
    }

    const nextRows = [...tableData.value];
    const [sourceRow] = nextRows.splice(sourceIndex, 1);

    if (!sourceRow) {
      resetDragState();
      return;
    }

    nextRows.splice(insertIndex, 0, sourceRow);
    startDropAnimation(getRecordKey(sourceRow), insertIndex > sourceIndex ? 'down' : 'up');

    const start = (innerCurrent.value - 1) * innerPageSize.value;
    const nextCurrentPageRows = nextRows.slice(start, start + innerPageSize.value);
    const payload = {
      sourceIndex,
      targetIndex,
      insertIndex,
      insertPosition: dragInsertPosition.value,
      sourceRow,
      targetRow: record,
      dataSource: nextRows,
      currentPageRows: nextCurrentPageRows,
    };

    emit('update:dataSource', nextRows);
    emit('rowDragSort', payload);
    resetDragState();
  }

  function handleDragEnd() {
    resetDragState();
  }

  function resetDragState() {
    draggedRowKey.value = undefined;
    dragOverRowKey.value = undefined;
    dragInsertPosition.value = 'before';
  }

  function startDropAnimation(rowKey: RowKey, direction: DropAnimationDirection) {
    dropAnimatingRowKey.value = rowKey;
    dropAnimationDirection.value = direction;

    if (dropAnimationTimer !== undefined) {
      window.clearTimeout(dropAnimationTimer);
    }

    dropAnimationTimer = window.setTimeout(() => {
      dropAnimatingRowKey.value = undefined;
      dropAnimationTimer = undefined;
    }, 260);
  }

  function getDragInsertPosition(event: DragEvent): DragInsertPosition {
    const rowElement = event.currentTarget instanceof HTMLElement
      ? event.currentTarget
      : (event.target instanceof HTMLElement ? event.target.closest('tr') : null);

    if (!rowElement) {
      return 'before';
    }

    const rect = rowElement.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
  }

  function findRowIndexByKey(key: RowKey) {
    return tableData.value.findIndex((row) => getRecordKey(row) === key);
  }

  return {
    draggedRowKey,
    dragInsertPosition,
    dragOverRowKey,
    dropAnimatingRowKey,
    dropAnimationDirection,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop,
  };
}

