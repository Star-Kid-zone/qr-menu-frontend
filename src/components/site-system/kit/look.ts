import { resolveSiteLook } from "../resolveSiteLook";
import { parseOccasion } from "../occasions/activeOccasion";
import { getOccasion } from "../occasions/definitions";
import { todayIn } from "@/components/templates/sections/document";
import { categoryIconOverrides } from "@/components/templates/sections/menu/categories";
import { ownerPaletteFromSettings, resolveSiteSkin } from "../skins";
import { resolveBusinessType } from "../business-types";
import type { Palette, SiteLook } from "../types";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * The occasion the owner has switched on (`site_document.occasion`), resolved
 * to its definition. Unknown ids read as off. Never turned on automatically.
 */
function occasionFor(s: Record<string, unknown>) {
  const doc = s.site_document as { occasion?: unknown } | null | undefined;
  const entry = parseOccasion(doc && typeof doc === "object" ? doc.occasion : undefined);
  const definition = entry ? getOccasion(entry.id) : null;
  return entry && definition ? { definition, entry } : null;
}

/** The day a page renders for: today in the restaurant's time zone (dated sections, closed notices). */
export function siteToday(settings: Record<string, unknown> | null | undefined): string {
  return todayIn((settings ?? {}).timezone);
}
/**
 * The look a guest page renders with, from the saved settings alone (pure,
 * so the server and the browser agree), including the occasion that is on.
 *
 * Owner colours: the landing page uses the plain columns; the menu page uses
 * the `menu_*` columns, falling back to the plain ones (same as the menu
 * data hook does today).
 */
export function lookFromSettings(
  settings: Record<string, unknown> | null | undefined,
  layout: string,
  page: "landing" | "menu" = "landing",
): SiteLook {
  const s = settings ?? {};
  const landingOwner = ownerPaletteFromSettings(s, "landing");
  const owner: Partial<Palette> = page === "menu" ? { ...landingOwner, ...stripEmpty(ownerPaletteFromSettings(s, "menu")) } : landingOwner;
  const body = page === "menu" ? str(s.menu_font_family) || str(s.font_family) : str(s.font_family);
  return resolveSiteLook({
    layout,
    skin: resolveSiteSkin(s, page),
    business: resolveBusinessType(s),
    occasion: occasionFor(s),
    owner: { palette: owner, fonts: body ? { body } : undefined, categoryIcons: categoryIconOverrides(s.site_document) },
  });
}

function stripEmpty<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => typeof v === "string" && v.trim())) as Partial<T>;
}

const firstFamily = (stack: string | undefined) => stack?.match(/"([^"]+)"/)?.[1] ?? null;
const familyParam = (name: string) => encodeURIComponent(name).replace(/%20/g, "+");

/**
 * Google Fonts stylesheet URLs for a look: one request per face, because the
 * API rejects a whole request when any family lacks a requested style.
 * Display faces are loaded at their regular weight (many have only one);
 * the reading face at 400–700 (no italics: several faces have none).
 */
export function googleFontsHrefs(look: Pick<SiteLook, "fonts">): string[] {
  const body = firstFamily(look.fonts.body);
  const display = firstFamily(look.fonts.display);
  const out: string[] = [];
  if (body) out.push(`https://fonts.googleapis.com/css2?family=${familyParam(body)}:wght@400;500;600;700&display=swap`);
  if (display && display !== body) out.push(`https://fonts.googleapis.com/css2?family=${familyParam(display)}&display=swap`);
  return out;
}
