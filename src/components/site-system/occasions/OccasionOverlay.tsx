"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import type { SiteLook } from "../types";
import { SiteIcon } from "../icons/SiteIcon";
import { SiteLottie, type LottieId } from "../kit/lottie/SiteLottie";
import { OccasionIntro } from "./OccasionIntro";

/**
 * The occasion look on a guest page (PLAN §2.8): a banner in the occasion's
 * colours with its badge, and a decoration band under it (marigold toran,
 * lanterns, bunting, snow…). Shown only while the owner's chosen dates
 * include today. At "full" strength the page accent has already changed
 * (resolveSiteLook); this adds the decorations for both strengths.
 * Colours come from the --occ-* tokens.
 */

const OCC1 = "var(--occ-1)";
const OCC2 = "var(--occ-2)";
const OCC3 = "var(--occ-3)";

/** One tile of each decoration band, 40×24, drawn in the occasion tints. */
const BAND_TILES: Record<string, ReactNode> = {
  toran: (
    <>
      <path d="M0 3 Q10 15 20 3 Q30 15 40 3" fill="none" stroke={OCC3} strokeWidth="1.2" />
      <circle cx="10" cy="9" r="3.2" fill={OCC2} />
      <circle cx="30" cy="9" r="3.2" fill={OCC1} />
      <path d="M20 3l-2.2 7 2.2 3 2.2-3z" fill={OCC3} />
    </>
  ),
  diyas: (
    <>
      <path d="M12 16h16c-1 4-4 5-8 5s-7-1-8-5z" fill={OCC1} />
      <path d="M20 6c2 2.5 2.6 4.5 1.6 7h-3.2c-1-2.5-.4-4.5 1.6-7z" fill={OCC2} />
    </>
  ),
  lanterns: (
    <>
      <path d="M0 2h40" stroke={OCC2} strokeWidth="1" />
      <path d="M20 2v4" stroke={OCC2} strokeWidth="1" />
      <path d="M17 6h6l1.5 3v8L23 20h-6l-1.5-3V9z" fill={OCC1} stroke={OCC2} strokeWidth=".8" />
      <circle cx="20" cy="13" r="1.6" fill={OCC2} />
    </>
  ),
  bunting: (
    <>
      <path d="M0 3 Q20 8 40 3" fill="none" stroke={OCC3} strokeWidth="1" />
      <path d="M4 4.2l4 12 4-11z" fill={OCC1} />
      <path d="M17 5.4l3 12 3-12z" fill={OCC2} />
      <path d="M28 5.2l4 11 4-12z" fill={OCC1} />
    </>
  ),
  flags: (
    <>
      <path d="M0 3h40" stroke={OCC3} strokeWidth="1" />
      <rect x="4" y="3" width="12" height="9" fill={OCC1} />
      <rect x="22" y="3" width="12" height="9" fill={OCC2} />
    </>
  ),
  stars: (
    <>
      <path d="M8 6l1.4 3 3.2.4-2.4 2.2.6 3.2L8 13.2l-2.8 1.6.6-3.2-2.4-2.2 3.2-.4z" fill={OCC2} />
      <circle cx="24" cy="16" r="1.4" fill={OCC1} />
      <path d="M32 4l.8 1.8 2 .2-1.5 1.3.4 2L32 8.3 30.3 9.3l.4-2-1.5-1.3 2-.2z" fill={OCC1} />
    </>
  ),
  snow: (
    <>
      <path d="M10 5v12M4.8 8l10.4 6M4.8 14l10.4-6" stroke={OCC2} strokeWidth="1" />
      <circle cx="28" cy="8" r="1.5" fill={OCC2} />
      <circle cx="34" cy="17" r="1" fill={OCC2} />
    </>
  ),
  hearts: (
    <>
      <path d="M10 18s-6-3.7-6-8a3.4 3.4 0 0 1 6-2.2A3.4 3.4 0 0 1 16 10c0 4.3-6 8-6 8z" fill={OCC1} />
      <path d="M30 13s-3.5-2.2-3.5-4.6a2 2 0 0 1 3.5-1.3 2 2 0 0 1 3.5 1.3C33.5 10.8 30 13 30 13z" fill={OCC2} />
    </>
  ),
  leaves: (
    <>
      <path d="M0 12h40" stroke={OCC3} strokeWidth=".8" />
      <path d="M8 12c0-5 4-8 9-8-1 5-4 8-9 8z" fill={OCC1} />
      <path d="M26 12c0 5 4 8 9 8-1-5-4-8-9-8z" fill={OCC2} />
    </>
  ),
  splash: (
    <>
      <circle cx="7" cy="9" r="4" fill={OCC1} />
      <circle cx="19" cy="16" r="3" fill={OCC2} />
      <circle cx="30" cy="7" r="3.5" fill={OCC3} />
      <circle cx="36" cy="17" r="2" fill={OCC1} />
    </>
  ),
  kites: (
    <>
      <path d="M10 2l5 7-5 9-5-9z" fill={OCC1} />
      <path d="M10 18c-1 2 1 3 0 5" fill="none" stroke={OCC3} strokeWidth=".8" />
      <path d="M30 4l4 6-4 7-4-7z" fill={OCC2} />
    </>
  ),
};

export const OCCASION_BANDS = Object.keys(BAND_TILES);

function Band({ name }: { name: string }) {
  const id = `occ-band-${useId().replace(/:/g, "")}`;
  const tile = BAND_TILES[name] ?? BAND_TILES.stars;
  return (
    <svg aria-hidden width="100%" height="24" className="block">
      <defs>
        <pattern id={id} width="40" height="24" patternUnits="userSpaceOnUse">
          {tile}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Publishes how much of the banner is still on screen as `--occ-offset` on
 * the document root, so headers fixed to the top of the window (Pier,
 * Conservatory, Noir Salon) sit just below it and slide up as it scrolls away.
 */
function useBannerOffset(ref: RefObject<HTMLDivElement | null>, on: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const root = document.documentElement;
    let last = -1;
    // One rect read per scroll event; written only when the value changes.
    const update = () => {
      const next = Math.max(0, Math.round(el.getBoundingClientRect().bottom));
      if (next === last) return;
      last = next;
      root.style.setProperty("--occ-offset", `${next}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.style.removeProperty("--occ-offset");
    };
  }, [ref, on]);
}

/** Opening scene, banner and band for the occasion the owner switched on; nothing when none is on. */
export function OccasionOverlay({ look, live = true }: { look: SiteLook; live?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const occ = look.occasion;
  useBannerOffset(box, Boolean(occ));
  if (!occ) return null;
  const { definition: def, entry } = occ;
  const text = entry.banner || def.bannerSuggestion;
  const style = { background: OCC1, color: "var(--occ-ink)" } as CSSProperties;
  return (
    <div ref={box} data-occasion={def.id} data-occasion-intensity={entry.intensity}>
      <OccasionIntro definition={def} title={text} live={live} />
      {/* A div, not a p: the Lottie player renders a div. */}
      <div role="status" className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-center text-sm font-semibold" style={style}>
        {entry.intensity === "full" && def.lottie ? (
          <span aria-hidden className="size-7 shrink-0">
            <SiteLottie name={def.lottie as LottieId} color={def.tints[1] ?? def.ink} live={live} className="h-full w-full" />
          </span>
        ) : (
          <SiteIcon name={def.badgeIcon} size={20} iconStyle="line" />
        )}
        <span>{text}</span>
      </div>
      <Band name={def.ornaments.border} />
    </div>
  );
}
