<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/Button.vue';
import DetailInfoTable from '@/components/DetailInfoTable.vue';
import type { DetailInfoItem } from '@/components/DetailInfoTable.vue';
import Input from '@/components/Input.vue';
import Select, { type SelectOptionItem } from '@/components/Select.vue';
import SelectableDataTable from '@/components/SelectableDataTable.vue';
import type { RowDragSortPayload } from '@/components/SelectableDataTable.vue';
import SecondaryPageLayout from '@/layouts/SecondaryPageLayout.vue';

type RowKey = string | number;
type Align = 'left' | 'center' | 'right';
type EditableField = 'owner' | 'priority' | 'status';
type TableColumnWidth = number | `${number}px`;

interface TableColumn {
  key: string;
  title: string;
  width?: TableColumnWidth;
  widthClass?: string;
  align?: Align;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  group?: string;
  groupTitle?: string;
  groupAccent?: 'default' | 'success' | 'none';
}

interface WorkflowRow extends Record<string, unknown> {
  id: string;
  name: string;
  trigger: string;
  priority: string;
  priorityTone: 'danger' | 'warning' | 'success';
  owner: string;
  status: string;
  statusTone: 'danger' | 'processing' | 'success' | 'warning';
  detail: string;
}

interface SortableRow extends Record<string, unknown> {
  id: number;
  sort: number;
  name: string;
  category: string;
  updatedAt: string;
}

interface EditableRow extends Record<string, unknown> {
  id: string;
  owner: string;
  priority: string;
  status: string;
  task: string;
}

const { t } = useI18n();
const breadcrumbs = computed(() => [{ title: t('menu.tableExample') }]);
const expandedKeys = ref<RowKey[]>(['flow-1']);
const selectedOrderKeys = ref<RowKey[]>([]);
const current = ref(1);
const pageSize = ref(10);
const feedback = ref(t('tableExample.feedback.ready'));
const editingId = ref<string>();
const editableDraft = ref<EditableRow | null>(null);

const workflowColumns = computed<TableColumn[]>(() => [
  { key: 'name', title: t('tableExample.workflow.columns.name'), width: 280, fixed: 'left' },
  { key: 'trigger', title: t('tableExample.workflow.columns.trigger'), width: 240 },
  { key: 'priority', title: t('tableExample.workflow.columns.priority'), width: 120, align: 'center' },
  { key: 'owner', title: t('tableExample.workflow.columns.owner'), width: 180 },
  { key: 'status', title: t('tableExample.workflow.columns.status'), width: 140, align: 'center' },
  { key: 'actions', title: t('tableExample.workflow.columns.actions'), width: 160, fixed: 'right', align: 'center' },
]);

const workflowRows = computed<WorkflowRow[]>(() => [
  {
    id: 'flow-1',
    name: t('tableExample.workflow.rows.onboarding.name'),
    trigger: t('tableExample.workflow.rows.onboarding.trigger'),
    priority: t('tableExample.priorities.high'),
    priorityTone: 'danger',
    owner: 'Avery Stone',
    status: t('tableExample.statuses.running'),
    statusTone: 'processing',
    detail: t('tableExample.workflow.rows.onboarding.detail'),
  },
  {
    id: 'flow-2',
    name: t('tableExample.workflow.rows.billing.name'),
    trigger: t('tableExample.workflow.rows.billing.trigger'),
    priority: t('tableExample.priorities.medium'),
    priorityTone: 'warning',
    owner: 'Mina Chen',
    status: t('tableExample.statuses.paused'),
    statusTone: 'warning',
    detail: t('tableExample.workflow.rows.billing.detail'),
  },
  {
    id: 'flow-3',
    name: t('tableExample.workflow.rows.reporting.name'),
    trigger: t('tableExample.workflow.rows.reporting.trigger'),
    priority: t('tableExample.priorities.low'),
    priorityTone: 'success',
    owner: 'Noah Smith',
    status: t('tableExample.statuses.completed'),
    statusTone: 'success',
    detail: t('tableExample.workflow.rows.reporting.detail'),
  },
]);

