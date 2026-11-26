import type { LoadingScreenOption, LoadingScreenTheme } from './types';
import { LOADING_SCREEN_OPTIONS as CONST_OPTIONS, DEFAULT_LOADING_SCREEN_THEME as CONST_DEFAULT } from '@/constants/theme.constants';

const LOADING_SCREEN_OPTIONS: LoadingScreenOption[] = CONST_OPTIONS as unknown as LoadingScreenOption[];

const DEFAULT_LOADING_SCREEN_THEME: LoadingScreenTheme = CONST_DEFAULT;

export function normalizeLoadingScreenTheme(value?: string | null): LoadingScreenTheme {
  const raw = String(value ?? '').trim();
  if (!raw) return DEFAULT_LOADING_SCREEN_THEME;

  if (raw === 'restaurant-mediterannean') {
    return 'restaurant-mediterranean';
  }

  return (
    LOADING_SCREEN_OPTIONS.find((option) => option.value === raw)?.value ??
    DEFAULT_LOADING_SCREEN_THEME
  );
}

export function getLoadingScreenOption(value: string | null | undefined) {
  const normalized = normalizeLoadingScreenTheme(value);
  return LOADING_SCREEN_OPTIONS.find((option) => option.value === normalized) ?? LOADING_SCREEN_OPTIONS[0]!;
}

