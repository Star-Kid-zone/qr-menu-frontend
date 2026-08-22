"use client";

import { Suspense, lazy } from "react";
import { Spinner } from "@/components/ui";
import { menuTemplates } from "@/components/templates/core/registry";
import { mapPublicUserDetailsFromApi } from "@/components/templates/core/mapPublicUserDetails";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import type { Menu } from "@/types";

// Mirrors the resolution logic in `src/app/(public)/menu/TenantMenuPage.tsx` so the
// admin preview renders the exact same component the public site would — just fed
// draft (unsaved) data instead of a server fetch.
const MenuStructureList      = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureList"));
const MenuStructureGrid      = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureGrid"));
const MenuStructureSidebar   = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureSidebar"));
const MenuStructureTabs      = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureTabs"));
const MenuStructureAccordion = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureAccordion"));
const MenuStructureMagazine  = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureMagazine"));
const MenuStructureCompact   = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureCompact"));
const MenuStructureMasonry   = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureMasonry"));
const MenuStructureStory     = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureStory"));
const MenuStructureBento     = lazy(() => import("@/components/templates/menu/_shared/structures/MenuStructureBento"));

const MENU_STRUCTURE_MAP = {
  list:      MenuStructureList,
  grid:      MenuStructureGrid,
  sidebar:   MenuStructureSidebar,
  tabs:      MenuStructureTabs,
  accordion: MenuStructureAccordion,
  magazine:  MenuStructureMagazine,
  compact:   MenuStructureCompact,
  masonry:   MenuStructureMasonry,
  story:     MenuStructureStory,
  bento:     MenuStructureBento,
} as const;

function getSafeMenuSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return "swiss";
  const clean = raw.toLowerCase().trim();
  if (clean === "bentogrid") return "bento-grid";
  if (clean in menuTemplates) return clean;
  return "swiss";
}

/**
 * Renders the tenant's real menu page template client-side from in-memory
 * (possibly unsaved) data — used by the admin preview panel so menu theme/
 * structure/colour edits show up instantly, without a save + iframe reload
 * round trip (which is how the landing preview already behaves).
 */
export function MenuPreviewRenderer({ data }: { data: RawPublicSiteData }) {
  const mappedResult = mapPublicUserDetailsFromApi(data);
  if (!mappedResult.ok) return null;

  const settings = (data.settings ?? {}) as Record<string, unknown>;

  const structureKey =
    typeof settings.menu_structure === "string" && settings.menu_structure.trim()
      ? (settings.menu_structure.trim() as keyof typeof MENU_STRUCTURE_MAP)
      : null;

  const themeSlug = getSafeMenuSlug(settings.menu_theme);
  const MenuTemplate =
    (structureKey && MENU_STRUCTURE_MAP[structureKey]) ||
    menuTemplates[themeSlug as keyof typeof menuTemplates] ||
    menuTemplates.swiss;

  const payload = {
    mapped: mappedResult.value,
    menuItems: (data.menuItems ?? []) as Menu[],
    routeSlug: "",
  };

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Spinner size="md" />
        </div>
      }
    >
      <MenuTemplate payload={payload} routeSlug={null} themeSlug={themeSlug} />
    </Suspense>
  );
}
