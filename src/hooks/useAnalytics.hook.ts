import { useEffect, useRef, useCallback } from 'react';
import { publicAnalyticsService, buildAnalyticsBatchPayload } from '@/services/publicAnalytics.service';
import type { AnalyticsEvent } from '@/types/admin/analytics/analytics.types';
import { API_BASE_URL } from '@/config/app.constants';
import { getDeviceFingerprint } from '@/utils/thumbprint.utils';
import { ANALYTICS_VISIT_DEDUPE_MS } from '@/constants/analytics.constants';

interface TrackExtras {
  /** Set when tracking a click/view on a specific dish — enables exact per-item ranking. */
  menuItemId?: string;
  /** Set when tracking a guest search query. */
  searchQuery?: string;
}

interface UseAnalyticsOptions {
  userId?: string;
  businessId?: string;
  batchInterval?: number;
  maxBatchSize?: number;
}

/** When each page last recorded a visit; a repeat within the dedupe window is the same view. */
const lastVisitAt = new Map<string, number>();

/** Sends queued events with sendBeacon / keepalive so they survive the page going away. */
function flushOnExit(events: AnalyticsEvent[]): void {
  const payload = JSON.stringify(buildAnalyticsBatchPayload(events));
  const url = `${API_BASE_URL}/public/analytics/batch`;
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } else if (typeof fetch === 'function') {
      // Intentional raw fetch (exception to the `api` rule): must use `keepalive` to outlive the page.
      fetch(url, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  } catch {
    // Best effort: analytics must never break the page.
  }
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  // Starts as the stable localStorage visitor_id and upgrades to the device fingerprint once it
  // resolves (lazily, when the browser is idle). Kept in a ref so `track` never changes identity
  // — effects that depend on `track` (page-visit tracking) run once, not again on the upgrade.
  const fingerprintRef = useRef<string | null>(null);
  const eventQueue = useRef<AnalyticsEvent[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const immediateFlushRef = useRef<NodeJS.Timeout | null>(null);
  const isSendingRef = useRef(false);

  const { userId, businessId, batchInterval = 30000, maxBatchSize = 50 } = options;
  const identityRef = useRef({ userId, businessId });
  useEffect(() => {
    identityRef.current = { userId, businessId };
  }, [userId, businessId]);

  useEffect(() => {
    let cancelled = false;
    fingerprintRef.current ??= publicAnalyticsService.getVisitorId();
    getDeviceFingerprint().then((deviceFingerprint) => {
      if (!cancelled && deviceFingerprint) fingerprintRef.current = deviceFingerprint;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sendBatch = useCallback(async () => {
    if (isSendingRef.current || eventQueue.current.length === 0) return;

    isSendingRef.current = true;
    const eventsToSend = [...eventQueue.current];
    eventQueue.current = [];

    try {
      await publicAnalyticsService.sendBatch(eventsToSend);
    } catch {
      // Best effort: a failed batch is dropped rather than retried forever.
    } finally {
      isSendingRef.current = false;
    }
  }, []);

  const track = useCallback(
    (
      action_type: AnalyticsEvent['action_type'],
      action_target?: string,
      metadata?: Record<string, unknown>,
      extras?: TrackExtras
    ) => {
      if (typeof window === 'undefined') return;
      const fingerprint = fingerprintRef.current ?? publicAnalyticsService.getVisitorId();
      if (!fingerprint) return;

      if (action_type === 'visit') {
        const key = `${action_target ?? ''}|${window.location.pathname}`;
        const now = Date.now();
        if (now - (lastVisitAt.get(key) ?? 0) < ANALYTICS_VISIT_DEDUPE_MS) return;
        lastVisitAt.set(key, now);
      }

      eventQueue.current.push({
        fingerprint,
        visitor_id: publicAnalyticsService.getVisitorId(),
        user_id: identityRef.current.userId,
        business_id: identityRef.current.businessId,
        action_type,
        action_target,
        menu_item_id: extras?.menuItemId,
        search_query: extras?.searchQuery,
        metadata,
        page_url: window.location.pathname,
        timestamp: Date.now(),
      });

      if (eventQueue.current.length >= maxBatchSize) {
        sendBatch();
        return;
      }

      // Debounced quick flush (2.5s) so short page sessions still send data.
      if (immediateFlushRef.current) clearTimeout(immediateFlushRef.current);
      immediateFlushRef.current = setTimeout(() => {
        sendBatch();
      }, 2500);
    },
    [maxBatchSize, sendBatch]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (eventQueue.current.length > 0) sendBatch();
    }, batchInterval);

    const queue = eventQueue;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (immediateFlushRef.current) clearTimeout(immediateFlushRef.current);
      // Navigating inside the app unmounts the page without a pagehide: send what is queued.
      if (queue.current.length > 0) {
        flushOnExit(queue.current);
        queue.current = [];
      }
    };
  }, [batchInterval, sendBatch]);

  useEffect(() => {
    // pagehide + visibilitychange (not beforeunload, which blocks the back/forward cache).
    const flush = () => {
      if (eventQueue.current.length === 0) return;
      flushOnExit(eventQueue.current);
      eventQueue.current = [];
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return { track, sendBatch };
}
