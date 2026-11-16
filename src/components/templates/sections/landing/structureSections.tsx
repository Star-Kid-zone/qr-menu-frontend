import type { SectionCatalogueEntry } from "../document";
import { LANDING_SECTIONS, LANDING_SECTION_MAP } from "./registry";

/**
 * The section catalogue reordered to a layout's own starting order. A site
 * that has never arranged its sections renders in this order; types the
 * layout doesn't list keep their registry order after them.
 */
export function structureCatalogue(nativeOrder: readonly string[]): SectionCatalogueEntry[] {
  const native = nativeOrder
    .map((type) => LANDING_SECTION_MAP.get(type))
    .filter((d): d is (typeof LANDING_SECTIONS)[number] => Boolean(d));
  const rest = LANDING_SECTIONS.filter((d) => !nativeOrder.includes(d.type));
  return [...native, ...rest];
}
