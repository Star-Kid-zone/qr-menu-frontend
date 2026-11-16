import { parseSiteDocument } from "../document";

/**
 * Fixed parts of the menu page an owner can switch off. Stored in
 * `site_document.menu.sections` as `{ id: type, type, hidden: true }`;
 * a part with no entry is shown.
 *
 * - search:  the "Search menu…" box.
 * - filters: Popular / type / dietary chips and category filter chips.
 *   Category tabs and sidebars that guests use to navigate stay.
 */
export const MENU_PARTS = [
  { type: "search", label: "Search box", description: "Lets guests search dishes by name." },
  { type: "filters", label: "Filter chips", description: "Popular, dietary and category filters above the menu." },
] as const;

export type MenuPartType = (typeof MENU_PARTS)[number]["type"];

export function isMenuPartShown(rawDocument: unknown, type: MenuPartType): boolean {
  const sections = parseSiteDocument(rawDocument)?.menu?.sections ?? [];
  return !sections.some((s) => s.type === type && s.hidden);
}
