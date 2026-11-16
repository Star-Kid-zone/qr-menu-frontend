/**
 * The opening scene each occasion plays when a guest opens the site
 * (OccasionIntro): what falls or bursts across the screen, and what flies
 * through it. The festival's own animation and wording sit in the middle.
 */

export type IntroParticles = "snow" | "confetti" | "fireworks" | "colours" | "hearts" | "leaves" | "petals" | "stars" | "bubbles" | "sparkles";
export type IntroFlyer = "sleigh" | "kite" | "lanterns" | "bats" | "balloons" | "boat";

export interface OccasionIntroScene {
  particles: IntroParticles;
  flyer?: IntroFlyer;
}

export const OCCASION_INTROS: Readonly<Record<string, OccasionIntroScene>> = {
  // India
  diwali: { particles: "fireworks" },
  holi: { particles: "colours" },
  "navratri-dussehra": { particles: "sparkles" },
  "durga-puja": { particles: "petals" },
  "ganesh-chaturthi": { particles: "petals" },
  onam: { particles: "petals", flyer: "boat" },
  "pongal-sankranti": { particles: "sparkles", flyer: "kite" },
  "raksha-bandhan": { particles: "sparkles" },
  "india-independence-day": { particles: "confetti", flyer: "kite" },
  "india-republic-day": { particles: "confetti" },
  // Gulf
  ramadan: { particles: "stars", flyer: "lanterns" },
  "eid-al-fitr": { particles: "stars", flyer: "lanterns" },
  "eid-al-adha": { particles: "stars", flyer: "lanterns" },
  "uae-national-day": { particles: "fireworks" },
  "saudi-national-day": { particles: "fireworks" },
  "saudi-founding-day": { particles: "confetti" },
  "qatar-national-day": { particles: "fireworks" },
  "kuwait-national-day": { particles: "fireworks" },
  // Western
  christmas: { particles: "snow", flyer: "sleigh" },
  "new-years-eve": { particles: "fireworks" },
  "valentines-day": { particles: "hearts" },
  easter: { particles: "petals" },
  halloween: { particles: "leaves", flyer: "bats" },
  thanksgiving: { particles: "leaves" },
  "st-patricks-day": { particles: "confetti" },
  "mothers-day": { particles: "hearts" },
  "fathers-day": { particles: "confetti" },
  oktoberfest: { particles: "bubbles" },
  // Any time
  "grand-opening": { particles: "confetti", flyer: "balloons" },
  anniversary: { particles: "sparkles", flyer: "balloons" },
  summer: { particles: "bubbles" },
  winter: { particles: "snow" },
};

/** How long the scene plays before it fades away (ms). */
export const INTRO_DURATION_MS = 3600;
