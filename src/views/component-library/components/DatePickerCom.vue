<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Col as ACol,
  Form as AForm,
  FormItem as AFormItem,
  Row as ARow,
} from 'ant-design-vue';

import DatePicker from '@/components/DatePicker.vue';
import RangePicker from '@/components/RangePicker.vue';
import LabelDatePicker from '@/components/LabelDatePicker.vue';
import LabelRangePicker from '@/components/LabelRangePicker.vue';

const { t } = useI18n();
const date = ref<string>();
const dateTime = ref<string>();
const dateRange = ref<[string, string]>();
const dateTimeRange = ref<[string, string]>();
</script>

<template>
  <div class="datepicker-com-page">
    <h2 class="section-title">
      {{ t('componentExamples.dates.title') }}
    </h2>
    <AForm class="datepicker-com-form" layout="vertical">
      <ARow :gutter="[16, 16]">
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.date')">
            <DatePicker class="picker-preview" allow-clear />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.dateTime')">
            <DatePicker class="picker-preview" show-time allow-clear />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.disabled')">
            <DatePicker class="picker-preview" value="2026-03-24" disabled />
          </AFormItem>
        </ACol>

        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.range')">
            <RangePicker class="picker-preview" allow-clear />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
    <h2 class="section-title">
      {{ t('componentExamples.dates.labeledTitle') }}
    </h2>
    <AForm class="datepicker-com-form" layout="vertical">
      <ARow :gutter="[16, 16]">
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.labelDatePicker')">
            <LabelDatePicker
              v-model:value="date"
              :label="t('componentExamples.dates.dateLabel')"
              :width="277"
              allow-clear
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.labelDateTimePicker')">
            <LabelDatePicker
              v-model:value="dateTime"
              :label="t('componentExamples.dates.dateTimeLabel')"
              :width="277"
              show-time
              allow-clear
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.disabledLabelDatePicker')">
            <LabelDatePicker
              :label="t('componentExamples.dates.dateLabel')"
              :width="277"
              value="2026-03-24"
              disabled
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.labelRangePicker')">
            <LabelRangePicker
              v-model:value="dateRange"
              :label="t('componentExamples.dates.dateRangeLabel')"
              :width="277"
              allow-clear
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.labelDateTimeRangePicker')">
            <LabelRangePicker
              v-model:value="dateTimeRange"
              :label="t('componentExamples.dates.dateTimeLabel')"
              :width="277"
              show-time
              allow-clear
            />
          </AFormItem>
        </ACol>
        <ACol :xs="24" :md="12" :lg="6">
          <AFormItem :label="t('componentExamples.dates.disabledLabelRangePicker')">
            <LabelRangePicker
              :label="t('componentExamples.dates.dateRangeLabel')"
              :width="277"
              :value="['2026-03-24', '2026-03-31']"
              disabled
            />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </div>
</template>

<style scoped>
@reference "../../../styles/index.css";

.datepicker-com-page {
  @apply relative z-0 p-6;
}

.section-title {
  @apply mb-4 text-title-small text-font-black-gy1;
}

.datepicker-com-form {
  @apply max-w-[1280px];
}

.picker-preview {
  @apply w-[277px] max-w-full;
}
</style>
