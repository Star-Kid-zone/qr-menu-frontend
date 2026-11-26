import type {
  BusinessTypeDefinition,
  MotionLevel,
  OccasionDefinition,
  OccasionEntry,
  Palette,
  SiteLook,
  SkinDefinition,
} from './types';

/**
 * Combines the five layers into the look one page renders with
 * (docs/site-system/PLAN.md §1.1). Precedence, lowest → highest:
 *
 *   skin  <  business type  <  occasion  <  owner
 *
 * Rules enforced here (and in resolveSiteLook.test.ts):
 *  1. The business type never changes colours, fonts or shapes.
 *  2. An occasion at "subtle" only adds decoration tints (--occ-*); the
 *     page palette is untouched. At "full" it sets the accent, which wins
 *     over the owner's accent because "full" is itself the owner's choice.
 *  3. The layout key is carried through; layouts read tokens only.
 *  4. Owner values override the skin wherever they are non-empty.
 */

interface OwnerOverrides {
  palette?: Partial<Palette>;
  fonts?: Partial<{ display: string; body: string }>;
  /** Owner's animation setting; reduced-motion users always get "off". */
  motion?: MotionLevel;
  /** Owner-chosen icon per menu category (lower-cased name → icon). */
  categoryIcons?: Readonly<Record<string, string>>;
}

export interface ResolveInput {
  layout: string;
  skin: SkinDefinition;
  business: BusinessTypeDefinition;
  occasion: { definition: OccasionDefinition; entry: OccasionEntry } | null;
  owner?: OwnerOverrides;
  prefersReducedMotion?: boolean;
}

function mergeNonEmpty<T extends object>(base: T, over: Partial<T> | undefined): T {
  if (!over) return { ...base };
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (typeof v === 'string' && v.trim()) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export function resolveSiteLook(input: ResolveInput): SiteLook {
  const { skin, business, occasion, owner } = input;

  let palette = mergeNonEmpty(skin.palette, owner?.palette);
  if (occasion && occasion.entry.intensity === 'full' && occasion.definition.tints[0]) {
    palette = { ...palette, accent: occasion.definition.tints[0], accentText: occasion.definition.ink };
  }

  const fonts = mergeNonEmpty(skin.fonts, owner?.fonts);
  const motion: MotionLevel = input.prefersReducedMotion ? 'off' : owner?.motion ?? 'full';

  return {
    layout: input.layout,
    skin,
    palette,
    fonts,
    radius: skin.shape.radius,
    tempo: skin.tempo,
    iconStyle: skin.iconStyle,
    ornaments: skin.ornaments,
    business,
    occasion,
    motion,
    categoryIcons: owner?.categoryIcons ?? {},
  };
}
