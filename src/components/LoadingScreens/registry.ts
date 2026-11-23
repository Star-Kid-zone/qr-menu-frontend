import type { LoadingScreenOption, LoadingScreenTheme } from './types';
import {
  LOADING_SCREEN_OPTIONS as CONST_OPTIONS,
  DEFAULT_LOADING_SCREEN_THEME as CONST_DEFAULT,
  LOADING_SCREEN_GROUP_ORDER as CONST_ORDER,
} from '@/constants/theme.constants';

export const LOADING_SCREEN_OPTIONS: LoadingScreenOption[] = CONST_OPTIONS as unknown as LoadingScreenOption[];

export const DEFAULT_LOADING_SCREEN_THEME: LoadingScreenTheme = CONST_DEFAULT;

export const LOADING_SCREEN_GROUP_ORDER: string[] = CONST_ORDER as unknown as string[];

type LoadingScreenGroupOption = {
  group: string;
  options: LoadingScreenOption[];
};

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

export function groupLoadingScreenOptions(options = LOADING_SCREEN_OPTIONS) {
  const grouped: LoadingScreenGroupOption[] = LOADING_SCREEN_GROUP_ORDER.map((group) => ({
    group,
    options: options.filter((option) => option.group === group),
  })).filter((entry) => entry.options.length > 0);

  const knownGroups = new Set(grouped.map((entry) => entry.group));
  const remainingGroups = Array.from(new Set(options.map((option) => option.group))).filter(
    (group) => !knownGroups.has(group)
  );

  return grouped.concat(
    remainingGroups.map((group) => ({
      group,
      options: options.filter((option) => option.group === group),
    })) as LoadingScreenGroupOption[]
  );
}

export function getLoadingScreenGroupHint(industryName?: string | null): string | null {
  const value = String(industryName ?? '').toLowerCase();
  if (!value) return null;
  if (/(restaurant|food|cafe|coffee|bar|hotel|dining|menu|kitchen|bistro|grill|bakery|pizza|sushi|dessert|catering)/.test(value)) {
    return 'Restaurant';
  }
  if (/(retail|shop|store|market|mall|boutique|commerce)/.test(value)) {
    return 'Retail';
  }
  if (/(spa|salon|beauty|wellness|clinic|health|medical|fitness|gym)/.test(value)) {
    return /(clinic|health|medical|fitness|gym)/.test(value) ? 'Health' : 'Wellness';
  }
  if (/(hotel|hospitality|travel|resort|event|venue)/.test(value)) {
    return 'Hospitality';
  }
  if (/(tech|software|app|digital|it|saas|startup)/.test(value)) {
    return 'Technology';
  }

  return null;
}
