"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { RestaurantLoaderIcon } from "@/components/ui/RestaurantLoaderIcon";
import { UI_TIMING } from "@/constants/app.constants";

// Avoids a flash on near-instant requests — only shows once loading has
// genuinely lasted a moment.
const SHOW_DELAY_MS = UI_TIMING.loaderShowDelayMs;
// Once shown, stays visible at least this long so it doesn't flicker off.
const MIN_VISIBLE_MS = UI_TIMING.loaderMinVisibleMs;

/**
 * Full-screen semi-transparent overlay with a dimmed backdrop and an animated
 * restaurant cloche icon that appears whenever any API request is in-flight,
 * driven by the global loading store (globalLoading.store.ts).
 *
 * Mounted once inside AdminLayout / SuperadminLayout — zero per-page wiring needed.
 * Works on all screen sizes automatically via fixed inset-0.
 */
export function GlobalLoaderOverlay() {
  const isLoading = useGlobalLoading();
  const [visible, setVisible] = useState(false);

  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (isLoading) {
      // Cancel any pending hide
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      // Show after a brief delay to avoid flash on fast requests
      if (!visible && showTimerRef.current === null) {
        showTimerRef.current = window.setTimeout(() => {
          showTimerRef.current = null;
          shownAtRef.current = Date.now();
          setVisible(true);
        }, SHOW_DELAY_MS);
      }
    } else {
      // Cancel any pending show
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (visible) {
        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        hideTimerRef.current = window.setTimeout(() => {
          hideTimerRef.current = null;
          setVisible(false);
        }, remaining);
      }
    }

    return () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };
  }, [isLoading, visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading, please wait"
      className="
        fixed inset-0 z-[200]
        flex items-center justify-center
        bg-black/35 dark:bg-black/60 backdrop-blur-[2px]
        cursor-wait transition-opacity duration-200
      "
    >
      <div
        className="
          relative flex flex-col items-center justify-center
          rounded-2xl border border-border/50
          bg-card/95 p-6 shadow-2xl backdrop-blur-md
          text-center max-w-[210px] min-w-[170px]
          animate-scale-in
        "
      >
        <RestaurantLoaderIcon size="lg" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default GlobalLoaderOverlay;
