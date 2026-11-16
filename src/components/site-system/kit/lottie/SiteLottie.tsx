"use client";

import type { ReactNode } from "react";
import { ThemedLottie } from "@/components/templates/sections/art/ThemedLottie";
import { STEAM_ANIMATION } from "@/components/templates/sections/art/lottie/steam";
import { useOptionalSiteLook } from "../../SiteLookContext";
import { CANDLE_ANIMATION, EMBER_ANIMATION, SPARKLE_ANIMATION, VINE_ANIMATION } from "./animations";
import { FESTIVE_ANIMATIONS, FESTIVE_STILL_ICON } from "./animationsFestive";
import { SiteIcon } from "../../icons/SiteIcon";

/** Static drawings shown for reduced motion and while the player loads. */
const STILLS: Record<CoreLottieId, ReactNode> = {
  steam: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round">
        <path d="M46 50c4-4-4-12 0-16s4-8 0-12M60 46c4-4-4-12 0-16s4-8 0-12M74 50c4-4-4-12 0-16s4-8 0-12" />
        <path d="M30 68H90M34 68c0 16 12 26 26 26s26-10 26-26" strokeWidth={4} />
      </g>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <path fill="currentColor" d="M60 40l4 14 14 4-14 4-4 14-4-14-14-4 14-4zM30 26l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM90 76l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" />
    </svg>
  ),
  vines: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2">
        <path d="M4 116C10 102 24 94 30 80S36 58 44 44 64 26 78 20 100 12 112 10" />
        <path d="M4 116c14-4 26-6 36-12s22-14 30-22 16-16 22-22" strokeWidth="1.8" />
      </g>
      <g fill="currentColor" opacity=".85">
        <ellipse cx="30" cy="72" rx="6" ry="10" transform="rotate(-30 30 80)" />
        <ellipse cx="46" cy="36" rx="6" ry="10" transform="rotate(40 46 44)" />
        <ellipse cx="80" cy="13" rx="6" ry="10" transform="rotate(-70 80 21)" />
        <ellipse cx="70" cy="74" rx="6" ry="10" transform="rotate(60 70 82)" />
      </g>
    </svg>
  ),
  embers: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <g fill="currentColor">
        <circle cx="34" cy="70" r="2.5" /><circle cx="50" cy="52" r="2" /><circle cx="76" cy="60" r="3" /><circle cx="84" cy="40" r="2" /><circle cx="60" cy="86" r="1.5" />
        <rect x="12" y="110" width="96" height="3" rx="1.5" opacity=".8" />
      </g>
    </svg>
  ),
  candle: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <circle cx="60" cy="42" r="26" fill="currentColor" opacity=".16" />
      <path fill="currentColor" d="M60 24c5 7 8 13 8 24a8 8 0 0 1-16 0c0-11 3-17 8-24z" />
      <rect x="52" y="64" width="16" height="44" rx="3" fill="currentColor" opacity=".85" />
    </svg>
  ),
};

const CORE_LOTTIES = {
  steam: STEAM_ANIMATION as unknown as Record<string, unknown>,
  sparkle: SPARKLE_ANIMATION as unknown as Record<string, unknown>,
  candle: CANDLE_ANIMATION as unknown as Record<string, unknown>,
  vines: VINE_ANIMATION as unknown as Record<string, unknown>,
  embers: EMBER_ANIMATION as unknown as Record<string, unknown>,
} as const;

type CoreLottieId = keyof typeof CORE_LOTTIES;

/** Every animation in the kit: the layout set plus the festival set. */
export const LOTTIES: Record<CoreLottieId | keyof typeof FESTIVE_ANIMATIONS, Record<string, unknown>> = {
  ...CORE_LOTTIES,
  ...(FESTIVE_ANIMATIONS as unknown as Record<keyof typeof FESTIVE_ANIMATIONS, Record<string, unknown>>),
};

/** The still for an animation: its drawing, or for festival ones the matching icon. */
function stillFor(name: LottieId): ReactNode {
  if (name in STILLS) return STILLS[name as CoreLottieId];
  const icon = FESTIVE_STILL_ICON[name as keyof typeof FESTIVE_STILL_ICON];
  return <SiteIcon name={icon} size={120} iconStyle="line" className="h-full w-full" />;
}

/** Animations that complete a drawing: played once and held, not looped. */
const PLAY_ONCE: ReadonlySet<string> = new Set(["vines", "rakhi"]);

export type LottieId = keyof typeof LOTTIES;
export const LOTTIE_IDS = Object.keys(LOTTIES) as LottieId[];

/**
 * A decorative animation from the kit, in the site's accent colour. Purely
 * ornamental (hidden from assistive tech); a still drawing replaces it for
 * reduced motion.
 */
export function SiteLottie({ name, className, color, live = true }: { name: LottieId; className?: string; color?: string; live?: boolean }) {
  const look = useOptionalSiteLook();
  const accent = color ?? look?.palette.accent ?? "#C8A165";
  const still = <div className="h-full w-full" style={{ color: accent }}>{stillFor(name)}</div>;
  if (look?.motion === "off") return <div className={className} aria-hidden>{still}</div>;
  return <ThemedLottie animation={LOTTIES[name]} color={accent} fallback={still} className={className} freezeOffscreen={live} loop={!PLAY_ONCE.has(name)} />;
}
