import type { Menu } from "@/types";
import type { RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import { toSafeExternalUrl } from "@/utils/url";
import { AMENITY_IDS, type AmenityId, type PublicAward, type PublicSiteEvent, type PublicTeamMember } from "../types";

/**
 * Owner-managed content for the new landing sections (docs/site-system/PLAN.md
 * §2.3 / §2.9), shaped for display. Pure and time-zone aware, so the server
 * render and the browser agree.
 */

export const AMENITY_LABELS: Readonly<Record<AmenityId, string>> = {
  wifi: "Free Wi-Fi",
  parking: "Parking",
  valet: "Valet parking",
  wheelchair: "Wheelchair access",
  "baby-changing": "Baby changing",
  pets: "Pets welcome",
  "outdoor-seating": "Outdoor seating",
  "private-dining": "Private dining",
  "live-music": "Live music",
  "sports-screens": "Sports on screen",
  "kids-area": "Kids' area",
  "smoking-area": "Smoking area",
  "air-conditioning": "Air conditioned",
  "card-payment": "Cards accepted",
  "prayer-room": "Prayer room",
  "family-section": "Family section",
  "halal-certified": "Halal certified",
  "pure-veg": "Pure vegetarian",
  "jain-options": "Jain options",
  reservations: "Takes reservations",
};

export interface AmenityView {
  id: AmenityId;
  label: string;
  note?: string;
  /** Icon name (amenity icons share the amenity ids). */
  icon: string;
}

export interface EventView extends PublicSiteEvent {
  /** "12" */
  day: string;
  /** "Dec" */
  month: string;
  /** "Fri" */
  weekday: string;
  /** "Friday 12 December" */
  dateLabel: string;
  /** "7:00 pm", or "7:00 – 10:30 pm"; "" when the event has no time of day. */
  timeLabel: string;
  linkUrl: string | null;
}

export interface DishView {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  category: string;
  /** "Half ₹380 · Full ₹620" style options, when the item has sizes. */
  options: Array<{ label: string; price: string }>;
}

export interface SiteContentModel {
  awards: PublicAward[];
  team: PublicTeamMember[];
  events: EventView[];
  amenities: AmenityView[];
  /** Today's weekday name in the restaurant's time zone ("Monday"). */
  todayName: string;
  timeZone: string;
}

const KNOWN_AMENITIES = new Set<string>(AMENITY_IDS);

export function amenityViews(raw: unknown): AmenityView[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: AmenityView[] = [];
  for (const a of raw) {
    const id = a && typeof a === "object" ? (a as { id?: unknown }).id : null;
    if (typeof id !== "string" || !KNOWN_AMENITIES.has(id) || seen.has(id)) continue;
    seen.add(id);
    const note = (a as { note?: unknown }).note;
    out.push({ id: id as AmenityId, label: AMENITY_LABELS[id as AmenityId], icon: id, ...(typeof note === "string" && note.trim() ? { note: note.trim() } : {}) });
  }
  return out;
}

function zoneOf(tz: unknown): string {
  const z = typeof tz === "string" && tz.trim() ? tz.trim() : "UTC";
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: z });
    return z;
  } catch {
    return "UTC";
  }
}

function part(date: Date, timeZone: string, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(date);
}

/** True when the timestamp is exactly midnight in the zone (an all-day event entered without a time). */
function isMidnight(date: Date, timeZone: string): boolean {
  return part(date, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) === "00:00";
}

function timeOf(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(date).toLowerCase().replace(/\s+/g, " ");
}

export function eventView(e: PublicSiteEvent, timeZone: string): EventView | null {
  const start = new Date(e.startsAt);
  if (Number.isNaN(start.getTime())) return null;
  const end = e.endsAt ? new Date(e.endsAt) : null;
  const sameDay = end && !Number.isNaN(end.getTime()) && part(end, timeZone, { dateStyle: "short" }) === part(start, timeZone, { dateStyle: "short" });
  let timeLabel = isMidnight(start, timeZone) ? "" : timeOf(start, timeZone);
  if (timeLabel && sameDay && end) timeLabel = `${timeLabel} – ${timeOf(end, timeZone)}`;
  return {
    ...e,
    day: part(start, timeZone, { day: "numeric" }),
    month: part(start, timeZone, { month: "short" }),
    weekday: part(start, timeZone, { weekday: "short" }),
    dateLabel: part(start, timeZone, { weekday: "long", day: "numeric", month: "long" }),
    timeLabel,
    linkUrl: e.linkUrl ? toSafeExternalUrl(e.linkUrl) || null : null,
  };
}

export function buildSiteContent(data: RawPublicSiteData, now: Date = new Date()): SiteContentModel {
  const settings = (data.settings ?? {}) as Record<string, unknown>;
  const timeZone = zoneOf(settings.timezone);
  const awards = (Array.isArray(data.awards) ? data.awards : []).filter((a) => a && a.title).map((a) => ({ ...a, url: a.url ? toSafeExternalUrl(a.url) || null : null }));
  const team = (Array.isArray(data.team) ? data.team : []).filter((m) => m && m.name);
  const events = (Array.isArray(data.events) ? data.events : [])
    .map((e) => eventView(e, timeZone))
    .filter((e): e is EventView => Boolean(e))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return {
    awards,
    team,
    events,
    amenities: amenityViews(settings.amenities),
    todayName: part(now, timeZone, { weekday: "long" }),
    timeZone,
  };
}

/* ───────────────────────── menu items as dishes ───────────────────────── */

type Row = Menu & { title?: string; name?: string; imageUrl?: string };

export function itemImage(m: Row): string | null {
  const first = m?.images?.[0];
  const fromImages = typeof first === "string" ? first : first && typeof first === "object" ? (first as { url?: string }).url : undefined;
  return m?.image_url || m?.imageUrl || fromImages || null;
}

function dishView(m: Row, currency: string): DishView {
  const options = Array.isArray(m.priceOptions)
    ? m.priceOptions.filter((o) => o && o.label && o.price).map((o) => ({ label: o.label, price: `${currency}${o.price}` }))
    : [];
  return {
    id: m.id,
    name: (m.item ?? m.name ?? m.title ?? "") as string,
    description: (m.description ?? "") as string,
    price: m.price ? `${currency}${m.price}` : "",
    image: itemImage(m),
    category: (m.category ?? "") as string,
    options,
  };
}

/**
 * The curated-list section: the owner's picked items, in their order
 * (`props.itemIds`, ≤12). Items that no longer exist are skipped.
 */
export function curatedList(props: Record<string, unknown> | undefined, menuItems: readonly Menu[], currency: string, fallbackTitle: string): { title: string; items: DishView[] } {
  const ids = Array.isArray(props?.itemIds) ? (props!.itemIds as unknown[]).map(String).slice(0, 12) : [];
  const byId = new Map(menuItems.map((m) => [String(m.id), m]));
  const items = ids.map((id) => byId.get(id)).filter((m): m is Menu => Boolean(m)).map((m) => dishView(m as Row, currency));
  const title = typeof props?.title === "string" && props.title.trim() ? props.title.trim().slice(0, 60) : fallbackTitle;
  return { title, items };
}
