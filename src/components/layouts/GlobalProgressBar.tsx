"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { UI_TIMING } from "@/constants/app.constants";

// Avoids a flicker on near-instant requests — only shows once loading has
// genuinely lasted a moment.
const SHOW_DELAY_MS = UI_TIMING.progressBarShowDelayMs;
// Once shown, stays up at least this long — an under-100ms flash reads as a
// glitch, not as feedback.
const MIN_VISIBLE_MS = UI_TIMING.progressBarMinVisibleMs;
// How long the bar lingers at 100% before unmounting, so the "done" frame
// actually gets seen.
const COMPLETE_HOLD_MS = UI_TIMING.progressBarCompleteHoldMs;

/**
 * Thin top-of-page progress bar driven by the app-wide in-flight API request
 * counter (see globalLoading.store.ts / api.service.ts's interceptors) — no
 * page needs its own loading state for this to work. Progress is simulated
 * (creeps toward 90% while requests are pending, jumps to 100% when the last
 * one settles) since we don't have real byte-level progress from axios here.
 */
export function GlobalProgressBar() {
  const isLoading = useGlobalLoading();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const shownAtRef = useRef(0);

  useEffect(() => {
    const clearShowTimer = () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };
    const clearHideTimer = () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
    const clearProgressInterval = () => {
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    if (isLoading) {
      clearHideTimer();
      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
      if (!visible && showTimerRef.current === null) {
        showTimerRef.current = window.setTimeout(() => {
          showTimerRef.current = null;
          shownAtRef.current = Date.now();
          setProgress(8);
          setVisible(true);
          progressIntervalRef.current = window.setInterval(() => {
            setProgress((current) => (current >= 90 ? current : current + (90 - current) * 0.15));
          }, 200);
        }, SHOW_DELAY_MS);
      }
    } else {
      clearShowTimer();
      if (visible) {
        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        hideTimerRef.current = window.setTimeout(() => {
          hideTimerRef.current = null;
          clearProgressInterval();
          setProgress(100);
          completeTimerRef.current = window.setTimeout(() => {
            completeTimerRef.current = null;
            setVisible(false);
            setProgress(0);
          }, COMPLETE_HOLD_MS);
        }, remaining);
      }
    }

    return () => {
      clearShowTimer();
    };
  }, [isLoading, visible]);

  // Unmount cleanup for any timers/intervals still pending.
  useEffect(() => {
    return () => {
      if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      if (completeTimerRef.current !== null) window.clearTimeout(completeTimerRef.current);
      if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);
    };
  }, []);

  if (!visible) return null;

  const isComplete = progress >= 100;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-clay-gradient"
        style={{
          width: `${progress}%`,
          opacity: isComplete ? 0 : 1,
          transition: isComplete
            ? `opacity ${COMPLETE_HOLD_MS}ms ease-out, width 200ms ease-out`
            : "width 200ms ease-out",
        }}
      />
    </div>
  );
}
