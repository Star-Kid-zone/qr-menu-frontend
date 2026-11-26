/**
 * Ids of the site's Lottie animations, and the icon drawn in place of each festival one (reduced
 * motion, or while the player loads). Kept apart from the animation data itself
 * (components/site-system/kit/lottie/lottieData.ts, ~45 KB) so pickers and pages can use the ids
 * without shipping the data.
 */
export const CORE_LOTTIE_IDS = ["steam", "sparkle", "candle", "vines", "embers"] as const;

export const FESTIVE_STILL_ICON = {
  diya: "fest-diya",
  "colour-burst": "fest-splash",
  dandiya: "fest-marigold",
  marigold: "fest-marigold",
  boat: "fest-boat",
  kite: "fest-pot",
  rakhi: "fest-rakhi",
  flag: "fest-flag",
  lantern: "fest-lantern",
  crescent: "fest-crescent",
  baubles: "fest-tree",
  snowfall: "fest-snowflake",
  fireworks: "fest-firework",
  hearts: "heart",
  egg: "fest-egg",
  pumpkin: "fest-pumpkin",
  leaves: "fest-maple",
  shamrock: "fest-shamrock",
  cheers: "fest-tie",
  beer: "pint",
  confetti: "fest-bunting",
  cake: "fest-cake",
  sun: "fest-sun",
} as const;

export const LOTTIE_IDS = [...CORE_LOTTIE_IDS, ...(Object.keys(FESTIVE_STILL_ICON) as Array<keyof typeof FESTIVE_STILL_ICON>)] as const;

/** Animations that complete a drawing: played once and held, not looped. */
export const LOTTIE_PLAY_ONCE: readonly string[] = ["vines", "rakhi"];
