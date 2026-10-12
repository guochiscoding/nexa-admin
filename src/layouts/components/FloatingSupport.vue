<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CloseOutlined, CustomerServiceOutlined, SendOutlined } from '@ant-design/icons-vue';

interface SupportPosition {
  x: number;
  y: number;
}

const supportPositionStorageKey = 'nexa-admin:floating-support-position:content';
const defaultPosition: SupportPosition = {
  x: 24,
  y: 24,
};

const { t } = useI18n();
const supportRef = ref<HTMLElement>();
const open = ref(false);
const message = ref('');
const position = ref<SupportPosition>(defaultPosition);
const dragging = ref(false);
const dragMoved = ref(false);
const dragStartPointer = ref({ x: 0, y: 0 });
const dragStartPosition = ref<SupportPosition>(defaultPosition);
const serviceMessages = computed(() => [
  t('support.messages.welcome'),
  t('support.messages.guide'),
]);
const supportLeft = computed(() => `${position.value.x}px`);
const supportTop = computed(() => `${position.value.y}px`);

function getSupportSize() {
  return {
    height: open.value ? 356 : 44,
    width: open.value ? 336 : 128,
  };
}

function getBoundarySize() {
  const parent = supportRef.value?.parentElement;
  return {
    height: parent?.clientHeight ?? window.innerHeight,
    width: parent?.clientWidth ?? window.innerWidth,
  };
}

function clampPosition(nextPosition: SupportPosition) {
  const margin = 16;
  const size = getSupportSize();
  const boundary = getBoundarySize();
  return {
    x: Math.min(Math.max(nextPosition.x, margin), Math.max(margin, boundary.width - size.width - margin)),
    y: Math.min(Math.max(nextPosition.y, margin), Math.max(margin, boundary.height - size.height - margin)),
  };
}

function loadPosition() {
  try {
    const cached = JSON.parse(localStorage.getItem(supportPositionStorageKey) ?? '{}') as Partial<SupportPosition>;
    if (typeof cached.x === 'number' && typeof cached.y === 'number') {
      position.value = clampPosition(cached as SupportPosition);
      return;
    }
  } catch {
    // 位置缓存损坏时回退默认右下角，避免影响客服入口显示。
  }

  position.value = clampPosition({
    x: getBoundarySize().width - 128 - defaultPosition.x,
    y: getBoundarySize().height - 44 - defaultPosition.y,
  });
}

function savePosition() {
  localStorage.setItem(supportPositionStorageKey, JSON.stringify(position.value));
}

function toggleSupport() {
  if (dragMoved.value) {
    dragMoved.value = false;
    return;
  }
  open.value = !open.value;
  position.value = clampPosition(position.value);
}

function closeSupport() {
  open.value = false;
  position.value = clampPosition(position.value);
}

function handleDragStart(event: PointerEvent) {
  if (event.button !== 0) return;
  dragging.value = true;
  dragMoved.value = false;
  dragStartPointer.value = {
    x: event.clientX,
    y: event.clientY,
  };
  dragStartPosition.value = position.value;
  window.addEventListener('pointermove', handleDragMove);
  window.addEventListener('pointerup', handleDragEnd, { once: true });
}

function handleDragMove(event: PointerEvent) {
  if (!dragging.value) return;

  const distanceX = event.clientX - dragStartPointer.value.x;
  const distanceY = event.clientY - dragStartPointer.value.y;
  if (Math.abs(distanceX) > 3 || Math.abs(distanceY) > 3) dragMoved.value = true;

  position.value = clampPosition({
    x: dragStartPosition.value.x + distanceX,
    y: dragStartPosition.value.y + distanceY,
  });
}

function handleDragEnd() {
  dragging.value = false;
  savePosition();
  window.removeEventListener('pointermove', handleDragMove);
}

function handleViewportResize() {
  position.value = clampPosition(position.value);
  savePosition();
}

onMounted(() => {
  void nextTick(loadPosition);
  window.addEventListener('resize', handleViewportResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleViewportResize);
  window.removeEventListener('pointermove', handleDragMove);
});
</script>

