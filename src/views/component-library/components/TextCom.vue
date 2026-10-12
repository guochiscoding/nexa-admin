<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Col as ACol,
  Form as AForm,
  FormItem as AFormItem,
  Row as ARow
} from 'ant-design-vue';

import Button from '@/components/Button.vue';
import SearchInput from '@/components/SearchInput.vue';
import Input from '@/components/Input.vue';
import LabelInput from '@/components/LabelInput.vue';
import LabelFuzzyInput from '@/components/LabelFuzzyInput.vue';
import LabelSelect from '@/components/LabelSelect.vue';
import Modal from '@/components/Modal.vue';
import Select, { type SelectOptionItem } from '@/components/Select.vue';
import Status from '@/components/Status.vue';
import Textarea from '@/components/Textarea.vue';
import Completeness from '@/components/Completeness.vue';
import Tag from '@/components/Tag.vue';
import FuzzyInput, { type FuzzyOption } from '@/components/FuzzyInput.vue';

const { t } = useI18n();
const searchKeyword = ref('');
const basicKeyword = ref('');
const basicTextarea = ref('');
const limitedTextarea = ref('');
const limitedInput = ref('');
const labelKeyword = ref('');
const labelFuzzyKeyword = ref<string>();
const labelSelectedValue = ref<string | number | (string | number)[] | undefined>('all');
const selectedValue = ref<string>();
const selectedValues = ref<string[]>([]);
const modalOpen = ref(false);
const keyword = ref<string>();

const options = computed<SelectOptionItem[]>(() => [
  { label: t('componentExamples.forms.options.all'), value: 'all' },
  { label: t('componentExamples.forms.options.dashboard'), value: 'dashboard' },
  { label: t('componentExamples.forms.options.users'), value: 'users' },
  { label: t('componentExamples.forms.options.settings'), value: 'settings' },
  { label: t('componentExamples.forms.options.disabled'), value: 'disabled', disabled: true },
]);

const statuses = computed(() => [
  { key: 'failed', text: t('componentExamples.forms.statuses.failed') },
  { key: 'processing', text: t('componentExamples.forms.statuses.processing') },
  { key: 'pending', text: t('componentExamples.forms.statuses.pending') },
  { key: 'enabled', text: t('componentExamples.forms.statuses.enabled') },
  { key: 'disabled', text: t('componentExamples.forms.statuses.disabled') },
  { key: 'completed', text: t('componentExamples.forms.statuses.completed') },
  { key: 'queued', text: t('componentExamples.forms.statuses.queued') },
  { key: 'draft', text: t('componentExamples.forms.statuses.draft') },
  { key: 'notStarted', text: t('componentExamples.forms.statuses.notStarted') },
  { key: 'normal', text: t('componentExamples.forms.statuses.normal') },
]);
const CompletenessList = [
  { status: '0', text: '0%' },
  { status: 'half', text: '50%' },
  { status: 'full', text: '100%' },
];
const TagList = computed(() => [
  { key: 'critical', text: t('componentExamples.forms.tags.critical'), className: 'tag-demo-error' },
  { key: 'warning', text: t('componentExamples.forms.tags.warning'), className: 'tag-demo-warning' },
  { key: 'normal', text: t('componentExamples.forms.tags.normal'), className: 'tag-demo-blue' },
  { key: 'completed', text: t('componentExamples.forms.tags.completed'), className: 'tag-demo-success' },
  { key: 'muted', text: t('componentExamples.forms.tags.critical'), className: 'tag-demo-muted' },
  { key: 'recommended', text: t('componentExamples.forms.tags.recommended'), className: 'tag-demo-blue is-borderless', bordered: false },
  { key: 'beta', text: t('componentExamples.forms.tags.beta'), className: 'tag-demo-blue is-borderless', bordered: false },
  { key: 'stable', text: t('componentExamples.forms.tags.stable'), className: 'tag-demo-success is-borderless', bordered: false },
]);

function handleBasicInput(value: string) {
  basicKeyword.value = value;
  console.log('input:', value);
}

function handleTextareaInput(value: string) {
  console.log('textarea:', value);
}

function handleSelectChange(
  value: string | number | (string | number)[] | undefined,
  selectedOptions: SelectOptionItem[],
) {
  console.log('select:', value, selectedOptions);
}

function handleModalOk() {
  console.log('modal ok');
  modalOpen.value = false;
}

function handleModalCancel() {
  console.log('modal cancel');
}
async function fetchOptions(q: string): Promise<FuzzyOption[]> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 160);
  });

  const keyword = q.trim().toLowerCase();
  return options.value
    .filter((item) => !item.disabled && item.label.toLowerCase().includes(keyword))
    .map((item) => ({ value: String(item.value), label: item.label }));
}
</script>

