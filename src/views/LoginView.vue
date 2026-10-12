<script setup lang="ts">
import axios from 'axios';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
  Alert as AAlert,
  Checkbox as ACheckbox,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  InputPassword as AInputPassword,
} from 'ant-design-vue';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';

import Button from '@/components/Button.vue';
import LogoMark from '@/components/LogoMark.vue';
import { useAuthStore } from '@/stores/auth';

interface LoginFormState {
  password: string;
  rememberMe: boolean;
  username: string;
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const submitting = ref(false);
const errorMessage = ref('');
const pointerX = ref(50);
const pointerY = ref(50);
const formState = reactive<LoginFormState>({
  password: '',
  rememberMe: true,
  username: '',
});
const isDemoAuthMode = computed(() => import.meta.env.VITE_AUTH_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL?.trim());
const pointerXPosition = computed(() => `${pointerX.value}%`);
const pointerYPosition = computed(() => `${pointerY.value}%`);

const formRules = computed(() => ({
  password: [{ required: true, message: t('auth.requiredPassword'), trigger: 'blur' }],
  username: [{ required: true, message: t('auth.requiredUsername'), trigger: 'blur' }],
}));

function getRedirectPath() {
  const redirect = route.query.redirect;
  const target = Array.isArray(redirect) ? redirect[0] : redirect;
  if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') && target !== '/login') {
    return target;
  }
  return '/';
}

function getLoginErrorMessage(error: unknown) {
  // 登录接口无响应通常表示后端服务未连接，需与账号密码校验失败区分提示。
  if (axios.isAxiosError(error) && (!error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
    return t('auth.serviceUnavailable');
  }

  return t('auth.invalidCredentials');
}

async function handleSubmit() {
  if (submitting.value) return;

  submitting.value = true;
  errorMessage.value = '';

  try {
    await auth.login({
      password: formState.password,
      rememberMe: formState.rememberMe,
      username: formState.username.trim(),
    });
    await router.replace(getRedirectPath());
  } catch (error) {
    errorMessage.value = getLoginErrorMessage(error);
  } finally {
    submitting.value = false;
  }
}

function handleBrandPointerMove(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  pointerX.value = Math.round(((event.clientX - rect.left) / rect.width) * 100);
  pointerY.value = Math.round(((event.clientY - rect.top) / rect.height) * 100);
}
</script>

<template>
  <main class="login-view">
    <section
      class="login-brand-zone"
      aria-hidden="true"
      @pointermove="handleBrandPointerMove"
    >
      <div class="login-brand-grid" />
      <div class="login-brand-glow" />
      <div class="login-brand-lockup">
        <LogoMark class="login-brand-mark" />
        <span class="login-brand-name">{{ t('layout.productName') }}</span>
      </div>
      <div class="login-brand-copy">
        <span class="login-brand-kicker">{{ t('auth.loginKicker') }}</span>
        <h1>{{ t('auth.loginHeroTitle') }}</h1>
        <p>{{ t('auth.loginHeroDescription') }}</p>
      </div>
      <div class="login-brand-preview">
        <div class="preview-header">
          <span />
          <span />
          <span />
        </div>
        <div class="preview-stat-row">
          <i />
          <i />
          <i />
        </div>
        <div class="preview-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>

    <section class="login-panel" :aria-label="t('auth.loginTitle')">
      <div class="login-form-shell">
        <div class="login-form-heading">
          <span class="login-form-kicker">{{ t('auth.loginTitle') }}</span>
          <h2>{{ t('auth.loginSubtitle') }}</h2>
        </div>

        <div class="login-alert-stack">
          <AAlert
            v-if="errorMessage"
            class="login-alert"
            type="error"
            :message="errorMessage"
            show-icon
          />

          <AAlert
            v-if="isDemoAuthMode"
            class="login-alert"
            type="info"
            :message="t('auth.demoHint')"
            show-icon
          />
        </div>

        <AForm
          class="login-form"
          layout="vertical"
          :model="formState"
          :rules="formRules"
          @finish="handleSubmit"
        >
          <AFormItem name="username" :label="t('auth.username')">
            <AInput
              v-model:value="formState.username"
              class="login-input"
              size="large"
              autocomplete="username"
              :placeholder="t('auth.usernamePlaceholder')"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </AInput>
          </AFormItem>

          <AFormItem name="password" :label="t('auth.password')">
            <AInputPassword
              v-model:value="formState.password"
              class="login-input"
              size="large"
              autocomplete="current-password"
              :placeholder="t('auth.passwordPlaceholder')"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </AInputPassword>
          </AFormItem>

          <div class="login-form-options">
            <ACheckbox v-model:checked="formState.rememberMe" class="login-checkbox">
              {{ t('auth.rememberMe') }}
            </ACheckbox>
          </div>

          <Button
            class="login-submit"
            type="primary"
            color-type="black"
            size="large"
            html-type="submit"
            :loading="submitting"
          >
            {{ submitting ? t('auth.submitting') : t('auth.submit') }}
          </Button>
        </AForm>
      </div>
    </section>
  </main>
</template>

<style scoped>
@reference "../styles/index.css";

.login-view {
  @apply grid h-screen w-screen grid-cols-[minmax(360px,0.85fr)_minmax(420px,1fr)] overflow-hidden bg-page text-font-black-gy1;
}

.login-brand-zone {
  @apply relative flex min-w-0 flex-col justify-between overflow-hidden border-r border-component-stroke bg-brand-black p-10 text-font-white-gy1;
  --pointer-x: v-bind(pointerXPosition);
  --pointer-y: v-bind(pointerYPosition);
  background:
    radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--brand-blue) 30%, transparent), transparent 28%),
    radial-gradient(circle at 74% 82%, color-mix(in srgb, var(--success-color) 18%, transparent), transparent 30%),
    linear-gradient(145deg, color-mix(in srgb, var(--brand-blue) 18%, var(--brand-black)), var(--brand-black) 54%);
}

