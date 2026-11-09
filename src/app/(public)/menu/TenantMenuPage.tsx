"use client";

import { ComponentType, Suspense, lazy } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { menuTemplates } from "@/components/templates/core/menuRegistry";
import type { PublicMenuPayload } from "@/types/public-site";

/** Every menu template component's actual prop shape — bespoke ones ignore the extra `themeSlug`. */
type MenuTemplateComponentProps = {
  payload: PublicMenuPayload;
  routeSlug: string | null;
  themeSlug?: string;
};

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

function getSafeMenuSlug(raw: string): string {
  const clean = raw.toLowerCase().trim();
  if (clean === "bentogrid") return "bento-grid";
  if (clean in menuTemplates) return clean;
  return "swiss";
}

export function TenantMenuPage({
  payload,
  menuTheme,
  menuStructure,
}: {
  payload: PublicMenuPayload;
  menuTheme: string;
  menuStructure?: string;
}) {
  const slug = getSafeMenuSlug(menuTheme);
  const structureKey = menuStructure?.trim() as keyof typeof MENU_STRUCTURE_MAP | undefined;
  const MenuTemplate = (structureKey && MENU_STRUCTURE_MAP[structureKey]
    ? MENU_STRUCTURE_MAP[structureKey]
    : (menuTemplates[slug as keyof typeof menuTemplates] ?? menuTemplates.swiss)) as ComponentType<MenuTemplateComponentProps>;

  return (
    <Suspense fallback={<PageLoader label="Loading menu…" fullScreen />}>
      <MenuTemplate payload={payload} routeSlug={payload.routeSlug} themeSlug={slug} />
    </Suspense>
  );
}
