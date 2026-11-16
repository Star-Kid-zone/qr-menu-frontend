import type { SectionInstance, SectionSchedule, SiteDocument, SitePageKind, SiteStatus, SiteStatusMode } from "./types";
import { parseOccasion } from "@/components/site-system/occasions/activeOccasion";

/** The parts of a section definition the resolver needs (keeps this file free of React). */
export interface SectionCatalogueEntry {
  type: string;
  defaultVisible: boolean;
}

const ID_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;
const TYPE_RE = /^[a-z][a-z0-9-]{0,39}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUS_MODES: readonly SiteStatusMode[] = ["open", "closed-today", "temporarily-closed", "holiday", "renovation"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const asDate = (v: unknown): string | undefined => (typeof v === "string" && DATE_RE.test(v) ? v : undefined);

function toSchedule(raw: unknown): SectionSchedule | undefined {
  if (!isRecord(raw)) return undefined;
  const from = asDate(raw.from);
  const to = asDate(raw.to);
  if (!from && !to) return undefined;
  return { ...(from ? { from } : {}), ...(to ? { to } : {}) };
}

function toStatus(raw: unknown): SiteStatus | undefined {
  if (!isRecord(raw) || !STATUS_MODES.includes(raw.mode as SiteStatusMode)) return undefined;
  const message = typeof raw.message === "string" && raw.message.trim() ? raw.message.trim().slice(0, 200) : undefined;
  const until = asDate(raw.until);
  return { mode: raw.mode as SiteStatusMode, ...(message ? { message } : {}), ...(until ? { until } : {}) };
}

function toSection(raw: unknown): SectionInstance | null {
  if (!isRecord(raw)) return null;
  const { id, type, hidden, variant, props } = raw;
  if (typeof id !== "string" || !ID_RE.test(id)) return null;
  if (typeof type !== "string" || !TYPE_RE.test(type)) return null;
  const schedule = toSchedule(raw.schedule);
  return {
    id,
    type,
    ...(hidden === true ? { hidden: true } : {}),
    ...(typeof variant === "string" ? { variant } : {}),
    ...(isRecord(props) ? { props } : {}),
    ...(schedule ? { schedule } : {}),
  };
}

/**
 * Today's date ("YYYY-MM-DD") in the restaurant's time zone. Server render
 * and the guest's browser agree on it (no hydration flip at midnight), and a
 * guest abroad sees the same day the restaurant does. Unknown zones fall back to UTC.
 */
export function todayIn(timeZone: unknown, now: Date = new Date()): string {
  const zone = typeof timeZone === "string" && timeZone.trim() ? timeZone.trim() : "UTC";
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/** True when the section's date window (if any) includes `today`. Dates are inclusive. */
export function isScheduledOn(section: Pick<SectionInstance, "schedule">, today: string): boolean {
  const s = section.schedule;
  if (!s) return true;
  if (s.from && today < s.from) return false;
  if (s.to && today > s.to) return false;
  return true;
}

/** The site status a guest should see today, or null when the site is open (or a closure has ended). */
export function activeSiteStatus(rawDocument: unknown, today: string): SiteStatus | null {
  const status = parseSiteDocument(rawDocument)?.status;
  if (!status || status.mode === "open") return null;
  if (status.until && today >= status.until) return null;
  return status;
}

/**
 * Read a stored site document defensively. The backend validates on save, but
 * guest pages must never crash on an old or hand-edited row, so anything that
 * doesn't look right is treated as "not customised".
 */
export function parseSiteDocument(raw: unknown): SiteDocument | null {
  if (!isRecord(raw) || raw.version !== 1) return null;
  const doc: SiteDocument = { version: 1 };
  for (const kind of ["landing", "menu"] as const) {
    const page = raw[kind];
    if (isRecord(page) && Array.isArray(page.sections)) {
      const seen = new Set<string>();
      const sections: SectionInstance[] = [];
      for (const s of page.sections) {
        const section = toSection(s);
        if (section && !seen.has(section.id)) {
          seen.add(section.id);
          sections.push(section);
        }
      }
      doc[kind] = { sections };
    }
  }
  const status = toStatus(raw.status);
  if (status) doc.status = status;
  if (typeof raw.kit === "string" && /^[a-z0-9-]{1,40}$/.test(raw.kit)) doc.kit = raw.kit;
  // Kept on every round trip: the studio re-saves parsed documents, so dropping
  // this would silently remove the owner's festival looks.
  const occasion = parseOccasion(raw.occasion);
  if (occasion) doc.occasion = occasion;
  return doc;
}

/** The layout a page has before the owner touches it: every catalogue section, in catalogue order. */
export function defaultSections(catalogue: readonly SectionCatalogueEntry[]): SectionInstance[] {
  return catalogue.map((d) => ({ id: d.type, type: d.type, ...(d.defaultVisible ? {} : { hidden: true }) }));
}

/**
 * The full ordered section list for a page: the saved layout, plus any
 * catalogue section the saved layout doesn't mention yet (added to the
 * platform after the owner saved). Those slot in right after the section that
 * precedes them in the default order, so they appear where they'd be expected.
 * Unknown types are kept (the editor must not drop them); the renderer skips them.
 */
export function resolvePageSections(
  rawDocument: unknown,
  kind: SitePageKind,
  catalogue: readonly SectionCatalogueEntry[],
): SectionInstance[] {
  const saved = parseSiteDocument(rawDocument)?.[kind]?.sections;
  if (!saved) return defaultSections(catalogue);

  const result = [...saved];
  const presentTypes = new Set(result.map((s) => s.type));
  const usedIds = new Set(result.map((s) => s.id));

  catalogue.forEach((entry, index) => {
    if (presentTypes.has(entry.type)) return;

    let id = entry.type;
    for (let n = 2; usedIds.has(id); n += 1) id = `${entry.type}-${n}`;

    const missing: SectionInstance = { id, type: entry.type, ...(entry.defaultVisible ? {} : { hidden: true }) };

    // After the nearest earlier catalogue section that is on the page; otherwise at the top.
    let insertAt = 0;
    for (let i = index - 1; i >= 0; i -= 1) {
      const prevType = catalogue[i].type;
      const pos = findLastIndex(result, (s) => s.type === prevType);
      if (pos !== -1) {
        insertAt = pos + 1;
        break;
      }
    }
    result.splice(insertAt, 0, missing);
    presentTypes.add(entry.type);
    usedIds.add(id);
  });

  return result;
}

function findLastIndex<T>(arr: readonly T[], pred: (v: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i -= 1) if (pred(arr[i])) return i;
  return -1;
}

/**
 * Sections a guest actually sees: not hidden, known to the catalogue and, when
 * `today` is given, inside their date window.
 */
export function visibleSections(
  sections: readonly SectionInstance[],
  known: { has(type: string): boolean },
  today?: string,
): SectionInstance[] {
  const shown = sections.filter((s) => !s.hidden && known.has(s.type) && (today === undefined || isScheduledOn(s, today)));
  // The footer always closes the page, whatever order was saved (older kits put sections after it).
  return [...shown.filter((s) => s.type !== "footer"), ...shown.filter((s) => s.type === "footer")];
}
