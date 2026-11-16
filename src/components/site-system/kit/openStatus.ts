"use client";

import { useSyncExternalStore } from "react";
import type { HoursRow } from "@/components/templates/landing/_shared/defaults";

/**
 * "Open now — closes in 2 h 14 min" from the owner's opening hours, in the
 * restaurant's time zone. Pure (`openStatusAt`) for tests; the hook ticks
 * once a minute in the browser and returns null during the server render,
 * so the page never hydrates with a stale time.
 */

export interface OpenStatus {
  open: boolean;
  /** "Closes in 2 h 14 min", "Opens at 12:00", "Closed today", "Closed for today" */
  label: string;
  /** Minutes until the next change (closing or opening today), or null. */
  minutes: number | null;
}

const toMin = (hhmm: string | undefined) => {
  const m = hhmm?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const span = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
};

export function openStatusAt(hours: HoursRow[], timeZone: string, now: Date): OpenStatus | null {
  if (hours.length === 0) return null;
  let parts: Record<string, string>;
  try {
    parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(now)
        .map((p) => [p.type, p.value]),
    );
  } catch {
    return null;
  }
  const today = hours.find((h) => h.day.toLowerCase() === parts.weekday?.toLowerCase());
  if (!today) return null;
  const start = toMin(today.startTime);
  let end = toMin(today.endTime);
  if (start === null || end === null) return { open: false, label: "Closed today", minutes: null };
  if (end <= start) end += 24 * 60; // closes after midnight
  const nowMin = Number(parts.hour) * 60 + Number(parts.minute);
  if (nowMin < start) return { open: false, label: `Opens at ${today.startTime}`, minutes: start - nowMin };
  if (nowMin < end) return { open: true, label: `Closes in ${span(end - nowMin)}`, minutes: end - nowMin };
  return { open: false, label: "Closed for today", minutes: null };
}

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 30_000);
  return () => window.clearInterval(id);
}

/** Live status in the browser; null on the server and before hydration. */
export function useOpenStatus(hours: HoursRow[], timeZone: string): OpenStatus | null {
  const key = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(openStatusAt(hours, timeZone, new Date())),
    () => "null",
  );
  return JSON.parse(key) as OpenStatus | null;
}