const sortableColumns = computed<TableColumn[]>(() => [
  { key: 'sort', title: t('tableExample.sortable.columns.sort'), width: 80 },
  { key: 'name', title: t('tableExample.sortable.columns.name'), width: 260 },
  { key: 'category', title: t('tableExample.sortable.columns.category'), width: 180 },
  { key: 'updatedAt', title: t('tableExample.sortable.columns.updatedAt'), width: 220 },
]);

const sortableRows = ref<SortableRow[]>([
  { id: 1, sort: 1, name: 'Revenue overview', category: 'Dashboard', updatedAt: '2026-10-10 09:30:00' },
  { id: 2, sort: 2, name: 'User activation', category: 'Metric', updatedAt: '2026-10-10 10:12:00' },
  { id: 3, sort: 3, name: 'Support queue', category: 'Operations', updatedAt: '2026-10-10 11:45:00' },
  { id: 4, sort: 4, name: 'System health', category: 'Monitoring', updatedAt: '2026-10-10 13:20:00' },
]);

const sortableTableRows = computed<Record<string, unknown>[]>({
  get: () => sortableRows.value,
  set: (rows) => {
    sortableRows.value = rows.map((row, index) => ({
      ...(row as SortableRow),
      sort: index + 1,
    }));
  },
});

const editableColumns = computed<TableColumn[]>(() => [
  { key: 'task', title: t('tableExample.editable.columns.task'), width: 280, fixed: 'left' },
  { key: 'owner', title: t('tableExample.editable.columns.owner'), width: 180 },
  { key: 'priority', title: t('tableExample.editable.columns.priority'), width: 160 },
  { key: 'status', title: t('tableExample.editable.columns.status'), width: 160 },
  { key: 'actions', title: t('tableExample.editable.columns.actions'), width: 180, fixed: 'right' },
]);

const editableRows = ref<EditableRow[]>([
  { id: 'task-1', task: 'Prepare release notes', owner: 'Avery Stone', priority: 'High', status: 'In progress' },
  { id: 'task-2', task: 'Review access policy', owner: 'Mina Chen', priority: 'Medium', status: 'Pending' },
  { id: 'task-3', task: 'Update onboarding checklist', owner: 'Noah Smith', priority: 'Low', status: 'Completed' },
]);

const editableTableRows = computed<Record<string, unknown>[]>(() => editableRows.value);

const ownerOptions: SelectOptionItem[] = [
  { label: 'Avery Stone', value: 'Avery Stone' },
  { label: 'Mina Chen', value: 'Mina Chen' },
  { label: 'Noah Smith', value: 'Noah Smith' },
];
const priorityOptions: SelectOptionItem[] = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const orderColumns = computed<TableColumn[]>(() => [
  { key: 'orderNo', title: t('tableExample.orders.columns.orderNo'), width: 160, fixed: 'left', group: 'order', groupTitle: t('tableExample.orders.groups.order') },
  { key: 'customer', title: t('tableExample.orders.columns.customer'), width: 180, group: 'order', groupTitle: t('tableExample.orders.groups.order') },
  { key: 'plan', title: t('tableExample.orders.columns.plan'), width: 160, group: 'order', groupTitle: t('tableExample.orders.groups.order') },
  { key: 'amount', title: t('tableExample.orders.columns.amount'), width: 140, group: 'metrics', groupTitle: t('tableExample.orders.groups.metrics'), groupAccent: 'success' },
  { key: 'progress', title: t('tableExample.orders.columns.progress'), width: 140, group: 'metrics', groupTitle: t('tableExample.orders.groups.metrics'), groupAccent: 'success' },
  { key: 'status', title: t('tableExample.orders.columns.status'), width: 140, fixed: 'right' },
  { key: 'actions', title: t('tableExample.orders.columns.actions'), width: 140, fixed: 'right' },
]);

const orderRows = Array.from({ length: 26 }, (_, index) => ({
  id: index + 1,
  orderNo: `NX-${String(index + 1001)}`,
  customer: ['Acme Corp', 'Northwind', 'Globex', 'Initech'][index % 4],
  plan: ['Starter', 'Growth', 'Enterprise'][index % 3],
  amount: `$${(index + 3) * 120}`,
  progress: `${64 + (index % 5) * 7}%`,
  status: index % 5 === 0 ? t('tableExample.statuses.paused') : t('tableExample.statuses.running'),
  statusTone: index % 5 === 0 ? 'warning' : 'processing',
}));

