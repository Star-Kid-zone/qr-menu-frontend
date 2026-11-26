/**
 * Icon drawings (docs/site-system/PLAN.md §2.7). Each icon is drawn once on a
 * 24×24 grid as layers; the skin's icon style decides how they are painted:
 *
 *   o  outline   strokes that describe the shape (every style)
 *   f  fill      closed area for filled / duotone / engraved (defaults to `o`)
 *   d  detail    inner strokes (knocked out in "filled")
 *   s  solid     always filled in every style (e.g. the dot in a veg mark)
 *
 * Original drawings for this product. Keep strokes inside 2…22.
 */
import { FOOD, DRINKS, SHOP, CATALOG_ALIASES } from './glyphsCatalog';
import { FESTIVAL } from './glyphsFestival';

export interface Glyph {
  o: string;
  f?: string;
  d?: string;
  s?: string;
}

/** Circle as a path. */
const c = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

/** Rounded rectangle as a path. */
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

/** Teardrop seed pointing up, centred on (cx, cy). */
const seed = (cx: number, cy: number) => `M${cx} ${cy - 2.6}c1.5 1.1 1.5 4.1 0 5.2-1.5-1.1-1.5-4.1 0-5.2z`;

const PIN = 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z';
const SHIELD_SQ = rr(4, 4, 16, 16, 1.5);
const CALENDAR = rr(3.5, 5, 17, 15.5, 2);
const CARD = rr(2.5, 5.5, 19, 13, 2);

