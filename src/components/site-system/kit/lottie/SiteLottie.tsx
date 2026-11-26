"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ThemedLottie } from "@/components/templates/sections/art/ThemedLottie";
import { CORE_LOTTIE_IDS, FESTIVE_STILL_ICON, LOTTIE_IDS, LOTTIE_PLAY_ONCE } from "@/constants/lottie.constants";
import type { LottieId } from "@/types/shared/lottie.types";
import { useOptionalSiteLook } from "../../SiteLookContext";
import { SiteIcon } from "../../icons/SiteIcon";

/** Static drawings shown for reduced motion and while the player loads. */
const STILLS: Record<(typeof CORE_LOTTIE_IDS)[number], ReactNode> = {
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

/** The still for an animation: its drawing, or for festival ones the matching icon. */
function stillFor(name: LottieId): ReactNode {
  if (name in STILLS) return STILLS[name as (typeof CORE_LOTTIE_IDS)[number]];
  const icon = FESTIVE_STILL_ICON[name as keyof typeof FESTIVE_STILL_ICON];
  return <SiteIcon name={icon} size={120} iconStyle="line" className="h-full w-full" />;
}

export type { LottieId };
export { LOTTIE_IDS };

/**
 * A decorative animation from the kit, in the site's accent colour. Purely
 * ornamental (hidden from assistive tech); a still drawing replaces it for
 * reduced motion.
 */
export function SiteLottie({ name, className, color, live = true }: { name: LottieId; className?: string; color?: string; live?: boolean }) {
  const look = useOptionalSiteLook();
  const accent = color ?? look?.palette.accent ?? "#C8A165";
  const still = <div className="h-full w-full" style={{ color: accent }}>{stillFor(name)}</div>;
  const motionOff = look?.motion === "off";
  // The animation data (~45 KB) is fetched on first use, not shipped with every guest page.
  const [animation, setAnimation] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (motionOff) return;
    let cancelled = false;
    import("./lottieData").then((mod) => {
      if (!cancelled) setAnimation(mod.LOTTIES[name]);
    });
    return () => {
      cancelled = true;
    };
  }, [name, motionOff]);
  if (motionOff || !animation) return <div className={className} aria-hidden>{still}</div>;
  return <ThemedLottie animation={animation} color={accent} fallback={still} className={className} freezeOffscreen={live} loop={!LOTTIE_PLAY_ONCE.includes(name)} />;
}