<template>
  <section ref="supportRef" class="floating-support" :class="{ 'is-dragging': dragging, 'is-open': open }">
    <button
      type="button"
      class="support-trigger"
      :aria-expanded="open"
      :aria-label="t('support.title')"
      @pointerdown="handleDragStart"
      @click="toggleSupport"
    >
      <CustomerServiceOutlined class="support-trigger-icon" aria-hidden="true" />
      <span class="support-trigger-text">{{ t('support.title') }}</span>
    </button>

    <div
      v-if="open"
      class="support-panel"
      role="dialog"
      :aria-label="t('support.title')"
    >
      <header class="support-panel-header" @pointerdown="handleDragStart">
        <span class="support-avatar">
          <CustomerServiceOutlined aria-hidden="true" />
        </span>
        <span class="support-heading">
          <strong>{{ t('support.title') }}</strong>
          <small>{{ t('support.subtitle') }}</small>
        </span>
        <button
          type="button"
          class="support-close"
          :aria-label="t('common.close')"
          @click="closeSupport"
        >
          <CloseOutlined aria-hidden="true" />
        </button>
      </header>

      <div class="support-message-list">
        <p v-for="item in serviceMessages" :key="item" class="support-message">
          {{ item }}
        </p>
      </div>

      <div class="support-input-row">
        <input
          v-model="message"
          class="support-input"
          type="text"
          :placeholder="t('support.placeholder')"
        >
        <button type="button" class="support-send" :aria-label="t('support.send')">
          <SendOutlined aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../../styles/index.css";

.floating-support {
  @apply absolute z-50 flex flex-col items-end gap-3;
  left: v-bind(supportLeft);
  top: v-bind(supportTop);
}

.support-trigger {
  @apply inline-flex h-11 cursor-grab touch-none items-center gap-2 rounded border border-component-border bg-brand-black px-4 text-body-medium font-medium text-font-white-gy1 shadow-td-shadow-3 transition-[background-color,box-shadow,transform];
}

.support-trigger:hover {
  @apply bg-brand-black-hover shadow-td-shadow-2;
  transform: translateY(-1px);
}

.floating-support.is-dragging .support-trigger,
.floating-support.is-dragging .support-panel-header {
  @apply cursor-grabbing;
}

.support-trigger-icon {
  @apply text-title-medium;
}

.support-trigger-text {
  @apply whitespace-nowrap;
}

.support-panel {
  @apply grid w-[336px] max-w-[calc(100vw-32px)] gap-4 rounded-lg border border-component-stroke bg-container p-4 shadow-td-shadow-3;
}

.support-panel-header {
  @apply flex min-w-0 cursor-grab touch-none items-center gap-3;
}

.support-avatar {
  @apply flex size-10 shrink-0 items-center justify-center rounded bg-brand-blue-light text-title-medium text-brand-blue;
}

.support-heading {
  @apply grid min-w-0 flex-1 gap-0.5;
}

.support-heading strong {
  @apply text-title-small font-semibold text-font-black-gy1;
}

.support-heading small {
  @apply text-body-small text-font-black-gy3;
}

.support-close,
.support-send {
  @apply inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded border border-component-border bg-container text-font-black-gy3 hover:bg-container-hover hover:text-font-black-gy1;
}

.support-message-list {
  @apply grid gap-2;
}

.support-message {
  @apply m-0 rounded bg-color-secondarycontainer px-3 py-2 text-body-medium leading-6 text-font-black-gy2;
}

.support-input-row {
  @apply flex min-w-0 items-center gap-2;
}

.support-input {
  @apply h-9 min-w-0 flex-1 rounded border border-component-border bg-container px-3 text-body-medium text-font-black-gy1 outline-none placeholder:text-font-black-gy4 focus:border-brand-blue;
}

.support-send {
  @apply border-brand-blue bg-brand-blue text-font-white-gy1 hover:bg-brand-blue-hover hover:text-font-white-gy1;
}

@media (max-width: 640px) {
  .support-trigger-text {
    @apply hidden;
  }

  .support-trigger {
    @apply size-11 justify-center px-0;
  }
}
</style>

