import type { TableColumnsType } from 'ant-design-vue';

export type RowKey = string | number;
export type Align = 'left' | 'center' | 'right';
export type HeaderAccent = 'default' | 'success' | 'none';
export type CellClass = string | ((record: Record<string, unknown>, index: number) => string);
export type HeaderClass = string | ((column: SelectableTableColumn, index: number) => string);
export type Fixed = 'left' | 'right';
export type TextMode = 'wrap' | 'ellipsis';
export type RowClassName = string | ((record: Record<string, unknown>, index: number) => string);
export type ColumnWidth = number | `${number}px` | `${number}%`;
export type DragInsertPosition = 'before' | 'after';
export type DropAnimationDirection = 'up' | 'down';
export type AntdTableColumn = TableColumnsType<Record<string, unknown>>[number];
export type RowExpandable = (record: Record<string, unknown>) => boolean;

export interface SelectableTableColumn {
  key: string;
  title: string;
  /** 表头必填标记；仅把星号渲染为系统错误色，不改变标题文案颜色。 */
  required?: boolean;
  width?: ColumnWidth;
  widthClass?: string;
  minWidth?: number;
  align?: Align;
  fixed?: Fixed;
  ellipsis?: boolean;
  tooltip?: boolean;
  textMode?: TextMode;
  group?: string;
  groupTitle?: string;
  groupAccent?: HeaderAccent;
  groupHeaderClass?: string;
  headerClass?: HeaderClass;
  cellClass?: CellClass;
}

export interface HeaderGroup {
  key: string;
  title: string;
  accent: HeaderAccent;
  headerClass?: string;
  children: Array<{
    column: SelectableTableColumn;
    index: number;
  }>;
}

export interface ExpandIconRenderProps {
  expanded: boolean;
  expandable: boolean;
  record: Record<string, unknown>;
  onExpand: (record: Record<string, unknown>, event: MouseEvent) => void;
}

export interface SelectActionPayload<T extends Record<string, unknown>> {
  action: 'selectAll' | 'invert' | 'header' | 'row';
  selectedRowKeys: RowKey[];
  selectedRows: T[];
  currentPageRows: T[];
}

export interface PageChangePayload {
  current: number;
  pageSize: number;
}

export interface RowDragSortPayload<T extends Record<string, unknown>> {
  sourceIndex: number;
  targetIndex: number;
  insertIndex: number;
  insertPosition: DragInsertPosition;
  sourceRow: T;
  targetRow: T;
  dataSource: T[];
  currentPageRows: T[];
}

