/**
 * Site, tenant hosting, and business hub constants.
 * Mirrors qr-backend/.../constants/site.constants.ts.
 */

export const BUSINESS_TYPE_HREF = '/admin/listbusiness?tab=workspace';

export const PUBLIC_LANDING_PATH = '/';
export const PUBLIC_MENU_PATH = '/menu';

export const DEFAULT_TAB = 'workspace';

export const MOVED_TABS: Record<string, string> = {
  businesses: '/admin/settings?tab=business',
  reviews: '/admin/listreview',
  'public-site': '/admin/qr-menu',
};

import type { BusinessFamily, SkinFamily } from '@/components/site-system/types';
import type { WebsiteSectionTabId, WebsiteSectionItem } from '@/types';

export type { WebsiteSectionTabId, WebsiteSectionItem };

export const WEBSITE_SECTIONS: WebsiteSectionItem[] = [
  { id: 'look', label: 'Look & feel', tabs: ['workspace'] },
  { id: 'content', label: 'Content', tabs: ['banners', 'content', 'gallery', 'faqs'] },
  { id: 'offers', label: 'Offers', tabs: ['offers'] },
];

export const INLINE_WORKSPACE_FORM_ID = 'inline-workspace-settings';
export const INLINE_BANNER_FORM_ID = 'inline-banner-settings';
export const TENANT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_LABEL_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
export const IPV4_REGEX = /^\d{1,3}(\.\d{1,3}){3}$/;
export const SAFE_HTTP_URL_REGEX = /^https?:\/\//i;
export const DESCRIPTION_MAX_LENGTH = 160;

export const SLUG_STATUS_TEXT = {
  checking: { text: 'Checking…', className: 'text-muted-foreground' },
  available: { text: 'Available', className: 'text-success font-semibold' },
  taken: { text: 'Already taken. Try another.', className: 'text-destructive font-semibold' },
  error: { text: "Couldn't check this address right now. You can still save it.", className: 'text-muted-foreground' },
} as const;

export const SITE_STATUS_MODES = [
  { mode: 'open', label: 'Open', description: 'No notice. Your page shows as normal.', defaultLine: '' },
  { mode: 'closed-today', label: 'Closed today', description: 'A one-day closure.', defaultLine: "We're closed today." },
  { mode: 'temporarily-closed', label: 'Temporarily closed', description: 'Closed for a while.', defaultLine: "We're temporarily closed." },
  { mode: 'holiday', label: 'Holiday', description: 'Closed for a holiday or festival.', defaultLine: "We're closed for the holidays." },
  { mode: 'renovation', label: 'Renovation', description: 'Closed while you refurbish.', defaultLine: "We're closed for renovation." },
] as const;

export const BUSINESS_FAMILY_LABELS: Record<BusinessFamily, string> = {
  restaurants: 'Restaurants',
  'quick-casual': 'Quick and casual',
  'cafes-sweets': 'Cafés and sweets',
  'bars-lounges': 'Bars and lounges',
  shops: 'Shops',
  other: 'Other',
};

export const SKIN_FAMILY_LABELS: Record<SkinFamily, string> = {
  'royal-classic': 'Royal and classic',
  'luxury-minimal': 'Quiet luxury',
  'modern-minimal': 'Modern and clean',
  editorial: 'Editorial',
  'warm-rustic': 'Warm and rustic',
  botanical: 'Botanical',
  'bold-pop': 'Bold and playful',
  'retro-vintage': 'Retro',
  'neon-night': 'Neon night',
  futurist: 'Futurist',
  'soft-glass-clay': 'Soft and rounded',
  'pixel-90s': 'Pixel',
};

export const SITE_CONTENT_TABS = [
  { id: 'awards', label: 'Awards and press' },
  { id: 'team', label: 'Team' },
  { id: 'events', label: 'Events' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'picks', label: 'Hand-picked list' },
] as const;

/**
 * Subdomains the platform itself serves (admin app, API, CDN…), never a tenant.
 */
export const PLATFORM_SUBDOMAINS: ReadonlySet<string> = new Set([
  'www',
  'app',
  'api',
  'apigateway',
  'sites',
  'admin',
  'superadmin',
  'cdn',
  'static',
  'assets',
  'media',
  'mail',
]);

/**
 * Hosts that serve the platform itself even though they aren't the root domain.
 */
export const PLATFORM_HOST_SUFFIXES = ['.amplifyapp.com', '.vercel.app', '.cloudfront.net'] as const;

/**
 * Internal route the proxy rewrites tenant guest hosts to (`/` → `/tenant-site/<slug>`,
 * `/menu` → `/tenant-site/<slug>/menu`), so guest pages get the slug from the URL and can be
 * cached. Direct requests to it are refused: guest sites live on their own host only.
 */
export const TENANT_SITE_PREFIX = '/tenant-site';

/** Dishes the landing page can show: the first N signature dishes and N popular picks. */
export const LANDING_SIGNATURE_COUNT = 6;
export const LANDING_POPULAR_COUNT = 8;

/** Cache tag of a restaurant's public portal data: `portal:<slug>`. */
export const PORTAL_TAG_PREFIX = 'portal:';