const detailItems = computed<DetailInfoItem[]>(() => [
  { key: 'workspace', label: t('tableExample.detail.workspace'), value: 'Nexa Admin' },
  { key: 'owner', label: t('tableExample.detail.owner'), value: 'Demo Team' },
  { key: 'activeUsers', label: t('tableExample.detail.activeUsers'), value: '128', tone: 'success' },
  { key: 'pendingTasks', label: t('tableExample.detail.pendingTasks'), value: '12', tone: 'danger' },
]);

function getValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return value === undefined || value === null || value === '' ? '--' : String(value);
}

function getToneClass(record: Record<string, unknown>, key: string, fallback = 'processing') {
  return `status-chip status-${String(record[key] ?? fallback)}`;
}

function startEdit(record: Record<string, unknown>) {
  const row = record as EditableRow;
  editingId.value = row.id;
  editableDraft.value = { ...row };
}

function updateDraft(field: EditableField, value: string | number | (string | number)[] | undefined) {
  if (!editableDraft.value) return;
  editableDraft.value[field] = Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
}

function saveEdit() {
  if (!editableDraft.value) return;
  editableRows.value = editableRows.value.map((row) => row.id === editableDraft.value?.id ? { ...editableDraft.value } : row);
  feedback.value = t('tableExample.feedback.saved', { name: editableDraft.value.task });
  editingId.value = undefined;
  editableDraft.value = null;
}

function cancelEdit() {
  editingId.value = undefined;
  editableDraft.value = null;
  feedback.value = t('tableExample.feedback.canceled');
}

function handleRowDragSort(payload: RowDragSortPayload<Record<string, unknown>>) {
  sortableTableRows.value = payload.dataSource;
  feedback.value = t('tableExample.feedback.sorted', { name: getValue(payload.sourceRow, 'name') });
}

function handlePageChange(payload: { current: number; pageSize: number }) {
  current.value = payload.current;
  pageSize.value = payload.pageSize;
}
</script>

