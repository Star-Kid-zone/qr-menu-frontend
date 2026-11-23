"use client";

import { ComponentType, Suspense } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { menuTemplates } from "@/components/templates/core/menuRegistry";
import { MENU_STRUCTURE_MAP, resolveMenuStructure } from "@/components/templates/menu/structureRegistry";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import { SiteStatusBanner } from "@/components/templates/sections/SiteStatusBanner";
import { MenuCurrencyContext } from "@/components/templates/menu/_shared/structures/DietaryBadges";
import { MenuOccasionBanner } from "@/components/site-system/occasions/MenuOccasionBanner";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

/** Every menu template component's actual prop shape — bespoke ones ignore the extra `themeSlug`. */
type MenuTemplateComponentProps = {
  payload: PublicMenuPayload;
  routeSlug: string | null;
  themeSlug?: string;
};

function getSafeMenuSlug(raw: string): string {
  const clean = raw.toLowerCase().trim();
  if (clean in menuTemplates) return clean;
  return DEFAULT_TEMPLATE_SLUG;
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
  const structureKey = resolveMenuStructure({ ...payload.mapped.settings, menu_structure: menuStructure ?? payload.mapped.settings?.menu_structure });
  const MenuTemplate = (structureKey
    ? MENU_STRUCTURE_MAP[structureKey]
    : (menuTemplates[slug as keyof typeof menuTemplates] ?? menuTemplates[DEFAULT_TEMPLATE_SLUG as keyof typeof menuTemplates])) as ComponentType<MenuTemplateComponentProps>;

  return (
    <Suspense fallback={<PageLoader label="Loading menu…" fullScreen />}>
      <SiteStatusBanner settings={payload.mapped.settings} />
      <MenuOccasionBanner settings={payload.mapped.settings} />
      <MenuCurrencyContext.Provider value={payload.mapped.currency?.symbol || "$"}>
        <MenuTemplate payload={payload} routeSlug={payload.routeSlug} themeSlug={slug} />
      </MenuCurrencyContext.Provider>
    </Suspense>
  );
}
