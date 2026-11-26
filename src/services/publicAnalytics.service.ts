import { getOrCreateVisitorId } from '@/utils/storage';
import { PUBLIC_ANALYTICS_BASE_URL } from '@/constants/analytics.constants';
import type { AnalyticsEvent } from '@/types/admin/analytics/analytics.types';

// Guest-site analytics. Kept apart from analytics.service.ts (the admin dashboard calls) so guest
// pages don't ship the axios client (about 14 KB gzipped, with login/CSRF interceptors guests never
// use) in their initial bundle: it is fetched only when a batch is actually sent.

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

class PublicAnalyticsService {
  getVisitorId(): string {
    return getOrCreateVisitorId(generateUUID);
  }

  async sendBatch(events: AnalyticsEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      const { default: api } = await import('./api.service');
      await api.post<unknown>(`${PUBLIC_ANALYTICS_BASE_URL}/batch`, buildAnalyticsBatchPayload(events));
    } catch (error) {
      console.error('Failed to send analytics batch:', error);
    }
  }
}

export const publicAnalyticsService = new PublicAnalyticsService();
