/**
 * Guest-site look system (docs/site-system/PLAN.md).
 *
 *   1. LAYOUT         structure + motion            (code)
 *   2. SKIN           colour, type, shape, icons…   (data)
 *   3. BUSINESS TYPE  words, icons, item fields     (data)
 *   4. OCCASION       festival overlay, dated       (data)
 *   5. OWNER          explicit choices              (db)
 *
 * `resolveSiteLook` combines them; components only ever read the result
 * (CSS variables + SiteLookContext), never a layer directly.
 */

/** The nine colour roles shared by the landing and menu pages (same as kits). */
export interface Palette {
  bg: string;
  surface: string;
  accent: string;
  accentText: string;
  text: string;
  textMuted: string;
  border: string;
  band: string;
  footer: string;
}

export type IconStyle = 'line' | 'fine-line' | 'filled' | 'duotone' | 'neon' | 'engraved' | 'hand-drawn' | 'pixel';

export const SKIN_FAMILIES = [
  'royal-classic', 'luxury-minimal', 'modern-minimal', 'editorial', 'warm-rustic', 'botanical',
  'bold-pop', 'retro-vintage', 'neon-night', 'futurist', 'soft-glass-clay', 'pixel-90s',
] as const;
export type SkinFamily = (typeof SKIN_FAMILIES)[number];

export type Tempo = 1 | 1.2 | 1.4 | 1.6;

export interface OrnamentSet {
  divider: string;
  frame: string;
  corner: string;
  pattern: string;
}

export interface SkinDefinition {
  id: string;
  family: SkinFamily;
  label: string;
  description: string;
  palette: Palette;
  fonts: { display: string; body: string };
  headingClass: string;
  shape: { radius: number; card: string; border: 'none' | 'hairline' | 'double'; shadow: 'none' | 'soft' | 'lifted' };
  iconStyle: IconStyle;
  ornaments: OrnamentSet;
  background: { texture: string; lottie?: string };
  heroOverlay: string;
  tempo: Tempo;
  /** The old `landing_theme` slug this skin reproduces (converted skins only). */
  legacyThemeSlug?: string;
}

export const BUSINESS_FAMILIES = ['restaurants', 'quick-casual', 'cafes-sweets', 'bars-lounges', 'shops', 'other'] as const;
export type BusinessFamily = (typeof BUSINESS_FAMILIES)[number];

export interface BusinessTerms {
  catalogLabel: string;
  itemSingular: string;
  itemPlural: string;
  featuredSectionLabel: string;
  popularSectionLabel: string;
  ctaLabel: string;
  /** Title of the "curated-list" section, e.g. "Sommelier picks", "On tap this week". */
  curatedListTitle: string;
}

export interface BusinessTypeDefinition {
  id: string;
  family: BusinessFamily;
  label: string;
  description: string;
  terms: BusinessTerms;
  attributeSets: AttributeSetId[];
  /** Suggested labels when the owner adds several prices, e.g. ["Glass", "Bottle"]. */
  priceOptionPresets: string[][];
  /** Category name keywords (EN / HI / AR) → icon name. First match wins. */
  categoryIcons: Array<{ match: string[]; icon: string }>;
  defaultIcon: string;
  copy: { tagline: string; badge: string; marquee: string };
  recommended: { layouts: string[]; skins: string[]; menuStructure: string };
  badges: Array<'halal' | 'pure-veg' | 'jain' | 'veg-marks'>;
  alcohol?: { ageNotice: 18 | 21 };
}

export type OccasionRegion = 'india' | 'gulf' | 'western' | 'general';
type OccasionIntensity = 'subtle' | 'full';

export interface OccasionDefinition {
  id: string;
  region: OccasionRegion;
  label: string;
  /** 3–4 decoration tints; the first is used as the accent at "full" intensity. */
  tints: string[];
  /** Readable colour on top of tints[0]. */
  ink: string;
  ornaments: { corner: string; divider: string; border: string };
  lottie?: string;
  bannerSuggestion: string;
  specialsCategorySuggestion: string;
  badgeIcon: string;
}

/** The occasion the owner switched on, stored in `site_document.occasion`. */
export interface OccasionEntry {
  id: string;
  intensity: OccasionIntensity;
  banner?: string;
}

export type MotionLevel = 'off' | 'subtle' | 'full';

/** Everything below the layout, resolved for one page render. */
export interface SiteLook {
  layout: string;
  skin: SkinDefinition;
  palette: Palette;
  fonts: { display: string; body: string };
  radius: number;
  tempo: Tempo;
  iconStyle: IconStyle;
  ornaments: OrnamentSet;
  business: BusinessTypeDefinition;
  occasion: { definition: OccasionDefinition; entry: OccasionEntry } | null;
  motion: MotionLevel;
  /** Owner-chosen icon per menu category (lower-cased name → icon); wins over keyword matching. */
  categoryIcons: Readonly<Record<string, string>>;
}

// ---- owner-managed content (public payload) ----

export interface PublicAward {
  id: string; title: string; publisher: string | null; year: number | null; url: string | null; logoUrl: string | null;
}
export interface PublicTeamMember {
  id: string; name: string; role: string | null; bio: string | null; photoUrl: string | null;
}
export interface PublicSiteEvent {
  id: string; title: string; description: string | null; startsAt: string; endsAt: string | null;
  imageUrl: string | null; linkUrl: string | null;
}
export const AMENITY_IDS = [
  'wifi', 'parking', 'valet', 'wheelchair', 'baby-changing', 'pets', 'outdoor-seating',
  'private-dining', 'live-music', 'sports-screens', 'kids-area', 'smoking-area', 'air-conditioning',
  'card-payment', 'prayer-room', 'family-section', 'halal-certified', 'pure-veg', 'jain-options', 'reservations',
] as const;
export type AmenityId = (typeof AMENITY_IDS)[number];

export type AttributeSetId =
  | 'food' | 'wine' | 'beer' | 'spirits' | 'cheese' | 'coffee'
  | 'bakery' | 'japanese' | 'grill' | 'product' | 'shisha' | 'hamper';
