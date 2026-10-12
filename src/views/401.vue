<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Result as AResult } from 'ant-design-vue';

import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();

function handleToLogin() {
  auth.clearSession();
  void router.replace({ name: 'Login' });
}
</script>

<template>
  <div class="unauthorized-page">
    <AResult
      status="error"
      :title="t('unauthorized.expiredTitle')"
      :sub-title="t('unauthorized.expiredDescription')"
    >
      <template #extra>
        <Button type="primary" @click="handleToLogin">
          {{ t('unauthorized.backToLogin') }}
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
