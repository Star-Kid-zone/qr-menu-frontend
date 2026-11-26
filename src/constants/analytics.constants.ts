import type { AnalyticsTabId } from '@/types';

export type { AnalyticsTabId };

export const ANALYTICS_BASE_URL = '/analytics';
export const PUBLIC_ANALYTICS_BASE_URL = '/public/analytics';

export const TAB_OPTIONS: Array<{ id: AnalyticsTabId; label: string }> = [
  { id: 'traffic', label: 'Traffic & Funnel' },
  { id: 'demand', label: 'Searches' },
  { id: 'dishes', label: 'Top Dishes' },
  { id: 'time_tech', label: 'Busy times & devices' },
  { id: 'tenants', label: 'Restaurant ranking' },
];

export const DONUT_COLORS = [
  '#06b6d4', // Teal/Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
] as const;

export const DASHBOARD_RANGE_LABELS: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  all: 'All time',
};

export const ANALYTICS_TAP_LABELS: Record<string, string> = {
  menu_views: 'Opened a dish',
  whatsapp_clicks: 'WhatsApp / Call',
  google_review_clicks: 'Google reviews',
  payment_clicks: 'Pay bill',
};

/** A second "visit" for the same page within this window is the same page view (re-render, dev double-effect). */
export const ANALYTICS_VISIT_DEDUPE_MS = 2000;