<template>
  <div class="text-com-page">
    <h2 class="section-title">
      {{ t('componentExamples.forms.title') }}
    </h2>
    <AForm class="text-com-form" layout="vertical">
      <ARow :gutter="[2,2]">
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.searchInput')">
            <SearchInput
              v-model="searchKeyword"
              @search="(keyword) => console.log('search:', keyword)"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.input')">
            <Input
              v-model="basicKeyword"
              :placeholder="t('componentExamples.forms.placeholders.input')"
              @input="handleBasicInput"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.disabledInput')">
            <Input
              disabled
              :placeholder="t('componentExamples.forms.placeholders.disabled')"
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.fuzzyInput')">
            <FuzzyInput
              v-model="keyword"
              :placeholder="t('componentExamples.forms.placeholders.keyword')"
              width="240px"
              :fetch-options="fetchOptions"
              @change="(val, opt) => console.log(val, opt)"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.labelInput')">
            <LabelInput
              v-model="labelKeyword"
              :label="t('componentExamples.forms.category')"
              :placeholder="t('componentExamples.forms.placeholders.input')"
              @input="handleBasicInput"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.labelFuzzyInput')">
            <LabelFuzzyInput
              v-model="labelFuzzyKeyword"
              :label="t('componentExamples.forms.category')"
              :placeholder="t('componentExamples.forms.placeholders.keyword')"
              width="240px"
              :fetch-options="fetchOptions"
              @change="(val, opt) => console.log('label fuzzy:', val, opt)"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.labelSelect')">
            <LabelSelect
              v-model="labelSelectedValue"
              :label="t('componentExamples.forms.category')"
              :options="options"
              @change="handleSelectChange"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.disabledLabelSelect')">
            <LabelSelect
              :label="t('componentExamples.forms.category')"
              :options="options"
              disabled
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.select')">
            <Select
              v-model="selectedValue"
              :options="options"
              :placeholder="t('componentExamples.forms.placeholders.category')"
              @change="handleSelectChange"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.multiSelect')">
            <Select
              v-model="selectedValues"
              :options="options"
              mode="multiple"
              :placeholder="t('componentExamples.forms.placeholders.categories')"
              @change="handleSelectChange"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.disabledSelect')">
            <Select
              :options="options"
              :placeholder="t('componentExamples.forms.placeholders.select')"
              disabled
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.limitedInput')">
            <Textarea
              v-model="limitedInput"
              :max-length="20"
              type="input"
              :width="240"
              :placeholder="t('componentExamples.forms.placeholders.input')"
              @input="handleTextareaInput"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.modal')">
            <Button
              type="default"
              @click="modalOpen = true"
            >
              {{ t('componentExamples.forms.openModal') }}
            </Button>
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.textarea')">
            <Textarea
              v-model="basicTextarea"
              :placeholder="t('componentExamples.forms.placeholders.description')"
              :width="240"
              @input="handleTextareaInput"
            />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.forms.limitedTextarea')">
            <Textarea
              v-model="limitedTextarea"
              :height="140"
              :max-length="150"
              :width="240"
              :placeholder="t('componentExamples.forms.placeholders.remark')"
              @input="handleTextareaInput"
            />
          </AFormItem>
        </ACol>
      </ARow>
      <ARow :gutter="[2,2]">
        <ACol :xs="24">
          <AFormItem :label="t('componentExamples.forms.status')">
            <div class="demo-list">
              <Status
                v-for="status in statuses"
                :key="status.key"
                :status="status.key"
                :text="status.text"
              />
            </div>
          </AFormItem>
        </ACol>
      </ARow>
      <ARow :gutter="[2,2]">
        <ACol :xs="24">
          <AFormItem :label="t('componentExamples.forms.tag')">
            <div class="demo-list">
              <Tag
                v-for="i in TagList"
                :key="i.key"
                :class="i.className"
                :text="i.text"
                :bordered="i.bordered"
              />
            </div>
          </AFormItem>
        </ACol>
      </ARow>
      <ARow :gutter="[2,2]">
        <ACol :xs="24">
          <AFormItem :label="t('componentExamples.forms.completeness')">
            <div class="demo-list">
              <Completeness
                v-for="i in CompletenessList"
                :key="i.status"
                :level="i.status"
                :text="i.text"
              />
            </div>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>

    <Modal
      v-model:open="modalOpen"
      :title="t('componentExamples.forms.modalTitle')"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <div class="modal-demo-content">
        <p>{{ t('componentExamples.forms.modalContent') }}</p>
        <p>{{ t('componentExamples.forms.modalScrollHint') }}</p>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
@reference "../../../styles/index.css";

.text-com-page {
  @apply relative z-0 p-6;
}

.section-title {
  @apply mb-4 text-title-small text-font-black-gy1;
}

.text-com-form {
  @apply max-w-[1280px];
}

.demo-list {
  @apply flex flex-wrap items-center gap-x-6 gap-y-3;
}

.tag-demo-error {
  @apply !border-error-color !bg-error-light !text-error-color;
}

.tag-demo-warning {
  @apply !border-warning-color !bg-warning-light !text-warning-color;
}

.tag-demo-blue {
  @apply !border-brand-blue !bg-brand-blue-light !text-brand-blue;
}

.tag-demo-success {
  @apply !border-success-color !bg-success-light !text-success-color;
}

.tag-demo-muted {
  @apply !border-component-border !bg-color-secondarycontainer !text-font-black-gy1;
}

.is-borderless {
  @apply !border-transparent;
}

.modal-demo-content {
  @apply text-font-black-gy1;
}
</style>