.login-brand-zone::before {
  @apply pointer-events-none absolute inset-0 opacity-80;
  content: "";
  background:
    radial-gradient(circle at var(--pointer-x) var(--pointer-y), color-mix(in srgb, var(--brand-blue) 32%, transparent), transparent 24%),
    linear-gradient(135deg, color-mix(in srgb, currentColor 12%, transparent), transparent 42%),
    linear-gradient(315deg, color-mix(in srgb, currentColor 9%, transparent), transparent 38%);
}

.login-brand-grid {
  @apply pointer-events-none absolute inset-0 opacity-30;
  background-image:
    linear-gradient(color-mix(in srgb, currentColor 12%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, currentColor 12%, transparent) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(180deg, transparent, black 18%, black 78%, transparent);
}

.login-brand-glow {
  @apply pointer-events-none absolute size-72 rounded-full bg-brand-blue-light opacity-20 blur-3xl;
  left: calc(var(--pointer-x) - 144px);
  top: calc(var(--pointer-y) - 144px);
  transition: left 120ms ease-out, top 120ms ease-out;
}

.login-brand-lockup {
  @apply relative z-10 flex items-center gap-3;
}

.login-brand-mark {
  @apply size-9 text-font-white-gy1;
}

.login-brand-name {
  @apply text-base font-semibold text-font-white-gy1;
}

.login-brand-copy {
  @apply relative z-10 grid max-w-[560px] gap-4;
}

.login-brand-kicker {
  @apply text-body-small font-semibold text-font-white-gy3;
}

.login-brand-copy h1 {
  @apply m-0 text-headline-small font-semibold leading-tight text-font-white-gy1;
}

.login-brand-copy p {
  @apply m-0 max-w-[520px] text-body-medium leading-7 text-font-white-gy3;
}

.login-brand-preview {
  @apply relative z-10 grid w-full max-w-[520px] gap-5 rounded border border-component-stroke bg-container p-5 shadow-td-shadow-5;
}

.preview-header {
  @apply flex gap-2;
}

.preview-header span {
  @apply block size-2 rounded-full bg-font-black-gy4;
}

.preview-stat-row {
  @apply grid grid-cols-3 gap-3;
}

.preview-stat-row i {
  @apply h-16 rounded bg-color-secondarycontainer;
}

.preview-lines {
  @apply grid gap-2;
}

.preview-lines span {
  @apply h-2 rounded bg-color-secondarycontainer;
}

.preview-lines span:nth-child(2) {
  @apply w-4/5;
}

.preview-lines span:nth-child(3) {
  @apply w-3/5;
}

.login-panel {
  @apply flex min-w-0 items-center justify-center overflow-y-auto bg-container px-6 py-10;
}

.login-form-shell {
  @apply grid w-full max-w-[420px] gap-4;
}

.login-form-heading {
  @apply grid gap-2;
}

.login-form-kicker {
  @apply text-body-small font-semibold text-font-blue-link;
}

.login-form-heading h2 {
  @apply m-0 text-headline-small font-semibold leading-tight text-font-black-gy1;
}

.login-alert {
  @apply rounded-[4px];
}

.login-alert-stack {
  @apply grid min-h-[86px] content-start gap-2;
}

.login-form {
  @apply grid gap-1;
}

.login-form :deep(.ant-form-item) {
  @apply mb-4;
}

.login-form :deep(.ant-form-item-label > label) {
  @apply text-sm font-medium text-font-black-gy2;
}

.login-form :deep(.ant-form-item-control) {
  @apply min-h-0;
  position: static;
}

.login-form :deep(.ant-form-item-explain),
.login-form :deep(.ant-form-item-extra) {
  min-height: 0 !important;
}

.login-form :deep(.ant-form-item-explain) {
  position: static !important;
  width: auto;
  margin-top: 6px;
  pointer-events: auto;
}

.login-form :deep(.ant-form-item-explain-error) {
  @apply text-body-small;
  line-height: 20px;
}

.login-input {
  @apply h-11 rounded-[4px] border-component-border bg-container text-font-black-gy1;
}

.login-input :deep(.ant-input) {
  @apply bg-transparent text-font-black-gy1;
}

.login-input :deep(.ant-input-prefix) {
  @apply mr-2 text-font-black-gy3;
}

.login-form-options {
  @apply mb-5 flex items-center justify-between;
}

.login-checkbox {
  @apply text-font-black-gy2;
}

.login-submit {
  @apply w-full;
}

@media (max-width: 900px) {
  .login-view {
    @apply grid-cols-1;
  }

  .login-brand-zone {
    @apply min-h-[220px] border-r-0 border-b p-6;
  }

  .login-brand-preview {
    @apply hidden;
  }

  .login-panel {
    @apply items-start px-5 py-6;
  }
}
</style>
