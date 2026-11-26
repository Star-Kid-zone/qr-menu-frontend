"use client";

import { useState } from "react";
import industryService from "@/services/industry.service";
import type { IndustryCategory, IndustryType } from "@/types";
import { useAsyncData } from "./useAsyncData";
import { EMPTY_TAXONOMY } from "@/constants/menu.constants";

interface Taxonomy {
  categories: IndustryCategory[];
  types: IndustryType[];
}


/**
 * The category and dish-type lists for a business type (platform catalog plus the restaurant's
 * own additions). `addCategory` / `addType` append a just-created entry without refetching.
 */
export function useIndustryTaxonomy(industryId: string | null) {
  const { data, loading, error, refetch } = useAsyncData<Taxonomy>(
    async () => {
      if (!industryId) return EMPTY_TAXONOMY;
      const [categories, types] = await Promise.all([
        industryService.getCategories(industryId),
        industryService.getTypes(industryId),
      ]);
      return { categories: categories.data || [], types: types.data || [] };
    },
    [industryId],
    "Couldn't load your categories. Try again.",
  );

  // Entries created on this screen, kept per business type so switching types drops them.
  const [added, setAdded] = useState<Taxonomy & { industryId: string | null }>({ industryId, ...EMPTY_TAXONOMY });
  const extra = added.industryId === industryId ? added : EMPTY_TAXONOMY;

  return {
    categories: [...(data?.categories ?? []), ...extra.categories],
    types: [...(data?.types ?? []), ...extra.types],
    loading: Boolean(industryId) && loading,
    error,
    refetch,
    addCategory: (category: IndustryCategory) =>
      setAdded((prev) => ({ ...(prev.industryId === industryId ? prev : { industryId, ...EMPTY_TAXONOMY }), categories: [...(prev.industryId === industryId ? prev.categories : []), category] })),
    addType: (type: IndustryType) =>
      setAdded((prev) => ({ ...(prev.industryId === industryId ? prev : { industryId, ...EMPTY_TAXONOMY }), types: [...(prev.industryId === industryId ? prev.types : []), type] })),
  };
}
