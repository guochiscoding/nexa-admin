<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Result as AResult } from 'ant-design-vue';

import Button from '@/components/Button.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

/** 权限不足时返回首页，避免继续停留在无权限路由。 */
function handleToHome() {
  void router.replace({ name: 'Home' });
}
</script>

<template>
  <div class="unauthorized-page">
    <AResult
      status="403"
      :title="t('forbidden.title')"
      :sub-title="t('forbidden.description')"
    >
      <template #extra>
        <Button type="primary" @click="handleToHome">
          {{ t('forbidden.backToHome') }}
        </Button>
      </template>
    </AResult>
  </div>
</template>

<style scoped>
@reference "../styles/index.css";

.unauthorized-page {
  @apply flex h-full min-h-0 w-full items-center justify-center bg-page px-6 py-10;
}
</style>
