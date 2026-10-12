import { computed, ref, watch, type ComputedRef } from 'vue';

import type { PageChangePayload, RowKey } from './types';

type TableRow = Record<string, unknown>;

interface TablePaginationProps {
  current: number;
  pageSize: number;
  remotePagination: boolean;
  total: number;
}

type TablePaginationEmit = {
  (event: 'update:current', page: number): void;
  (event: 'update:pageSize', size: number): void;
  (event: 'pageChange', payload: PageChangePayload): void;
};

export function useTablePagination(options: {
  props: TablePaginationProps;
  tableData: ComputedRef<TableRow[]>;
  getRecordKey: (record: TableRow) => RowKey;
  emit: TablePaginationEmit;
}) {
  const { emit, getRecordKey, props, tableData } = options;
  const jumpPage = ref('');
  const innerCurrent = ref(props.current);
  const innerPageSize = ref(props.pageSize);

  watch(() => props.current, (val) => {
    innerCurrent.value = val;
    jumpPage.value = '';
  });

  watch(() => props.pageSize, (val) => {
    innerPageSize.value = val;
  });

  const effectiveTotal = computed(() => props.total || tableData.value.length);
  const totalPages = computed(() => Math.max(1, Math.ceil(effectiveTotal.value / innerPageSize.value)));

  const pagedData = computed(() => {
    if (props.remotePagination) return tableData.value;

    const start = (innerCurrent.value - 1) * innerPageSize.value;
    return tableData.value.slice(start, start + innerPageSize.value);
  });

  const currentPageRows = computed(() => pagedData.value);
  const currentPageKeys = computed(() => currentPageRows.value.map((record) => getRecordKey(record)));
  const isEmptyPage = computed(() => pagedData.value.length === 0);

  const pageNumbers = computed<(number | string)[]>(() => {
    const total = totalPages.value;
    const current = innerCurrent.value;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (current > 4) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (current < total - 3) {
      pages.push('...');
    }

    pages.push(total);
    return pages;
  });

  function emitPageChange(current: number, pageSize = innerPageSize.value) {
    const safeCurrent = Math.min(Math.max(current, 1), Math.max(1, Math.ceil(effectiveTotal.value / pageSize)));
    innerCurrent.value = safeCurrent;
    innerPageSize.value = pageSize;

    emit('update:current', safeCurrent);
    emit('update:pageSize', pageSize);
    emit('pageChange', {
      current: safeCurrent,
      pageSize,
    });
  }

  function handlePageSizeChange(event: Event) {
    const nextPageSize = Number((event.target as HTMLSelectElement).value);
    emitPageChange(1, nextPageSize);
  }

  function handleJump() {
    const targetPage = Number(jumpPage.value);
    if (!Number.isFinite(targetPage) || targetPage < 1) {
      jumpPage.value = '';
      return;
    }
    emitPageChange(targetPage);
    jumpPage.value = '';
  }

  return {
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
  };
}

