/**
 * Menu & Dietary constants.
 * Mirrors qr-backend/.../constants/menu.constants.ts.
 */
import {
  DIETARY_TAG_OPTIONS,
  ALLERGEN_OPTIONS,
  SPICE_LEVELS,
  dietaryTagLabel,
  dietaryTagEmoji,
  allergenLabel,
} from './dietary.constants';

export {
  DIETARY_TAG_OPTIONS,
  ALLERGEN_OPTIONS,
  SPICE_LEVELS,
  dietaryTagLabel,
  dietaryTagEmoji,
  allergenLabel,
};

/** Maximum price options allowed per menu item */
export const MAX_PRICE_OPTIONS = 6;

/** Maximum items that can be bulk deleted in a single operation */
export const BULK_DELETE_MAX = 200;

/** Number of sample items to preview during bulk price adjustments */
export const BULK_PRICE_ADJUST_PREVIEW_COUNT = 3;
