import { toHex6 } from "@/utils/contrast";
import type { ColourRole, RoleFieldMap } from "../menuThemes";

/** A part the owner tapped in the live preview; `nonce` lets the same part be re-picked. */
export interface StudioPartFocus {
  part: string;
  nonce: number;
}

export interface ResolveSpec {
  fields: RoleFieldMap;
  /** Parts, by id, that tapped text of each colour maps to. */
  textPart: string;
  /** The part a tapped highlight colour (text or background) maps to. */
  accentPart: string;
  /** Background colours to match, in priority order, with the part each one means. */
  backgrounds: { role: ColourRole; part: string }[];
  /** Part used when nothing matches. */
  fallback: string;
  /** Parts an explicit `data-part` attribute may name. */
  knownParts: string[];
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Works out which part of a page the owner tapped in the preview.
 *
 * It samples the tapped element's real colours and matches them to the page's own
 * colours — this works for every template and structure without each one needing
 * markup hooks. An element carrying `data-part` always wins. Ties resolve in the
 * spec's order, and the rail remains the fallback for anything this guesses wrong.
 */
export function resolvePartByColour(target: Element, values: Record<string, unknown>, spec: ResolveSpec): string {
  const view = target.ownerDocument.defaultView;
  if (!view) return spec.fallback;

  const colour = (role: ColourRole) => toHex6(str(values[spec.fields[role]]));
  const primary = colour("primary");
  const textPrimary = colour("textPrimary");
  const textSecondary = colour("textSecondary");

  const own = toHex6(view.getComputedStyle(target).color);
  const hasText = Array.from(target.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim() !== "");
  if (hasText && own) {
    if (own === textPrimary || own === textSecondary) return spec.textPart;
    if (own === primary) return spec.accentPart;
  }

  for (let el: Element | null = target; el && el.tagName !== "HTML"; el = el.parentElement) {
    const tagged = el.getAttribute("data-part");
    if (tagged && spec.knownParts.includes(tagged)) return tagged;
    const bg = toHex6(view.getComputedStyle(el).backgroundColor);
    if (!bg) continue;
    if (bg === primary) return spec.accentPart;
    for (const b of spec.backgrounds) {
      if (bg === colour(b.role)) return b.part;
    }
  }
  return spec.fallback;
}
