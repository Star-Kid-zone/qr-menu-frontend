import type { CSSProperties } from "react";

/**
 * The token contract as values a layout can use in `style` props
 * (docs/site-system/PLAN.md §1.2). Layouts and menu structures use ONLY these
 * (a test greps their files for colour and font literals), so every layout
 * works with every skin, owner colour and occasion.
 *
 * The fallbacks inside `var()` keep the new shared parts readable inside the
 * older layouts, which set only the original `--site-*` variables.
 */
export const tv = {
  bg: "var(--site-bg)",
  surface: "var(--site-surface)",
  band: "var(--site-section-bg, var(--site-surface))",
  footer: "var(--site-footer-bg, var(--site-bg))",
  border: "var(--site-border)",
  text: "var(--site-text)",
  muted: "var(--site-text-muted)",
  accent: "var(--site-accent)",
  accentText: "var(--site-accent-text)",
  font: "var(--site-font)",
  display: "var(--site-font-display, var(--site-font))",
  radius: "var(--site-radius, 12px)",
  occ1: "var(--occ-1, var(--site-accent))",
  /** Readable text on the footer colour (chosen for contrast; see footerInk). */
  footerText: "var(--site-footer-text, var(--site-text))",
  footerMuted: "var(--site-footer-muted, var(--site-text-muted))",
  footerAccent: "var(--site-footer-accent, var(--site-accent))",
} as const;

/** Blend two colours (tokens or literals) — `mixv(tv.accent, "transparent", 30)`. */
export const mixv = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Fluid type scale (360px → 1440px). One scale for every layout; layouts pick sizes, skins pick faces. */
export const fluid = {
  /** The restaurant's name on a cover/stage. */
  giant: "clamp(3.25rem, 1.2rem + 9.5vw, 10.5rem)",
  hero: "clamp(2.75rem, 1.5rem + 5.6vw, 6.75rem)",
  h2: "clamp(2rem, 1.45rem + 2.4vw, 3.5rem)",
  h3: "clamp(1.3rem, 1.15rem + 0.6vw, 1.7rem)",
  lead: "clamp(1.06rem, 1rem + 0.3vw, 1.3rem)",
  body: "1rem",
  small: "0.875rem",
} as const;

/** Vertical rhythm for sections. */
export const space = {
  sm: "clamp(2.5rem, 2rem + 2vw, 4rem)",
  md: "clamp(3.5rem, 2.6rem + 4vw, 7rem)",
  lg: "clamp(4.5rem, 3rem + 6vw, 9.5rem)",
} as const;

/**
 * Text that sits on a photograph. Photos are not part of the palette, so the
 * text on them is always light over a dark scrim, whatever the skin.
 */
export const ON_PHOTO = "rgb(255 255 255)";
export const ON_PHOTO_MUTED = "rgb(255 255 255 / 0.82)";
/** Dark scrim over a photo; `from` = side the text sits on. */
export function photoScrim(from: "left" | "bottom" | "center" = "bottom", strength = 0.72): string {
  const a = strength;
  if (from === "left") return `linear-gradient(100deg, rgb(0 0 0 / ${a}) 0%, rgb(0 0 0 / ${a * 0.7}) 45%, rgb(0 0 0 / ${a * 0.15}) 100%)`;
  if (from === "center") return `radial-gradient(120% 90% at 50% 50%, rgb(0 0 0 / ${a * 0.55}) 0%, rgb(0 0 0 / ${a}) 100%)`;
  return `linear-gradient(to top, rgb(0 0 0 / ${a}) 0%, rgb(0 0 0 / ${a * 0.45}) 50%, rgb(0 0 0 / ${a * 0.1}) 100%)`;
}

/** A soft pool of white light over a photo (a stage spotlight). */
export function lightPool(alpha = 0.26, size = "28% 46%"): string {
  return `radial-gradient(${size} at 50% 52%, rgb(255 255 255 / ${alpha}), transparent 70%)`;
}

/** Display-face text style for headings. */
export function displayStyle(size: string, extra: CSSProperties = {}): CSSProperties {
  return { fontFamily: tv.display, fontSize: size, lineHeight: 1.05, color: tv.text, textWrap: "balance", ...extra } as CSSProperties;
}

/** Visible keyboard focus in the accent colour (pair with `focus-visible:outline-2 focus-visible:outline-offset-2`). */
export const focusRing: CSSProperties = { outlineColor: tv.accent };
