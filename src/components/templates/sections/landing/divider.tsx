import { ART_MOTIF_MAP, ART_MOTIFS } from "../art/motifs";
import type { LandingSectionProps } from "../types";

/**
 * A decorative band between sections: a repeating SVG motif in the theme's
 * accent colour on the page background. Purely decorative (hidden from
 * assistive tech). The motif is the section's variant.
 */
export function DividerSection({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const patternId = `divider-${section.id}`;
  return (
    <div aria-hidden="true" style={{ background: t.bg, color: t.accent }} className="px-5 py-6 sm:px-10">
      <svg className="mx-auto block w-full max-w-5xl opacity-70" style={{ height: motif.h }}>
        <defs>
          <pattern id={patternId} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
            {motif.tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