// ----------------------------------------------------------------- site / UI (24)
const UI: Record<string, Glyph> = {
  clock: { o: c(12, 12, 9), d: 'M12 7v5l3.2 2' },
  pin: { o: PIN, d: c(12, 9.5, 2.5) },
  phone: { o: 'M6.6 3.5h2.6l1.4 4.3-2 1.6a12 12 0 0 0 6 6l1.6-2 4.3 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z' },
  mail: { o: rr(3, 5.5, 18, 13, 2), d: 'M3.6 7.2 12 13l8.4-5.8' },
  chat: { o: 'M4 20.2l1.3-4.1A8.5 8.5 0 1 1 8.5 19z', d: 'M9 9.2c.4 2.6 2.4 4.8 5.2 5.6l1.3-1.3' },
  map: { o: 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z', d: 'M9 4v13.5M15 6.5V20' },
  directions: { o: 'M12 2.8 21.2 12 12 21.2 2.8 12z', d: 'M9 14.5v-2.5a1.5 1.5 0 0 1 1.5-1.5H15M13 8.5l2 2-2 2' },
  menu: {
    o: 'M4 4.5h6.5A1.5 1.5 0 0 1 12 6v14a1.5 1.5 0 0 0-1.5-1.5H4zM20 4.5h-6.5A1.5 1.5 0 0 0 12 6v14a1.5 1.5 0 0 1 1.5-1.5H20z',
    d: 'M6.5 8.5h3M6.5 11.5h3M14.5 8.5h3M14.5 11.5h3',
  },
  tag: { o: 'M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.5 1.5 0 0 1 0 2.1l-7 7a1.5 1.5 0 0 1-2.1 0z', d: c(8, 8, 1.5) },
  image: { o: rr(3, 4.5, 18, 15, 2), d: `M3.6 16 8.5 11l4 4 2.5-2.5 5.4 5.4${c(15.5, 9, 1.5)}` },
  star: { o: 'M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z' },
  question: { o: c(12, 12, 9), d: 'M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8M12 16.8v.2' },
  calendar: { o: CALENDAR, d: 'M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2' },
  medal: {
    o: `${c(12, 14.5, 5.5)}M8.6 10.3 6 3h4l2 5M15.4 10.3 18 3h-4l-2 5`,
    f: c(12, 14.5, 5.5),
    d: 'M12 11.8l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z',
  },
  toque: {
    o: 'M7 14.5a4 4 0 0 1-.6-7.9 5.6 5.6 0 0 1 11.2 0A4 4 0 0 1 17 14.5V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z',
    d: 'M7 16.5h10M10 11v3M14 11v3',
  },
  card: { o: CARD, d: 'M2.5 9.5h19M6 15h4' },
  qr: {
    o: `${rr(3.5, 3.5, 6.5, 6.5, 1)}${rr(14, 3.5, 6.5, 6.5, 1)}${rr(3.5, 14, 6.5, 6.5, 1)}`,
    d: 'M14 14h2.5M14 14v2.5M18.5 14h2M20.5 14v2.5M14 18.5v2M16.5 20.5h4M18 17.5v.5',
    s: `${rr(5.75, 5.75, 2, 2, 0.4)}${rr(16.25, 5.75, 2, 2, 0.4)}${rr(5.75, 16.25, 2, 2, 0.4)}`,
  },
  share: { o: `${c(18, 5.5, 2.5)}${c(6, 12, 2.5)}${c(18, 18.5, 2.5)}`, d: 'M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1' },
  search: { o: c(10.5, 10.5, 6.5), d: 'M15.5 15.5 21 21' },
  filter: { o: 'M3.5 5h17L14 12.5V19l-4 2v-8.5z' },
  close: { o: 'M5.5 5.5l13 13M18.5 5.5l-13 13' },
  'arrow-right': { o: 'M4 12h16M14 6l6 6-6 6' },
  globe: { o: c(12, 12, 9), d: 'M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' },
  heart: { o: 'M12 20s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z' },
};

// ----------------------------------------------------------------- amenities (20) — ids match AMENITY_IDS
const AMENITIES: Record<string, Glyph> = {
  wifi: { o: 'M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.6a5 5 0 0 1 6.8 0', s: c(12, 19, 1.3) },
  parking: { o: rr(3.5, 3.5, 17, 17, 3), d: 'M9.5 17V7.5H13a3 3 0 0 1 0 6H9.5' },
  valet: { o: c(8, 15.5, 4.5), d: 'M11.2 12.3 20 3.5M17 6.5l2.5 2.5M14.5 9l2 2', s: c(8, 15.5, 1.2) },
  wheelchair: { o: `${c(10.5, 15.5, 5)}`, f: c(10.5, 15.5, 5), d: 'M10.5 7v5.5H16l2.5 5 1.8-.8', s: c(10.5, 4.5, 1.7) },
  'baby-changing': {
    o: 'M9 8h6v11.5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zM10 8V6.5a2 2 0 0 1 4 0V8M11 4.5V3h2v1.5',
    f: 'M9 8h6v11.5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z',
    d: 'M9 12h3M9 15h3',
  },
  pets: {
    o: `M12 12.5c-2.8 0-5 2.6-5 4.8 0 1.7 1.6 2.4 3 1.9.9-.3 1.4-.4 2-.4s1.1.1 2 .4c1.4.5 3-.2 3-1.9 0-2.2-2.2-4.8-5-4.8z${c(7, 9, 1.8)}${c(10, 5.8, 1.8)}${c(14, 5.8, 1.8)}${c(17, 9, 1.8)}`,
  },
  'outdoor-seating': { o: 'M3.5 9.5a8.5 5 0 0 1 17 0z', d: 'M12 9.5V21M7 15h10M8 21l1-6M16 21l-1-6' },
  'private-dining': { o: 'M4 17a8 8 0 0 1 16 0zM2.5 20h19', f: 'M4 17a8 8 0 0 1 16 0z', d: 'M12 9V7.5M10.5 7.5h3M7.5 14a5 5 0 0 1 3-3.5' },
  'live-music': { o: `M9 18V5.5l11-2V16${c(6.5, 18, 2.5)}${c(17.5, 16, 2.5)}`, f: `${c(6.5, 18, 2.5)}${c(17.5, 16, 2.5)}`, d: 'M9 9l11-2' },
  'sports-screens': { o: rr(2.5, 5, 19, 12.5, 2), d: `M8 21h8M12 17.5V21${c(12, 11.2, 2.8)}` },
  'kids-area': { o: 'M12 15.5c-3.3 0-6-3-6-6.5a6 6 0 0 1 12 0c0 3.5-2.7 6.5-6 6.5z', d: 'M11 15.5h2l-1 1.5M12 17c-1 1.5 1 2.5 0 4M9.5 7.5a3 3 0 0 1 2-2' },
  'smoking-area': { o: rr(2.5, 13.5, 19, 4, 1), d: 'M16 13.5v4M18 3.5c0 2 2 2 2 4s-2 2-2 4M15 5.5c0 1.5 1.5 1.5 1.5 3' },
  'air-conditioning': {
    o: 'M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6',
    d: 'M9.5 4 12 6l2.5-2M9.5 20 12 18l2.5 2M4.2 10.4l3-.8-.8-3M19.8 13.6l-3 .8.8 3M4.2 13.6l3 .8-.8 3M19.8 10.4l-3-.8.8-3',
  },
  'card-payment': { o: CARD, d: 'M2.5 9.5h19M6 15h4M15.5 13.3a2.5 2.5 0 0 1 0 3.4M17.6 12a4.5 4.5 0 0 1 0 6' },
  'prayer-room': { o: rr(5, 2.5, 14, 19, 1.5), d: 'M8.5 16v-5.5a3.5 3.5 0 0 1 7 0V16zM8 19h8' },
  'family-section': {
    o: `${c(7.5, 7.5, 2.6)}${c(16.5, 7.5, 2.6)}${c(12, 13.5, 2)}`,
    d: 'M3.5 20.5V18a4.5 4.5 0 0 1 7-3.7M20.5 20.5V18a4.5 4.5 0 0 0-7-3.7M9 20.5v-1a3 3 0 0 1 6 0v1',
  },
  'halal-certified': { o: c(12, 12, 9.2), d: `${c(12, 12, 7)}`, s: 'M13.8 8.4a4 4 0 1 0 0 7.2 3.3 3.3 0 1 1 0-7.2z' },
  'pure-veg': { o: SHIELD_SQ, s: c(12, 12, 4) },
  'jain-options': {
    o: 'M8.5 21 4.9 14.6a1.5 1.5 0 0 1 2.5-1.6L9 15V5a1.5 1.5 0 0 1 3 0v6V4a1.5 1.5 0 0 1 3 0v7V6a1.5 1.5 0 0 1 3 0v9a6 6 0 0 1-6 6z',
    d: `${c(13.5, 16, 1.7)}`,
  },
  reservations: { o: CALENDAR, d: 'M3.5 9.5h17M8 3v4M16 3v4M9 14.5l2 2 4-4' },
};

// ----------------------------------------------------------------- dietary & allergens (20)
const DIETARY: Record<string, Glyph> = {
  veg: { o: SHIELD_SQ, s: c(12, 12, 4) },
  'non-veg': { o: SHIELD_SQ, s: 'M12 7.4l4.6 8.1H7.4z' },
  egg: { o: 'M12 3.5c3.2 0 6.5 5.2 6.5 9.5a6.5 6.5 0 0 1-13 0c0-4.3 3.3-9.5 6.5-9.5z', d: 'M9.3 14.3a2.7 2.7 0 0 0 2.7 2.7' },
  vegan: { o: 'M5 19C5 9.5 11 4.5 20 4.5c0 9-5 14.5-15 14.5z', d: 'M5 19l8.5-8.5' },
  gluten: {
    o: 'M12 21V7.5M12 8c-2.2-.6-3.4-2.3-3.4-4.5 2.2.4 3.4 2 3.4 4.5zM12 8c2.2-.6 3.4-2.3 3.4-4.5-2.2.4-3.4 2-3.4 4.5zM12 12.5c-2.2-.6-3.4-2.3-3.4-4.5 2.2.4 3.4 2 3.4 4.5zM12 12.5c2.2-.6 3.4-2.3 3.4-4.5-2.2.4-3.4 2-3.4 4.5zM12 17c-2.2-.6-3.4-2.3-3.4-4.5 2.2.4 3.4 2 3.4 4.5zM12 17c2.2-.6 3.4-2.3 3.4-4.5-2.2.4-3.4 2-3.4 4.5z',
  },
  // A curled shrimp: crescent body (r 7 → 3.5 around 12,12), tail fan at the top, antennae at the head.
  crustaceans: {
    o: 'M15.5 5.94A7 7 0 1 1 5.42 14.39L8.71 13.2A3.5 3.5 0 1 0 13.75 8.97ZM15.5 5.94l3.6-2.8.3 4.6z',
    f: 'M15.5 5.94A7 7 0 1 1 5.42 14.39L8.71 13.2A3.5 3.5 0 1 0 13.75 8.97ZM15.5 5.94l3.6-2.8.3 4.6z',
    d: 'M15.29 13.2l3.29 1.19M13.75 15.03l1.75 3.03M11.39 15.45l-.61 3.44M5.42 14.39c-1.6.6-2.6 2.2-2.9 4.6M6.6 16.2c-.4 1.6 0 3.3 1.2 4.6',
    s: c(7.6, 14.3, 0.7),
  },
  fish: {
    o: 'M6 12c2.4-3.6 5.6-5.8 9-5.8 3.2 0 5.6 2.6 6.5 5.8-.9 3.2-3.3 5.8-6.5 5.8-3.4 0-6.6-2.2-9-5.8zM6 12 2.5 8.5v7z',
    f: 'M6 12c2.4-3.6 5.6-5.8 9-5.8 3.2 0 5.6 2.6 6.5 5.8-.9 3.2-3.3 5.8-6.5 5.8-3.4 0-6.6-2.2-9-5.8zM6 12 2.5 8.5v7z',
    d: 'M11 9.4c.8 1.6.8 3.6 0 5.2',
    s: c(17, 11, 0.9),
  },
  peanuts: {
    o: 'M12 2.5a4.2 4.2 0 0 1 4.2 4.2c0 1.6-1 2.7-1 4.1 0 1.2 1 2.4 1 4.1a4.2 4.2 0 0 1-8.4 0c0-1.7 1-2.9 1-4.1 0-1.4-1-2.5-1-4.1A4.2 4.2 0 0 1 12 2.5z',
    d: 'M10.2 6.5h.01M13.8 6.5h.01M10.2 15h.01M13.8 15h.01M12 10.8h.01',
  },
  soy: { o: 'M4 17.5C6 9 12 4.5 20 4.5c-.5 8-6 13.5-14.5 14z', d: `${c(8.5, 15, 1.6)}${c(12, 11.5, 1.6)}${c(15.5, 8, 1.6)}` },
  milk: { o: 'M8 9.5 10 6V3.5h4V6l2 3.5V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z', d: 'M8 13h8' },
  nuts: { o: 'M6 10a6 6 0 0 1 12 0zM7 10c0 6 5 10.5 5 10.5S17 16 17 10', d: 'M12 4V2.5M9 7.5h6' },
  celery: {
    o: 'M9 21V9.5M12 21V8M15 21V9.5M9 9.5C7 8 6.5 5.5 7.5 3.5 9 5 9.5 7 9 9.5zM12 8c-1-2-1-4.5.5-6 1.3 1.8 1 4-.5 6zM15 9.5c.5-2.4 1.8-4.2 3.8-4.8.2 2.2-1.3 4-3.8 4.8z',
  },
  mustard: {
    o: 'M7 9h10v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5zM8 9V6.5h8V9M9.5 6.5v-3h5v3',
    f: 'M7 9h10v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5z',
    d: 'M9.5 14h5',
  },
  sesame: { o: `${seed(8, 8.5)}${seed(16, 8.5)}${seed(12, 15.5)}` },
  sulphites: { o: `${c(12, 6, 2.5)}${c(6, 17, 2.5)}${c(18, 17, 2.5)}`, d: 'M11 8.3 7.2 14.8M13 8.3l3.8 6.5M8.5 17h7' },
  lupin: { o: 'M12 21V7M12 16l-3-2M12 18.5l3-2', d: `${c(12, 4.5, 1.5)}${c(9.5, 8, 1.5)}${c(14.5, 8, 1.5)}${c(9.5, 11.5, 1.5)}${c(14.5, 11.5, 1.5)}` },
  molluscs: { o: 'M3 15.5a9 9 0 0 1 18 0L18.5 18h-13z', d: 'M12 18V8M8.5 18 7 9.6M15.5 18 17 9.6' },
  chili: {
    o: 'M16 7c1.8 1.4 2.4 4 1 7.2C15 19 9 21.5 4 21c4-1.5 7.5-4.5 8.5-9.5.5-2.7 1.8-4.2 3.5-4.5z',
    d: 'M16 7c0-2 1-3.5 3-4',
  },
  flame: {
    o: 'M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4.5-4-6.5-4.5-11-2.5 2-3.5 4-3.5 6.5-1-1-1.6-2-1.7-3.3C7 9.5 5.5 12 5.5 15a6.5 6.5 0 0 0 6.5 6.5z',
    d: 'M12 18.5a2.5 2.5 0 0 1-2.5-2.5c0-1.6 1.3-2.4 2-4 1 1.5 3 2.4 3 4a2.5 2.5 0 0 1-2.5 2.5z',
  },
  scale: { o: 'M5.5 8h13l2 12.5h-17z', d: `${c(12, 5.5, 2)}M10 14.5h4` },
};

export const GLYPHS: Readonly<Record<string, Glyph>> = { ...UI, ...AMENITIES, ...DIETARY, ...FOOD, ...DRINKS, ...SHOP, ...FESTIVAL };

/** Other names that should draw an existing icon (stored allergen ids, synonyms). */
const GLYPH_ALIASES: Readonly<Record<string, string>> = {
  eggs: 'egg',
  halal: 'halal-certified',
  vegetarian: 'veg',
  spicy: 'chili',
  calories: 'flame',
  hours: 'clock',
  location: 'pin',
  whatsapp: 'chat',
  email: 'mail',
  offers: 'tag',
  gallery: 'image',
  reviews: 'star',
  faq: 'question',
  events: 'calendar',
  awards: 'medal',
  team: 'toque',
  website: 'globe',
  ...CATALOG_ALIASES,
};

export const GLYPH_GROUPS = {
  ui: Object.keys(UI),
  amenities: Object.keys(AMENITIES),
  dietary: Object.keys(DIETARY),
  food: Object.keys(FOOD),
  drinks: Object.keys(DRINKS),
  shop: Object.keys(SHOP),
  festival: Object.keys(FESTIVAL),
} as const;

export function getGlyph(name: string): Glyph | null {
  return GLYPHS[name] ?? GLYPHS[GLYPH_ALIASES[name] ?? ''] ?? null;
}
