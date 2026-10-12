import { computed, h, ref, watch, type Slots } from 'vue';

import IconFont from '../IconFont';

import type { ExpandIconRenderProps, RowExpandable, RowKey } from './types';

type TableRow = Record<string, unknown>;

interface ExpandableRowsProps {
  defaultExpandedRowKeys: RowKey[];
  expandable: boolean;
  expandedRowKeys?: RowKey[];
  rowExpandable?: RowExpandable;
}

type ExpandableRowsEmit = {
  (event: 'update:expandedRowKeys', keys: RowKey[]): void;
};

export function useExpandableRows(options: {
  emit: ExpandableRowsEmit;
  getRecordKey: (record: TableRow) => RowKey;
  props: ExpandableRowsProps;
  slots: Slots;
  t: (key: string) => string;
}) {
  const { emit, getRecordKey, props, slots, t } = options;
  const innerExpandedRowKeys = ref<RowKey[]>(props.expandedRowKeys ?? props.defaultExpandedRowKeys);
  const canExpandRows = computed(() => props.expandable && Boolean(slots['expanded-row']));
  const effectiveExpandedRowKeys = computed(() => props.expandedRowKeys ?? innerExpandedRowKeys.value);

  watch(() => props.expandedRowKeys, (keys) => {
    if (keys) {
      innerExpandedRowKeys.value = keys;
    }
  });

  function isRecordExpandable(record: TableRow) {
    return canExpandRows.value && (props.rowExpandable ? props.rowExpandable(record) : true);
  }

  function isRowKeyExpanded(rowKey: RowKey) {
    return effectiveExpandedRowKeys.value.includes(rowKey);
  }

  function isRecordExpanded(record: TableRow) {
    return isRowKeyExpanded(getRecordKey(record));
  }

  function updateExpandedRowKeys(keys: RowKey[]) {
    const normalizedKeys = Array.from(new Set(keys));

    if (props.expandedRowKeys === undefined) {
      innerExpandedRowKeys.value = normalizedKeys;
    }

    emit('update:expandedRowKeys', normalizedKeys);
  }

  function setRecordExpanded(record: TableRow, expanded: boolean) {
    if (!isRecordExpandable(record)) {
      return;
    }

    const key = getRecordKey(record);
    const keySet = new Set(effectiveExpandedRowKeys.value);

    if (expanded) {
      keySet.add(key);
    } else {
      keySet.delete(key);
    }

    updateExpandedRowKeys(Array.from(keySet));
  }

  function toggleRecordExpanded(record: TableRow) {
    setRecordExpanded(record, !isRecordExpanded(record));
  }

  function handleExpandedRowKeysUpdate(keys: RowKey[]) {
    updateExpandedRowKeys(keys);
  }

  function createExpandSlotProps(record: TableRow, index = 0) {
    const expanded = isRecordExpanded(record);

    return {
      index,
      expanded,
      toggleExpanded: () => toggleRecordExpanded(record),
      setExpanded: (nextExpanded: boolean) => setRecordExpanded(record, nextExpanded),
    };
  }

  function renderExpandedRow({ record, index, expanded }: { record: TableRow; index: number; expanded: boolean }) {
    const slot = slots['expanded-row'];

    if (!slot) {
      return null;
    }

    return h('div', { class: 'selectable-table-expanded-content' }, slot({
      record,
      index,
      expanded,
      toggleExpanded: () => toggleRecordExpanded(record),
      setExpanded: (nextExpanded: boolean) => setRecordExpanded(record, nextExpanded),
    }));
  }

  function renderExpandIcon({ expanded, expandable, record, onExpand }: ExpandIconRenderProps) {
    if (!expandable) {
      return h('span', { class: 'selectable-table-expand-placeholder', 'aria-hidden': 'true' });
    }

    return h(
      'button',
      {
        class: ['selectable-table-expand-toggle', expanded ? 'is-expanded' : ''].filter(Boolean).join(' '),
        type: 'button',
        'aria-expanded': expanded,
        'aria-label': expanded ? t('table.collapseRow') : t('table.expandRow'),
        onClick: (event: MouseEvent) => onExpand(record, event),
      },
      [h(IconFont, { type: expanded ? 'icon-icon-chevron-up-circle' : 'icon-icon-chevron-down-circle', 'aria-hidden': 'true' })],
    );
  }

  function resolveExpandedRowClassName() {
    return 'selectable-table-expanded-row';
  }

  return {
    canExpandRows,
    createExpandSlotProps,
    effectiveExpandedRowKeys,
    handleExpandedRowKeysUpdate,
    isRecordExpandable,
    isRecordExpanded,
    renderExpandIcon,
    renderExpandedRow,
    resolveExpandedRowClassName,
  };
}

