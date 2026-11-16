"use client";

import type { LandingSectionContext } from "@/components/templates/sections/types";
import { useOptionalSiteLook } from "../SiteLookContext";

/**
 * The words a layout uses ("Menu" / "Drinks", "Our dishes" / "On tap").
 * A business type the owner picked wins; otherwise the existing industry
 * wording — so sites that never chose a type read exactly as before.
 */
export function useTerms(ctx: LandingSectionContext) {
  const look = useOptionalSiteLook();
  const chosen = typeof ctx.p.data.settings?.business_type === "string" && ctx.p.data.settings.business_type.trim() !== "";
  const base = ctx.c.terms;
  if (!chosen || !look) return { ...base, curatedListTitle: look?.business.terms.curatedListTitle ?? "Our picks" };
  const b = look.business.terms;
  return {
    ...base,
    catalogLabel: b.catalogLabel,
    itemSingular: b.itemSingular,
    itemPlural: b.itemPlural,
    featuredSectionLabel: b.featuredSectionLabel,
    popularSectionLabel: b.popularSectionLabel,
    ctaLabel: b.ctaLabel,
    curatedListTitle: b.curatedListTitle,
  };
}
