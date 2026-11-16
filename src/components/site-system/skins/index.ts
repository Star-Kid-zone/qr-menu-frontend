import type { Palette, SkinDefinition, SkinFamily } from '../types';
import { SKIN_FAMILIES } from '../types';
import { FLAGSHIP_SKINS } from './flagship';
import { LEGACY_PREFIX, LEGACY_SKINS } from './legacy';

export { FAMILY_DEFAULTS } from './families';
export { LEGACY_FAMILY, LEGACY_PREFIX, skinFromTheme } from './legacy';

/** All 125 skins: 12 flagship first, then the 113 converted style templates. */
export const SKINS: readonly SkinDefinition[] = [...FLAGSHIP_SKINS, ...LEGACY_SKINS];

const BY_ID: ReadonlyMap<string, SkinDefinition> = new Map(SKINS.map((s) => [s.id, s]));

/** The fallback when nothing usable is saved (matches LayoutPage's fallback template). */
export const FALLBACK_SKIN_ID = `${LEGACY_PREFIX}swiss-international`;

export function getSkin(id: string | null | undefined): SkinDefinition | null {
  return (id && BY_ID.get(id)) || null;
}

/** Skins grouped by family, flagship first in each group (for the studio's style gallery). */
export function skinsByFamily(): Record<SkinFamily, SkinDefinition[]> {
  const out = Object.fromEntries(SKIN_FAMILIES.map((f) => [f, [] as SkinDefinition[]])) as Record<SkinFamily, SkinDefinition[]>;
  for (const s of SKINS) out[s.family].push(s);
  return out;
}

/**
 * The skin a site renders with — the adapter that keeps existing sites unchanged
 * (docs/site-system/PLAN.md §3 rule 4):
 *   1. `skin_id` (or `menu_skin_id` on the menu page) when set and known;
 *   2. else the converted skin of the saved style template (`landing_theme` / `menu_theme`);
 *   3. else the fallback.
 */
export function resolveSiteSkin(settings: Record<string, unknown> | null | undefined, page: 'landing' | 'menu' = 'landing'): SkinDefinition {
  const s = settings ?? {};
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  if (page === 'menu') {
    const menuSkin = getSkin(str(s.menu_skin_id));
    if (menuSkin) return menuSkin;
  }
  const chosen = getSkin(str(s.skin_id));
  if (chosen) return chosen;
  const legacySlug = str(page === 'menu' ? s.menu_theme || s.landing_theme : s.landing_theme);
  return getSkin(`${LEGACY_PREFIX}${legacySlug}`) ?? (getSkin(FALLBACK_SKIN_ID) as SkinDefinition);
}

/**
 * The owner's saved colours, as palette overrides. Until an owner edits them
 * they equal the template's values (kits and templates write these columns),
 * so this is how per-site colour edits keep winning over any skin.
 */
export function ownerPaletteFromSettings(settings: Record<string, unknown> | null | undefined, page: 'landing' | 'menu' = 'landing'): Partial<Palette> {
  const s = settings ?? {};
  const pick = (key: string) => (typeof s[key] === 'string' && (s[key] as string).trim() ? (s[key] as string) : undefined);
  const k = (name: string) => (page === 'menu' ? `menu_${name}` : name);
  // Mirrors how getRichContent maps the stored columns onto theme roles.
  return {
    bg: pick(k('accent_color')),
    surface: pick(k('secondary_color')),
    accent: pick(k('primary_color')),
    accentText: pick(k('accent_text_color')),
    text: pick(k('text_primary_color')),
    textMuted: pick(k('text_secondary_color')),
    border: pick(k('border_color')),
    band: pick(k('section_bg_color')),
    footer: pick(k('footer_bg_color')),
  };
}
