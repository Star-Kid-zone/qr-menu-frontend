import { useContext, useEffect, useRef, useCallback } from 'react';
import { FingerprintContext } from '@/contexts/fingerprint.context';
import { analyticsService, AnalyticsEvent, buildAnalyticsBatchPayload } from '@/services/analytics.service';
import { API_BASE_URL } from '@/config/app.constants';

interface TrackExtras {
  /** Set when tracking a click/view on a specific dish — enables exact per-item ranking. */
  menuItemId?: string | number;
  /** Set when tracking a guest search query. */
  searchQuery?: string;
}

interface UseAnalyticsOptions {
  userId?: string | number;
  businessId?: string | number;
  batchInterval?: number;
  maxBatchSize?: number;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const fingerprint = useContext(FingerprintContext);
  const eventQueue = useRef<AnalyticsEvent[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const immediateFlushRef = useRef<NodeJS.Timeout | null>(null);
  const isSendingRef = useRef(false);

  const { userId, businessId, batchInterval = 30000, maxBatchSize = 50 } = options;

  const sendBatch = useCallback(async () => {
    if (isSendingRef.current || eventQueue.current.length === 0) {
      return;
    }

    isSendingRef.current = true;
    const eventsToSend = [...eventQueue.current];
    eventQueue.current = [];

    try {
      await analyticsService.sendBatch(eventsToSend);
    } catch (error) {
      console.error('Failed to send analytics batch:', error);
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
      if (!fingerprint) {
        console.warn('Analytics: No fingerprint available');
        return;
      }

      const event: AnalyticsEvent = {
        fingerprint,
        visitor_id: analyticsService.getVisitorId(),
        user_id: userId,
        business_id: businessId,
        action_type,
        action_target,
        menu_item_id: extras?.menuItemId,
        search_query: extras?.searchQuery,
        metadata,
        page_url: typeof window !== 'undefined' ? window.location.pathname : undefined,
        timestamp: Date.now(),
      };

      eventQueue.current.push(event);

      // Flush immediately if batch is full
      if (eventQueue.current.length >= maxBatchSize) {
        sendBatch();
        return;
      }

      // Schedule a quick flush (2.5s) so short page sessions still send data
      // Reset the timer on each new event to debounce rapid sequential events
      if (immediateFlushRef.current) {
        clearTimeout(immediateFlushRef.current);
      }
      immediateFlushRef.current = setTimeout(() => {
        sendBatch();
      }, 2500);
    },
    [fingerprint, userId, businessId, maxBatchSize, sendBatch]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (eventQueue.current.length > 0) {
        sendBatch();
      }
    }, batchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (immediateFlushRef.current) {
        clearTimeout(immediateFlushRef.current);
      }
    };
  }, [batchInterval, sendBatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (eventQueue.current.length > 0) {
        const events = eventQueue.current;

        const payload = JSON.stringify(buildAnalyticsBatchPayload(events));
        const url = `${API_BASE_URL}/public/analytics/batch`;
        try {
          if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
          } else if (typeof fetch === 'function') {
            // Intentional raw fetch (exception to the `api` rule): must use `keepalive` to outlive the page.
            fetch(url, {
              method: 'POST',
              body: payload,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            }).catch(() => {});
          }
        } catch (error) {
          console.error('Failed to send analytics on unload:', error);
        }

        eventQueue.current = [];
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  return {
    track,
    sendBatch,
  };
}
