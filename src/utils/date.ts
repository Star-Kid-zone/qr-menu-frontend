/**
 * One locale for every date the admin renders. Formatting with the runtime
 * default (`toLocaleDateString(undefined, …)`) gives "2 Nov" on the server and
 * "Nov 2" in some browsers, which breaks hydration. Always format through here.
 */
import { APP_LOCALE } from "@/constants/app.constants";

export { APP_LOCALE };

export function formatDate(value: Date | string | number, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(APP_LOCALE, options);
}

/**
 * Charts get one row per calendar day. The API only returns days that had
 * activity, so empty days are filled in (zero) between the first and last day.
 */
export function fillMissingDays<T extends { date: string }>(rows: T[], makeEmpty: (date: string) => T): T[] {
  if (rows.length < 2) return rows;
  const byDay = new Map(rows.map((r) => [r.date.slice(0, 10), r]));
  const sorted = [...byDay.keys()].sort();
  const out: T[] = [];
  const day = new Date(`${sorted[0]}T00:00:00Z`);
  const last = new Date(`${sorted[sorted.length - 1]}T00:00:00Z`);
  while (day <= last && out.length < 400) {
    const key = day.toISOString().slice(0, 10);
    out.push(byDay.get(key) ?? makeEmpty(key));
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return out;
}

export function formatTime(value: Date | string | number, options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(APP_LOCALE, options);
}
