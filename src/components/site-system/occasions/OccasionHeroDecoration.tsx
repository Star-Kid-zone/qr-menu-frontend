import { OrnamentCorner } from "../ornaments";
import type { SiteLook } from "../types";

const CORNERS = [
  "left-2 top-2 sm:left-4 sm:top-4",
  "right-2 top-2 rotate-90 sm:right-4 sm:top-4",
  "bottom-2 right-2 rotate-180 sm:bottom-4 sm:right-4",
  "bottom-2 left-2 -rotate-90 sm:bottom-4 sm:left-4",
] as const;

/**
 * The festival's corner ornaments framing the hero while an occasion is on
 * (PLAN §2.8 hero decoration). Decorative only: hidden from screen readers,
 * never takes clicks, in the occasion's own tint.
 */
export function OccasionHeroDecoration({ look }: { look: Pick<SiteLook, "occasion"> }) {
  const corner = look.occasion?.definition.ornaments.corner;
  if (!corner || corner === "none") return null;
  return (
    <div aria-hidden="true" data-occasion-hero={look.occasion!.definition.id} className="pointer-events-none absolute inset-0 z-20" style={{ color: "var(--occ-1)" }}>
      {CORNERS.map((pos) => (
        <OrnamentCorner key={pos} corner={corner} size={44} className={`absolute ${pos}`} />
      ))}
    </div>
  );
}
