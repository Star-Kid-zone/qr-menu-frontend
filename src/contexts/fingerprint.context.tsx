'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { getDeviceFingerprint } from '@/utils/thumbprint.utils';

export const FingerprintContext = createContext<string | null>(null);

export const useFingerprint = (): string | null => {
  return useContext(FingerprintContext);
};

export function FingerprintProvider({ children }: { children: ReactNode }) {
  // Starts as the stable localStorage visitor_id (always available, survives
  // reloads) and upgrades to the device fingerprint once it resolves, which
  // stays stable even if the visitor clears storage. If fingerprinting fails
  // or is blocked, visitor_id remains the value in use.
  const [fingerprint, setFingerprint] = useState<string | null>(() =>
    typeof window !== 'undefined' ? analyticsService.getVisitorId() : null
  );

  useEffect(() => {
    let cancelled = false;
    getDeviceFingerprint()
      .then((deviceFingerprint) => {
        if (!cancelled && deviceFingerprint) {
          setFingerprint(deviceFingerprint);
        }
      })
      .catch(() => {
        // Fingerprinting unavailable/blocked — keep the visitor_id fallback.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <FingerprintContext.Provider value={fingerprint}>{children}</FingerprintContext.Provider>;
}
