import { lazy, type ComponentType } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";

/**
 * Menu structures by their `menu_structure` key — one table for the public
 * menu page and the admin preview, so they always render the same thing.
 * Each is loaded on demand.
 */
type StructureProps = { payload: PublicMenuPayload; routeSlug: string | null; themeSlug?: string };

const load = (f: () => Promise<{ default: ComponentType<StructureProps> }>) => lazy(f);

export const MENU_STRUCTURE_MAP: Readonly<Record<string, ComponentType<StructureProps>>> = {
  list: load(() => import("./_shared/structures/MenuStructureList")),
  grid: load(() => import("./_shared/structures/MenuStructureGrid")),
  sidebar: load(() => import("./_shared/structures/MenuStructureSidebar")),
  tabs: load(() => import("./_shared/structures/MenuStructureTabs")),
  accordion: load(() => import("./_shared/structures/MenuStructureAccordion")),
  magazine: load(() => import("./_shared/structures/MenuStructureMagazine")),
  compact: load(() => import("./_shared/structures/MenuStructureCompact")),
  masonry: load(() => import("./_shared/structures/MenuStructureMasonry")),
  story: load(() => import("./_shared/structures/MenuStructureStory")),
  bento: load(() => import("./_shared/structures/MenuStructureBento")),
  // Site system (docs/site-system/PLAN.md §2.5).
  "bill-of-fare": load(() => import("./_shared/structures/MenuStructureBillOfFare")),
  spotlight: load(() => import("./_shared/structures/MenuStructureSpotlight")),
  "magazine-spread": load(() => import("./_shared/structures/MenuStructureMagazineSpread")),
  "drinks-list": load(() => import("./_shared/structures/MenuStructureDrinksList")),
  "shop-shelf": load(() => import("./_shared/structures/MenuStructureShopShelf")),
  "garden-cards": load(() => import("./_shared/structures/MenuStructureGardenCards")),
  "catch-board": load(() => import("./_shared/structures/MenuStructureCatchBoard")),
  "grill-board": load(() => import("./_shared/structures/MenuStructureGrillBoard")),
  "bento-box": load(() => import("./_shared/structures/MenuStructureBentoBox")),
  "market-stalls": load(() => import("./_shared/structures/MenuStructureMarketStalls")),
  "deco-card": load(() => import("./_shared/structures/MenuStructureDecoCard")),
  jukebox: load(() => import("./_shared/structures/MenuStructureJukebox")),
};

export const MENU_STRUCTURE_KEYS = Object.keys(MENU_STRUCTURE_MAP);

/**
 * The menu structure each site-system landing layout pairs with. Kept here
 * (not imported from the layouts) so the menu page doesn't download them.
 * layouts.test.tsx checks it matches each layout's `menuStructure`.
 */
export const LAYOUT_MENU_PAIRS: Readonly<Record<string, string>> = {
  "grand-hall": "bill-of-fare",
  "noir-salon": "spotlight",
  "atelier-editorial": "magazine-spread",
  conservatory: "garden-cards",
  pier: "catch-board",
  ember: "grill-board",
  tatami: "bento-box",
  bazaar: "market-stalls",
  "supper-club": "deco-card",
  "midnight-diner": "jukebox",
};

/**
 * The structure a menu renders with:
 *   1. the saved `menu_structure`, when it's a known key;
 *   2. "Match my layout": no saved structure, and the landing page uses a
 *      site-system layout → that layout's pair (the older layouts have no
 *      pair, so existing sites keep their default menu);
 *   3. null → the style template's default menu.
 */
export function resolveMenuStructure(settings: Record<string, unknown> | null | undefined): string | null {
  const s = settings ?? {};
  const saved = typeof s.menu_structure === "string" ? s.menu_structure.trim() : "";
  if (saved && MENU_STRUCTURE_MAP[saved]) return saved;
  if (saved) return null;
  const landing = typeof s.landing_structure === "string" ? s.landing_structure.trim() : "";
  return LAYOUT_MENU_PAIRS[landing] ?? null;
}
