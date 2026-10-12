import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import { appConfig } from '@/config/app';
import { getColorTokens, themeModeOptions } from '@/config/theme';

export type LayoutMode = 'side' | 'top';
export type LocaleCode = 'en-US' | 'zh-CN';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeTransitionOrigin {
  x: number;
  y: number;
}

interface ViewTransitionHandle {
  ready: Promise<void>;
}

type ThemeTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionHandle;
};

interface StoredPreferences {
  layout: LayoutMode;
  locale: LocaleCode;
  theme: ThemeMode;
}

const storageKey = `${appConfig.storageNamespace}:preferences`;
const layoutOptions: LayoutMode[] = ['side', 'top'];
const localeOptions: LocaleCode[] = ['en-US', 'zh-CN'];

function normalizeLayout(value: unknown, fallback: LayoutMode): LayoutMode {
  return layoutOptions.includes(value as LayoutMode) ? value as LayoutMode : fallback;
}

function normalizeLocale(value: unknown, fallback: LocaleCode): LocaleCode {
  return localeOptions.includes(value as LocaleCode) ? value as LocaleCode : fallback;
}

function normalizeTheme(value: unknown, fallback: ThemeMode): ThemeMode {
  return themeModeOptions.includes(value as ThemeMode) ? value as ThemeMode : fallback;
}

function createDefaults(): StoredPreferences {
  return {
    layout: appConfig.defaultLayout,
    locale: appConfig.defaultLocale,
    theme: appConfig.defaultTheme,
  };
}

function loadPreferences(): StoredPreferences {
  const defaults = createDefaults();
  try {
    const cached = JSON.parse(
      localStorage.getItem(storageKey) ?? '{}',
    ) as Partial<StoredPreferences>;
    return {
      layout: normalizeLayout(cached.layout, defaults.layout),
      locale: normalizeLocale(cached.locale, defaults.locale),
      theme: normalizeTheme(cached.theme, defaults.theme),
    };
  } catch {
    return defaults;
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const initial = loadPreferences();
  const layout = ref(initial.layout);
  const locale = ref(initial.locale);
  const theme = ref(initial.theme);
  const systemDark = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? systemDark.value
        ? 'dark'
        : 'light'
      : theme.value,
  );

  let initialized = false;
  let activeThemeTransition: Animation | undefined;

  function resolveThemeMode(mode: ThemeMode) {
    return mode === 'system'
      ? systemDark.value
        ? 'dark'
        : 'light'
      : mode;
  }

  function applyDocumentTheme() {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme.value;
    root.style.colorScheme = resolvedTheme.value;
    Object.entries(getColorTokens(resolvedTheme.value)).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  }

  function initialize() {
    if (initialized) return;
    initialized = true;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (event) => {
      systemDark.value = event.matches;
    });

    watch(
      [layout, locale, theme, resolvedTheme],
      () => {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            layout: layout.value,
            locale: locale.value,
            theme: theme.value,
          }),
        );
        applyDocumentTheme();
      },
      { immediate: true },
    );
  }

  function reset() {
    const defaults = createDefaults();
    layout.value = defaults.layout;
    locale.value = defaults.locale;
    theme.value = defaults.theme;
  }

  function toggleTheme() {
    theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark';
  }

  function animateThemeTransition(origin: ThemeTransitionOrigin, updateTheme: () => void) {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transitionDocument = document as ThemeTransitionDocument;

    if (motionQuery.matches || !transitionDocument.startViewTransition) {
      updateTheme();
      return;
    }

    activeThemeTransition?.cancel();
    const transition = transitionDocument.startViewTransition(updateTheme);

    void transition.ready.then(() => {
      const root = document.documentElement;
      const endRadius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      );

      activeThemeTransition = root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 640,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }

  function setTheme(nextTheme: ThemeMode, origin?: ThemeTransitionOrigin) {
    const normalizedTheme = normalizeTheme(nextTheme, appConfig.defaultTheme);
    const currentResolvedTheme = resolvedTheme.value;
    const nextResolvedTheme = resolveThemeMode(normalizedTheme);

    const updateTheme = () => {
      theme.value = normalizedTheme;
      applyDocumentTheme();
    };

    if (!origin || currentResolvedTheme === nextResolvedTheme) {
      updateTheme();
      return;
    }

    animateThemeTransition(origin, updateTheme);
  }

  return {
    initialize,
    layout,
    locale,
    reset,
    resolvedTheme,
    setTheme,
    theme,
    toggleTheme,
  };
});
