import api from './api.service';
import { getOrCreateVisitorId } from '@/utils/storage';

// Admin dashboard endpoints (authenticated, per-tenant)
const ANALYTICS_BASE_URL = '/analytics';
// Guest-facing ingestion endpoint (unauthenticated, mounted under /public)
const PUBLIC_ANALYTICS_BASE_URL = '/public/analytics';

export type AnalyticsActionType = 'visit' | 'click' | 'view' | 'navigation' | 'search';

export interface AnalyticsEvent {
  fingerprint: string;
  visitor_id: string;
  user_id?: string | number;
  business_id?: string | number;
  action_type: AnalyticsActionType;
  action_target?: string;
  /** Set when tracking a click/view on a specific dish. */
  menu_item_id?: string | number;
  /** Set when tracking a guest search query. */
  search_query?: string;
  metadata?: Record<string, unknown>;
  page_url?: string;
  timestamp?: number;
}

export interface DashboardData {
  summary: {
    totalVisits: number;
    totalClicks: number;
    totalSearches: number;
    uniqueVisitors: number;
    popularItem: string;
  };
  today: {
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
    visits: number;
    clicks: number;
    searches: number;
    events: number;
  };
  visitorTrend: Array<{ date: string; newVisitors: number; returningVisitors: number }>;
  zeroResultSearches: Array<{ query: string; count: number }>;
  visitHistory: Array<{ date: string; count: number }>;
  clickBreakdown: Record<string, number>;
  topMenuItems: Array<{
    menuItemId: string;
    item: string;
    imageUrl: string | null;
    price: string;
    count: number;
  }>;
  topSearches: Array<{ query: string; count: number }>;
  /** How guests arrived — 'direct' when no UTM param or cross-site referrer was captured. */
  acquisition: Array<{ source: string; count: number }>;
  /** Totals for the period just before the selected one. Null for "all time". */
  previous?: { visits: number; visitors: number; clicks: number; searches: number } | null;
  /** Visits per hour of day (0-23), server-local time. */
  visitsByHour?: Array<{ hour: number; count: number }>;
}

export interface VisitorRow {
  visitorId: string;
  fingerprint: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  firstSeen: string;
  lastSeen: string;
  totalEvents: number;
  visits: number;
  clicks: number;
  searches: number;
}

export interface VisitorsPage {
  visitors: VisitorRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Generates a UUID v4, with a fallback for non-secure (HTTP) contexts
 *  where `crypto.randomUUID` is not available. */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: manual UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Builds the exact request body the backend's `analyticsBatchSchema` validates
 * (`POST /api/public/analytics/batch`) — shared by the async `sendBatch` path
 * and the synchronous `beforeunload` flush so both stay wire-compatible.
 */
export function buildAnalyticsBatchPayload(events: AnalyticsEvent[]) {
  const visitorId = getOrCreateVisitorId(generateUUID);
  const fingerprint = events.find((e) => e.fingerprint)?.fingerprint || null;

  return {
    visitorId,
    fingerprint,
    events: events.map((e) => ({
      actionType: e.action_type,
      actionTarget: e.action_target ?? null,
      menuItemId: e.menu_item_id != null ? String(e.menu_item_id) : null,
      searchQuery: e.search_query ?? null,
      metadata: e.metadata ?? null,
      pageUrl: e.page_url ?? null,
      timestamp: new Date(e.timestamp ?? Date.now()).toISOString(),
      userId: e.user_id != null ? String(e.user_id) : null,
      businessId: e.business_id != null ? String(e.business_id) : null,
    })),
  };
}

class AnalyticsService {
  getVisitorId(): string {
    return getOrCreateVisitorId(generateUUID);
  }

  async sendBatch(events: AnalyticsEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      await api.post(`${PUBLIC_ANALYTICS_BASE_URL}/batch`, buildAnalyticsBatchPayload(events));
    } catch (error) {
      console.error('Failed to send analytics batch:', error);
    }
  }

  async getDashboard(range: string = '7d'): Promise<DashboardData> {
    const response = await api.get(ANALYTICS_BASE_URL, {
      params: { range },
    });
    return response.data;
  }

  async getVisitors(page: number = 1, pageSize: number = 20): Promise<VisitorsPage> {
    const response = await api.get(`${ANALYTICS_BASE_URL}/visitors`, {
      params: { page, pageSize },
    });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
