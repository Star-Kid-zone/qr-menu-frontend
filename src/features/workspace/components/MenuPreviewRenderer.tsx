"use client";

import { Suspense, createElement } from "react";
import { SiteStatusBanner } from "@/components/templates/sections/SiteStatusBanner";
import { MenuCurrencyContext } from "@/components/templates/menu/_shared/structures/DietaryBadges";
import { MenuOccasionBanner } from "@/components/site-system/occasions/MenuOccasionBanner";
import { Spinner } from "@/components/ui";
import { menuTemplates } from "@/components/templates/core/menuRegistry";
import { MENU_STRUCTURE_MAP, resolveMenuStructure } from "@/components/templates/menu/structureRegistry";
import { mapPublicUserDetailsFromApi } from "@/components/templates/core/mapPublicUserDetails";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import type { Menu } from "@/types";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

// Same resolution as `src/app/(public)/menu/TenantMenuPage.tsx` (shared registry), so the
// admin preview renders the exact same component the public site would — just fed
// draft (unsaved) data instead of a server fetch.

function getSafeMenuSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return DEFAULT_TEMPLATE_SLUG;
  const clean = raw.toLowerCase().trim();
  if (clean in menuTemplates) return clean;
  return DEFAULT_TEMPLATE_SLUG;
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

  const structureKey = resolveMenuStructure(settings);

  const themeSlug = getSafeMenuSlug(settings.menu_theme);
  const MenuTemplate =
    (structureKey && MENU_STRUCTURE_MAP[structureKey]) ||
    menuTemplates[themeSlug as keyof typeof menuTemplates] ||
    menuTemplates[DEFAULT_TEMPLATE_SLUG as keyof typeof menuTemplates];

  const rawItems: Menu[] = data.menuItems ?? [];
  const normalizedMenuItems: Menu[] = rawItems.map((item) => {
    const img =
      item.image_url ||
      item.imageUrl ||
      item.image ||
      (Array.isArray(item.images) && item.images.length > 0
        ? typeof item.images[0] === "string"
          ? item.images[0]
          : item.images[0]?.url
        : null) ||
      null;
    // A missing image stays `null` (not `undefined`), as the templates have always received it.
    return {
      ...item,
      id: Number(item.id),
      image_url: img,
      imageUrl: img,
      image: img,
    } as unknown as Menu;
  });

  const payload = {
    mapped: mappedResult.value,
    menuItems: normalizedMenuItems,
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
      <SiteStatusBanner settings={settings} />
      {/* The preview runs in an iframe where the player can't see its own visibility, so the Lottie isn't frozen off screen. */}
      <MenuOccasionBanner settings={settings} live={false} />
      {/* Picked from module-level tables (never created here); createElement keeps the compiler lint from misreading the lookup. */}
      <MenuCurrencyContext.Provider value={payload.mapped.currency?.symbol || "$"}>
        {createElement(MenuTemplate, { payload, routeSlug: null, themeSlug })}
      </MenuCurrencyContext.Provider>
    </Suspense>
  );
}