<template>
  <SecondaryPageLayout :breadcrumbs="breadcrumbs" :show-back="false">
    <div class="table-example-page">
      <section class="demo-section">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">
              Expandable
            </p>
            <h2 class="section-title">
              {{ t('tableExample.workflow.title') }}
            </h2>
          </div>
        </div>
        <SelectableDataTable
          v-model:expanded-row-keys="expandedKeys"
          :columns="workflowColumns"
          :data-source="workflowRows"
          :page-size="workflowRows.length"
          :show-footer="false"
          :show-selection-actions="false"
          :total="workflowRows.length"
          expandable
        >
          <template #cell-priority="{ record, value }">
            <span :class="getToneClass(record, 'priorityTone', 'success')">
              {{ value }}
            </span>
          </template>
          <template #cell-status="{ record, value }">
            <span :class="getToneClass(record, 'statusTone')">
              {{ value }}
            </span>
          </template>
          <template #cell-actions="{ expanded, toggleExpanded }">
            <button class="table-link" type="button" @click="toggleExpanded">
              {{ expanded ? t('common.collapse') : t('common.expand') }}
            </button>
          </template>
          <template #expanded-row="{ record }">
            <p class="expanded-copy">
              {{ getValue(record, 'detail') }}
            </p>
          </template>
        </SelectableDataTable>
      </section>

      <section class="demo-section">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">
              Drag Sort
            </p>
            <h2 class="section-title">
              {{ t('tableExample.sortable.title') }}
            </h2>
          </div>
          <p class="feedback-text">
            {{ feedback }}
          </p>
        </div>
        <SelectableDataTable
          :columns="sortableColumns"
          :data-source="sortableTableRows"
          :page-size="sortableRows.length"
          :show-footer="false"
          :show-selection-actions="false"
          :total="sortableRows.length"
          row-draggable
          @row-drag-sort="handleRowDragSort"
        />
      </section>

      <section class="demo-section">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">
              Detail Info
            </p>
            <h2 class="section-title">
              {{ t('tableExample.detail.title') }}
            </h2>
          </div>
        </div>
        <DetailInfoTable :items="detailItems" />
      </section>

      <section class="demo-section">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">
              Editable
            </p>
            <h2 class="section-title">
              {{ t('tableExample.editable.title') }}
            </h2>
          </div>
        </div>
        <SelectableDataTable
          :columns="editableColumns"
          :data-source="editableTableRows"
          :page-size="editableRows.length"
          :show-footer="false"
          :show-selection-actions="false"
          :total="editableRows.length"
        >
          <template #cell-owner="{ record, value }">
            <Select
              v-if="editingId === record.id"
              :model-value="editableDraft?.owner"
              :options="ownerOptions"
              width="100%"
              @change="(nextValue) => updateDraft('owner', nextValue)"
            />
            <span v-else>{{ value }}</span>
          </template>
          <template #cell-priority="{ record, value }">
            <Select
              v-if="editingId === record.id"
              :model-value="editableDraft?.priority"
              :options="priorityOptions"
              width="100%"
              @change="(nextValue) => updateDraft('priority', nextValue)"
            />
            <span v-else>{{ value }}</span>
          </template>
          <template #cell-status="{ record, value }">
            <Input
              v-if="editingId === record.id"
              :model-value="editableDraft?.status"
              width="100%"
              @input="(nextValue) => updateDraft('status', nextValue)"
            />
            <span v-else>{{ value }}</span>
          </template>
          <template #cell-actions="{ record }">
            <div v-if="editingId === record.id" class="table-actions">
              <Button
                type="text"
                color-type="blue"
                size="small"
                @click="saveEdit"
              >
                {{ t('common.save') }}
              </Button>
              <Button
                type="text"
                color-type="red"
                size="small"
                @click="cancelEdit"
              >
                {{ t('common.cancel') }}
              </Button>
            </div>
            <Button
              v-else
              type="text"
              color-type="blue"
              size="small"
              @click="startEdit(record)"
            >
              {{ t('common.edit') }}
            </Button>
          </template>
        </SelectableDataTable>
      </section>

      <section class="demo-section">
        <div class="section-heading">
          <div>
            <p class="section-eyebrow">
              Grouped Header
            </p>
            <h2 class="section-title">
              {{ t('tableExample.orders.title') }}
            </h2>
          </div>
        </div>
        <SelectableDataTable
          v-model:current="current"
          v-model:page-size="pageSize"
          v-model:selected-row-keys="selectedOrderKeys"
          :columns="orderColumns"
          :data-source="orderRows"
          :total="orderRows.length"
          selectable
          @page-change="handlePageChange"
        >
          <template #cell-status="{ record, value }">
            <span :class="getToneClass(record, 'statusTone')">
              {{ value }}
            </span>
          </template>
          <template #cell-actions="{ record }">
            <button class="table-link" type="button" @click="feedback = t('tableExample.feedback.viewed', { name: getValue(record, 'orderNo') })">
              {{ t('tableExample.orders.view') }}
            </button>
          </template>
        </SelectableDataTable>
      </section>
    </div>
  </SecondaryPageLayout>
</template>

<style scoped>
@reference "../styles/index.css";

.table-example-page { @apply flex w-full min-w-0 flex-col gap-6 bg-color-container; }
.demo-section { @apply w-full min-w-0 rounded border border-component-border bg-container p-5 shadow-td-shadow-0; }
.demo-section :deep(.selectable-data-table) { @apply w-full min-w-0; }
.demo-section :deep(.ant-table-wrapper) { @apply w-full min-w-0; }
.section-heading { @apply mb-4 flex items-center justify-between gap-4; }
.section-eyebrow { @apply mb-1 text-body-small font-semibold uppercase tracking-wide text-font-blue-link; }
.section-title { @apply m-0 text-title-small font-semibold text-font-black-gy1; }
.feedback-text { @apply rounded bg-color-secondarycontainer px-3 py-1 text-body-small text-font-black-gy2; }
.table-link { @apply cursor-pointer border-0 bg-transparent p-0 text-body-medium text-font-blue-link; }
.table-actions { @apply flex items-center gap-4; }
.expanded-copy { @apply m-0 text-body-medium text-font-black-gy2; }
.status-chip { @apply inline-flex h-6 min-w-6 items-center justify-center rounded px-2 text-body-medium font-medium; }
.status-danger { @apply bg-error-light text-error-color; }
.status-warning { @apply bg-warning-light text-warning-color; }
.status-success { @apply bg-success-light text-success-color; }
.status-processing { @apply bg-brand-blue-light text-font-blue-link; }
</style>
