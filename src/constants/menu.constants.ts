import type { IndustryCategory, IndustryType } from "@/types";
/**
 * Menu & Dietary constants.
 * Mirrors qr-backend/.../constants/menu.constants.ts.
 */


/** Maximum price options allowed per menu item */
export const MAX_PRICE_OPTIONS = 6;

/** Maximum items that can be bulk deleted in a single operation */
export const BULK_DELETE_MAX = 200;

/** Number of sample items to preview during bulk price adjustments */
export const BULK_PRICE_ADJUST_PREVIEW_COUNT = 3;

/** Most photos one dish can have. */
export const MAX_DISH_PHOTOS = 5;

/** The "available all day" serving slot; picking it clears the others. */
export const MENU_ALL_DAY = "All Day";

/** Serving slots a dish can be limited to (besides All Day). */
export const MENU_TIME_SLOTS = ["Morning", "Lunch", "Evening", "Dinner"] as const;

/** Small "+ New" button beside the category / dish-type pickers. */
export const MENU_NEW_BUTTON_CLASS =
  "flex h-10 shrink-0 items-center gap-1 rounded-md border border-border bg-card px-3 text-caption font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]";

/** No categories or dish types (before a business type is chosen). */
export const EMPTY_TAXONOMY: { categories: IndustryCategory[]; types: IndustryType[] } = { categories: [], types: [] };
