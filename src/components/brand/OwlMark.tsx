import { cn } from "@/utils/cn";
import {
  OWL_BEAK_PATH,
  OWL_BODY_PATH,
  OWL_PALETTES,
  OWL_PUPILS_PATH,
  OWL_RINGS_PATH,
  OWL_VIEWBOX,
} from "@/constants/brand.constants";

type OwlMarkVariant = keyof typeof OWL_PALETTES | "mono";

interface OwlMarkProps {
  /** color: light backgrounds · reversed: dark backgrounds · tile: app-icon tile · mono: one colour (currentColor). */
  variant?: OwlMarkVariant;
  className?: string;
  /** Accessible name. Without it the mark is decorative (aria-hidden). */
  title?: string;
}

/** The FeastOwl owl: a head whose eyes are QR finder squares. */
export function OwlMark({ variant = "color", className, title }: OwlMarkProps) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (variant === "mono") {
    // One even-odd path: the rings, pupils and beak are cut out of the head.
    return (
      <svg viewBox={OWL_VIEWBOX} className={cn("size-8", className)} {...a11y}>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d={`${OWL_BODY_PATH} ${OWL_RINGS_PATH} ${OWL_PUPILS_PATH} ${OWL_BEAK_PATH}`}
        />
      </svg>
    );
  }

  const p = OWL_PALETTES[variant];
  return (
    <svg viewBox={OWL_VIEWBOX} className={cn("size-8", className)} {...a11y}>
      {p.tile ? <rect width="128" height="128" rx="28" fill={p.tile} /> : null}
      <g transform={p.tile ? "translate(64 66) scale(0.84) translate(-64 -65)" : undefined}>
        <path fill={p.body} d={OWL_BODY_PATH} />
        <path fill={p.ring} fillRule="evenodd" d={OWL_RINGS_PATH} />
        <path fill={p.pupil} d={OWL_PUPILS_PATH} />
        <path fill={p.beak} d={OWL_BEAK_PATH} />
      </g>
    </svg>
  );
}
