/**
 * Application-wide pure constants (UI timing, suspense labels, locale, defaults).
 * Pure data only — environment-derived URLs belong in src/config/app.constants.ts.
 */

export const APP_NAME = 'QRMenu';

export const DEFAULT_APP_DESCRIPTION =
  'One QR code on the table: your menu, website and Google reviews, managed from one dashboard.';

export const APP_LOCALE = 'en-IN';

/** Default labels for route-level Suspense fallbacks */
export const SUSPENSE_LABELS = {
  route: 'Loading…',
  workspace: 'Loading workspace',
  page: 'Loading page',
  guest: 'Loading',
  /** Admin shell (sidebar + navbar) */
  shell: 'Loading app…',
  /** Dialogs / modals opened on demand */
  modal: 'Loading…',
  /** Heavy tab sections (e.g. offers, gallery) */
  section: 'Loading…',
  /** Recharts and other chart bundles */
  charts: 'Loading charts…',
} as const;

/** Debounce / UI timing defaults (in milliseconds) */
export const UI_TIMING = {
  searchDebounceMs: 300,
  toastAutoCloseMs: 4000,
  loaderShowDelayMs: 150,
  loaderMinVisibleMs: 250,
  progressBarShowDelayMs: 100,
  progressBarMinVisibleMs: 300,
  progressBarCompleteHoldMs: 200,
} as const;

export const ANNOUNCEMENT_BADGE_TONE: Record<string, string> = {
  warning: 'bg-warning/15 text-warning-foreground',
  promo: 'bg-primary/10 text-primary',
  feature: 'bg-success/10 text-success',
};

export const ANNOUNCEMENT_TYPE_OPTIONS = [
  { value: 'feature', label: 'New feature' },
  { value: 'info', label: 'General info' },
  { value: 'warning', label: 'Maintenance or warning' },
  { value: 'promo', label: 'Promotion or festival' },
] as const;

/** Cache and revalidation defaults (in milliseconds / seconds) */
export const CACHE_TTL_MS = 60_000;
export const MISS_TTL_MS = 30_000;
export const PUBLIC_REVALIDATE_SECONDS = 60;

export const MODERN_TIMEZONE_NAMES: Readonly<Record<string, string>> = {
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Europe/Kiev': 'Europe/Kyiv',
  'Atlantic/Faeroe': 'Atlantic/Faroe',
  'America/Godthab': 'America/Nuuk',
  'Pacific/Truk': 'Pacific/Chuuk',
  'Pacific/Ponape': 'Pacific/Pohnpei',
  'Pacific/Enderbury': 'Pacific/Kanton',
};

export const IMAGE_COMPRESSION_DEFAULTS = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.82,
  maxSizeBytes: 500 * 1024,
} as const;
