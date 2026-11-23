import api from './api.service';
import { getOrCreateVisitorId } from '@/utils/storage';
import { ANALYTICS_BASE_URL, PUBLIC_ANALYTICS_BASE_URL } from '@/constants/analytics.constants';

import type {
  AnalyticsActionType,
  AnalyticsEvent,
  DashboardData,
  VisitorRow,
  VisitorsPage,
} from '@/types/admin/analytics/analytics.types';

export type {
  AnalyticsActionType,
  AnalyticsEvent,
  DashboardData,
  VisitorRow,
  VisitorsPage,
};

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
