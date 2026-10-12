<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  Col as ACol,
  Form as AForm,
  FormItem as AFormItem,
  Row as ARow,
} from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/Button.vue';
import IconFont from '@/components/IconFont';

const { t } = useI18n();

const buttonExamples = [
  { colorType: 'black', labelKey: 'componentExamples.buttons.black', types: ['default', 'outline', 'primary'] },
  { colorType: 'blue', labelKey: 'componentExamples.buttons.blue', types: ['solid', 'primary', 'text', 'link'] },
  { colorType: 'red', labelKey: 'componentExamples.buttons.red', types: ['outline', 'primary', 'link'] },
] as const;
</script>

<template>
  <div class="button-com-page">
    <h2 class="section-title">
      {{ t('componentExamples.buttons.title') }}
    </h2>
    <AForm class="button-com-form" layout="vertical">
      <ARow :gutter="[16, 16]">
        <ACol
          v-for="example in buttonExamples"
          :key="example.colorType"
          :xs="24"
        >
          <AFormItem :label="t(example.labelKey)">
            <div class="button-preview-row">
              <template v-for="disabled in [false, true]" :key="String(disabled)">
                <Button
                  v-for="type in example.types"
                  :key="`${type}-${disabled}`"
                  :type="type"
                  :color-type="example.colorType"
                  :disabled="disabled"
                >
                  {{ t('common.button') }}
                </Button>
              </template>
            </div>
          </AFormItem>
        </ACol>

        <ACol :xs="24">
          <AFormItem :label="t('componentExamples.buttons.iconStates')">
            <div class="button-preview-row">
              <Button type="primary" loading>
                {{ t('common.loading') }}
              </Button>
              <Button type="primary">
                <template #icon>
                  <PlusOutlined />
                </template>
                {{ t('common.create') }}
              </Button>
              <Button>
                {{ t('common.button') }}
                <template #suffixIcon>
                  <IconFont type="icon-icon-chevron-down" />
                </template>
              </Button>
            </div>
          </AFormItem>
        </ACol>

        <ACol :xs="24">
          <AFormItem :label="t('componentExamples.buttons.ghost')">
            <div class="ghost-button-preview-row">
              <div class="button-preview-row">
                <Button type="ghost-white">
                  {{ t('common.button') }}
                </Button>
                <Button type="ghost-white" loading>
                  {{ t('common.loading') }}
                </Button>
                <Button type="ghost-white" disabled>
                  {{ t('common.button') }}
                </Button>
              </div>
              <div class="button-preview-row">
                <Button type="ghost-gray">
                  {{ t('common.button') }}
                </Button>
                <Button type="ghost-gray" loading>
                  {{ t('common.loading') }}
                </Button>
                <Button type="ghost-gray" disabled>
                  {{ t('common.button') }}
                </Button>
              </div>
            </div>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </div>
</template>

<style scoped>
@reference "../../../styles/index.css";

.button-com-page {
  @apply relative z-0 p-6;
}

.section-title {
  @apply mb-4 text-title-small text-font-black-gy1;
}

.button-com-form {
  @apply max-w-[1280px];
}

.button-preview-row {
  @apply flex flex-wrap items-center gap-3;
}

.ghost-button-preview-row {
  @apply flex min-h-[100px] w-[500px] max-w-full flex-col items-start gap-3 bg-brand-black p-4;
}
</style>
