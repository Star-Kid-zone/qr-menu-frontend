import { STEAM_ANIMATION } from "@/components/templates/sections/art/lottie/steam";
import type { LottieId } from "@/types/shared/lottie.types";
import { CANDLE_ANIMATION, EMBER_ANIMATION, SPARKLE_ANIMATION, VINE_ANIMATION } from "./animations";
import { FESTIVE_ANIMATIONS } from "./animationsFestive";

/**
 * Every animation in the kit: the layout set plus the festival set. This module is large (~45 KB),
 * so SiteLottie loads it with `import()` the first time an animation is shown instead of shipping
 * it in every guest page.
 */
export const LOTTIES: Record<LottieId, Record<string, unknown>> = {
  steam: STEAM_ANIMATION as unknown as Record<string, unknown>,
  sparkle: SPARKLE_ANIMATION as unknown as Record<string, unknown>,
  candle: CANDLE_ANIMATION as unknown as Record<string, unknown>,
  vines: VINE_ANIMATION as unknown as Record<string, unknown>,
  embers: EMBER_ANIMATION as unknown as Record<string, unknown>,
  ...(FESTIVE_ANIMATIONS as unknown as Record<keyof typeof FESTIVE_ANIMATIONS, Record<string, unknown>>),
};
