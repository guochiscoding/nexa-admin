import { computed, h, ref, watch, type ComputedRef, type Slots } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';

import IconFont from '../IconFont';

import { OverflowTooltipCell } from './OverflowTooltipCell';
import type { AntdTableColumn, ColumnWidth, HeaderGroup, SelectableTableColumn } from './types';

type TableRow = Record<string, unknown>;

interface TableColumnsProps {
  columns: SelectableTableColumn[];
  dragHandleColumnWidth: ColumnWidth;
  expandColumnWidth: ColumnWidth;
  rowDraggable: boolean;
  scrollX?: number | string;
  scrollY?: number | string;
  selectable: boolean;
}

const dragHandleColumnKey = '__rowDragHandle__';

const widthMap: Record<string, number> = {
  'col-xs': 72,
  'col-sm': 96,
  'col-md': 128,
  'col-lg': 160,
  'col-xl': 192,
  'col-2xl': 256,
  'col-3xl': 320,
};

export function useTableColumns(options: {
  canExpandRows: ComputedRef<boolean>;
  createExpandSlotProps: (record: TableRow, index?: number) => Record<string, unknown>;
  dragHandleLabel: ComputedRef<string>;
  handleDragEnd: () => void;
  handleDragStart: (event: DragEvent, record: TableRow) => void;
  props: TableColumnsProps;
  slots: Slots;
}) {
  const {
    canExpandRows,
    createExpandSlotProps,
    dragHandleLabel,
    handleDragEnd,
    handleDragStart,
    props,
    slots,
  } = options;
  const columnWidthMap = ref<Record<string, number>>({});

  watch(() => props.columns, (cols) => {
    const nextMap: Record<string, number> = { ...columnWidthMap.value };
    cols.forEach((col) => {
      if (nextMap[col.key] === undefined) {
        nextMap[col.key] = getInitialColumnWidth(col);
      }
    });
    columnWidthMap.value = nextMap;
  }, { immediate: true, deep: true });

  const tableScrollX = computed(() => {
    const expandWidth = canExpandRows.value ? getExpandColumnWidth() : 0;
    const selectionWidth = props.selectable ? 48 : 0;
    const dragHandleWidth = props.rowDraggable ? getDragHandleColumnWidth() : 0;
    return props.columns.reduce((total, column) => total + getColumnScrollWidth(column), expandWidth + selectionWidth + dragHandleWidth);
  });

  const tableScroll = computed(() => ({
    x: props.scrollX ?? 'max(100%, var(--table-scroll-x))',
    ...(props.scrollY === undefined ? {} : { y: props.scrollY }),
  }));

  const tableScrollXStyle = computed(() => `${tableScrollX.value}px`);

  const tableColumns = computed<TableColumnsType<TableRow>>(() => {
    if (!props.columns.some(isGroupedColumn)) {
      return withDragHandleColumn(props.columns.map((column, index) => toAntdColumn(column, index, index === props.columns.length - 1)));
    }

    const lastColKey = props.columns[props.columns.length - 1]?.key;
    const columns: TableColumnsType<TableRow> = [];
    let currentGroup: HeaderGroup | undefined;

    const flushGroup = () => {
      if (!currentGroup) {
        return;
      }

      columns.push({
        title: currentGroup.title,
        key: currentGroup.key,
        className: ['group-header-cell', currentGroup.headerClass].filter(Boolean).join(' '),
        customHeaderCell: () => ({ class: 'group-header-cell', style: { textAlign: 'center' } }),
        children: currentGroup.children.map(({ column, index }) => toAntdColumn(column, index, column.key === lastColKey)),
      });
      currentGroup = undefined;
    };

    props.columns.forEach((column, index) => {
      if (!isGroupedColumn(column)) {
        flushGroup();
        columns.push(toAntdColumn(column, index, column.key === lastColKey));
        return;
      }

      const key = column.group ?? column.key;
      const title = column.groupTitle ?? column.group ?? column.title;
      const accent = column.groupAccent ?? 'default';
      const headerClass = column.groupHeaderClass ?? `group-accent-${accent}`;

      if (
        currentGroup
        && currentGroup.key === key
        && currentGroup.title === title
        && currentGroup.accent === accent
        && currentGroup.headerClass === headerClass
      ) {
        currentGroup.children.push({ column, index });
        return;
      }

      flushGroup();
      currentGroup = {
        key,
        title,
        accent,
        headerClass,
        children: [{ column, index }],
      };
    });

    flushGroup();

    return withDragHandleColumn(columns);
  });

  function isGroupedColumn(column: SelectableTableColumn) {
    return Boolean(column.group || column.groupTitle);
  }

  function getColumnWidth(column: SelectableTableColumn): ColumnWidth {
    return columnWidthMap.value[column.key] ?? column.width ?? getInitialColumnWidth(column);
  }

  function getColumnScrollWidth(column: SelectableTableColumn): number {
    return columnWidthMap.value[column.key] ?? getInitialColumnWidth(column);
  }

  function getDragHandleColumnWidth(): number {
    return parseColumnWidth(props.dragHandleColumnWidth) ?? 48;
  }

  function getExpandColumnWidth(): number {
    return parseColumnWidth(props.expandColumnWidth) ?? 48;
  }

  function getInitialColumnWidth(column: SelectableTableColumn): number {
    if (typeof column.width === 'string' && column.width.trim().endsWith('%')) {
      return column.minWidth ?? 50;
    }

    const configuredWidth = parseColumnWidth(column.width);
    const resolvedWidth = configuredWidth ?? widthMap[column.widthClass ?? ''] ?? 128;

    return Math.max(column.minWidth ?? 50, resolvedWidth);
  }

  function parseColumnWidth(width: ColumnWidth | undefined): number | undefined {
    if (typeof width === 'number') {
      return Number.isFinite(width) ? width : undefined;
    }

    if (typeof width !== 'string') {
      return undefined;
    }

    const value = Number.parseFloat(width);

    return width.trim().endsWith('px') && Number.isFinite(value) ? value : undefined;
  }

  function resolveCellClass(column: SelectableTableColumn, record: TableRow, index: number) {
    const customClass = typeof column.cellClass === 'function' ? column.cellClass(record, index) : column.cellClass;
    const alignClass = `align-${column.align ?? 'left'}`;
    const isEllipsis = column.ellipsis || column.textMode === 'ellipsis';
    const modeClass = isEllipsis ? 'cell-ellipsis' : 'cell-wrap';

    return [alignClass, modeClass, customClass].filter(Boolean).join(' ');
  }

  function resolveHeaderClass(column: SelectableTableColumn, index: number) {
    const customClass = typeof column.headerClass === 'function' ? column.headerClass(column, index) : column.headerClass;

    return [`align-${column.align ?? 'left'}`, customClass].filter(Boolean).join(' ');
  }

  function withDragHandleColumn(columns: TableColumnsType<TableRow>): TableColumnsType<TableRow> {
    if (!props.rowDraggable) {
      return columns;
    }

    return [createDragHandleColumn(), ...columns];
  }

  function createDragHandleColumn(): AntdTableColumn {
    return {
      key: dragHandleColumnKey,
      dataIndex: dragHandleColumnKey,
      title: () => h(IconFont, { type: 'icon-icon-drag-handle', class: 'drag-handle-header-icon', 'aria-hidden': 'true' }),
      width: getDragHandleColumnWidth(),
      minWidth: getDragHandleColumnWidth(),
      resizable: false,
      fixed: 'left',
      align: 'center',
      className: 'drag-handle-cell',
      customHeaderCell: () => ({ class: 'drag-handle-header-cell' }),
      customCell: () => ({ class: 'drag-handle-cell' }),
      customRender: ({ record }) => h(
        'button',
        {
          class: 'row-drag-handle',
          type: 'button',
          draggable: true,
          'aria-label': dragHandleLabel.value,
          onDragstart: (event: DragEvent) => handleDragStart(event, record),
          onDragend: handleDragEnd,
        },
        [h(IconFont, { type: 'icon-icon-drag-handle', 'aria-hidden': 'true' })],
      ),
    };
  }

  function toAntdColumn(column: SelectableTableColumn, index: number, isLast = false): AntdTableColumn {
    const isEllipsis = Boolean(column.ellipsis || column.textMode === 'ellipsis');
    const showOverflowTooltip = Boolean(column.tooltip || isEllipsis);

    return {
      key: column.key,
      dataIndex: column.key,
      title: column.required ? () => h('span', { class: 'selectable-table-header-title' }, [
        h('span', { class: 'selectable-table-header-required-mark', 'aria-hidden': 'true' }, '*'),
        column.title,
      ]) : column.title,
      width: getColumnWidth(column),
      minWidth: column.minWidth ?? 50,
      resizable: !isLast,
      align: column.align ?? 'left',
      ellipsis: isEllipsis,
      fixed: column.fixed,
      className: resolveCellClass(column, {}, index),
      customHeaderCell: () => ({ class: resolveHeaderClass(column, index) }),
      customCell: (record: TableRow, rowIndex?: number) => ({ class: resolveCellClass(column, record, rowIndex ?? 0) }),
      customRender: ({ record, value, index: rowIndex }) => {
        const slot = slots[`cell-${column.key}`];
        const contentClass = isEllipsis ? 'cell-text-ellipsis' : 'cell-text-wrap';
        const text = value == null ? '–' : String(value);
        const expandSlotProps = createExpandSlotProps(record, rowIndex);
        const content = slot ? slot({ record, value, ...expandSlotProps }) : text;

        if (showOverflowTooltip) {
          return h(OverflowTooltipCell, { contentClass, text }, { default: () => content });
        }

        if (slot) {
          return h('div', { class: contentClass }, [content]);
        }

        return h('span', { class: contentClass }, text);
      },
    };
  }

  function handleResizeColumn(width: number, column: AntdTableColumn) {
    const key = column.key;
    if (typeof key !== 'string') {
      return;
    }

    const matchedCol = props.columns.find((c) => c.key === key);
    const min = matchedCol?.minWidth ?? 50;

    columnWidthMap.value = {
      ...columnWidthMap.value,
      [key]: Math.max(min, width),
    };
  }

  return {
    getExpandColumnWidth,
    handleResizeColumn,
    tableColumns,
    tableScroll,
    tableScrollXStyle,
  };
}

