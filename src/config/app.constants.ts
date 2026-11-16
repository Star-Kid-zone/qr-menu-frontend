/**
 * Application-wide constants (env-backed where needed).
 * Import from `@/config/app.constants` or legacy `@/Constants/constants`.
 */

export const APP_NAME = 'QRMenu';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Throws a clear startup error in production when a required env var is
 * missing, instead of silently falling back to a localhost URL. In
 * development/test, returns `fallback` so local work keeps working
 * unconfigured.
 */
function requireEnvInProduction(value: string | undefined, envVarName: string, fallback: string): string {
  if (value) return value;
  if (isProduction) {
    throw new Error(
      `[app.constants] ${envVarName} is not set. This must be configured in production — refusing to silently fall back to "${fallback}".`,
    );
  }
  return fallback;
}

const browserOrigin = typeof window !== 'undefined' ? window.location.origin : null;
const defaultAppBaseUrl = browserOrigin ?? 'http://127.0.0.1:3000';

export const APP_BASE_URL = requireEnvInProduction(
  process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL,
  'NEXT_PUBLIC_APP_BASE_URL',
  defaultAppBaseUrl,
);

/** Axios base URL; dev default `/api` works with the Next.js rewrite proxy. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

/** Absolute backend API base for server-side data fetching. */
export const SERVER_API_BASE_URL = `${requireEnvInProduction(
  process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_BASE_URL,
  'API_PROXY_TARGET',
  'http://127.0.0.1:7000',
).replace(/\/+$/, '')}/api`;

/** Root domain tenant subdomains are served from, e.g. `<slug>.mynagaram.com`. */
export const TENANT_ROOT_DOMAIN = process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN || 'mynagaram.com';

/** Canonical public URL for a tenant's landing page, given their public slug. */
export function getTenantPublicUrl(slug: string | null | undefined): string {
  const safeSlug = slug?.trim().toLowerCase() || 'example';
  return `https://${safeSlug}.${TENANT_ROOT_DOMAIN}`;
}

/**
 * Canonical public URL for a tenant: their verified custom domain when they have one
 * (settings.custom_domain from the portal), otherwise their subdomain.
 */
export function getTenantCanonicalUrl(settings: Record<string, unknown> | null | undefined, fallbackSlug?: string | null): string {
  const custom = typeof settings?.custom_domain === 'string' ? settings.custom_domain.trim().toLowerCase() : '';
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/.test(custom)) return `https://${custom}`;
  const slug = typeof settings?.public_slug === 'string' && settings.public_slug ? settings.public_slug : fallbackSlug;
  return getTenantPublicUrl(slug);
}

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

/** Debounce / UI timing defaults */
export const UI_TIMING = {
  searchDebounceMs: 300,
  toastAutoCloseMs: 4000,
} as const;
