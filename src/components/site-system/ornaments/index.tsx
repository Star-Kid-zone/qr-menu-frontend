import type { CSSProperties } from "react";
import type { Palette } from "../types";

/**
 * Skin ornaments (docs/site-system/PLAN.md §2.6): image frames, corner
 * pieces and background textures. All colour comes from the palette or
 * `currentColor`, so every ornament works with every skin.
 * Dividers are the existing ART_MOTIFS (components/templates/sections/art/motifs.tsx).
 */

// ------------------------------------------------------------------ frames
export const FRAME_IDS = ["arch", "rect", "rounded", "organic", "stamp", "sticker", "badge", "glow", "notched", "pixel"] as const;
export type FrameId = (typeof FRAME_IDS)[number];

/**
 * Styles for a photo container in the skin's frame shape. Shapes that need a
 * clip-path keep a rectangle fallback via border-radius.
 */
export function frameStyle(frame: string, palette: Pick<Palette, "accent" | "border">): CSSProperties {
  switch (frame as FrameId) {
    case "arch":
      return { borderRadius: "999px 999px 4px 4px / 50% 50% 4px 4px", overflow: "hidden" };
    case "rounded":
      return { borderRadius: "var(--site-radius, 16px)", overflow: "hidden" };
    case "organic":
      return { borderRadius: "58% 42% 46% 54% / 44% 52% 48% 56%", overflow: "hidden" };
    case "stamp":
      // A rubber-stamp border inset over the photo.
      return { borderRadius: 6, overflow: "hidden", outline: `2px dashed ${palette.accent}`, outlineOffset: -10 };
    case "sticker":
      return { borderRadius: 18, overflow: "hidden", border: `3px solid ${palette.border}`, boxShadow: `6px 6px 0 ${palette.border}` };
    case "badge":
      return { borderRadius: 8, overflow: "hidden", outline: `1.5px solid ${palette.accent}`, outlineOffset: 5 };
    case "glow":
      return { borderRadius: 12, overflow: "hidden", boxShadow: `0 0 0 1px ${palette.accent}, 0 0 28px -4px ${palette.accent}` };
    case "notched":
      return {
        overflow: "hidden",
        clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
      };
    case "pixel":
      return {
        overflow: "hidden",
        clipPath:
          "polygon(0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px))",
      };
    case "rect":
    default:
      return { overflow: "hidden" };
  }
}

// ----------------------------------------------------------------- corners
export const CORNER_IDS = ["none", "fleuron", "deco-fan", "leaf", "bracket", "twine", "tape", "pixel"] as const;
export type CornerId = (typeof CORNER_IDS)[number];

const CORNER_PATHS: Record<Exclude<CornerId, "none">, string> = {
  fleuron: "M2 30V12C2 6.5 6.5 2 12 2h18M8 30V14a6 6 0 0 1 6-6h16M12 18c0-3.3 2.7-6 6-6M14 22a4 4 0 1 1 4 4",
  "deco-fan": "M2 30V2h28M2 2l14 14M2 9a21 21 0 0 1 21 21M2 16a14 14 0 0 1 14 14M2 23a7 7 0 0 1 7 7",
  leaf: "M2 30C2 14 14 2 30 2M8 24c0-6 2-10 7-12-1 5-3 9-7 12zM16 14c2-5 6-7 11-7-2 5-6 7-11 7z",
  bracket: "M2 14V2h12M6 10V6h4",
  // Drawn dashed: a stitched corner.
  twine: "M3 29V11a8 8 0 0 1 8-8h18M8 29V13a5 5 0 0 1 5-5h16",
  tape: "M3 9 9 3l20 20-6 6z",
  pixel: "M2 2h8v4H6v4H2zM14 2h4v4h-4zM2 14h4v4H2z",
};

/**
 * A corner ornament, drawn for the top-left corner. Rotate it for the others:
 * `<OrnamentCorner corner="fleuron" className="absolute right-0 top-0 rotate-90" />`.
 */
export function OrnamentCorner({ corner, size = 32, className, style }: { corner: string; size?: number; className?: string; style?: CSSProperties }) {
  if (corner === "none" || !(corner in CORNER_PATHS)) return null;
  const d = CORNER_PATHS[corner as Exclude<CornerId, "none">];
  const filled = corner === "tape" || corner === "pixel";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden focusable="false" className={className} style={{ color: "var(--site-accent)", ...style }}>
      <path
        d={d}
        fill={filled ? "currentColor" : "none"}
        fillOpacity={corner === "tape" ? 0.35 : 1}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={1.4}
        strokeDasharray={corner === "twine" ? "2.5 3" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------- textures
export const TEXTURE_IDS = [
  "none", "damask", "grain", "paper", "kraft", "blobs", "halftone", "print-grain", "night-gradient", "grid", "frost", "pixel",
] as const;
export type TextureId = (typeof TEXTURE_IDS)[number];

const svgUri = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${body}</svg>`)}")`;

/** Grain without an image request: SVG turbulence, very low opacity. */
const noise = (opacity: number) =>
  svgUri(160, 160, `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`); // svgUri encodes the '#'

/**
 * A page or section background in the skin's texture, tinted from the palette.
 * Returns only background properties, so it layers over `background-color`.
 * Textures stay below 8% ink so text contrast is unaffected.
 */
export function textureBackground(texture: string, palette: Pick<Palette, "text" | "accent">): CSSProperties {
  const ink = palette.text;
  switch (texture as TextureId) {
    case "damask":
      return {
        backgroundImage: svgUri(56, 56,
          `<g fill='none' stroke='${ink}' stroke-opacity='.06' stroke-width='1'><path d='M28 6c6 8 6 14 0 22-6-8-6-14 0-22zM28 28c6 8 6 14 0 22-6-8-6-14 0-22zM6 28c8-6 14-6 22 0-8 6-14 6-22 0zM28 28c8-6 14-6 22 0-8 6-14 6-22 0z'/><circle cx='28' cy='28' r='3'/></g>`),
        backgroundSize: "56px 56px",
      };
    case "grain":
    case "print-grain":
      return { backgroundImage: noise(texture === "grain" ? 0.05 : 0.08) };
    case "paper":
      return {
        backgroundImage: `${noise(0.04)}, repeating-linear-gradient(0deg, transparent 0 31px, color-mix(in srgb, ${ink} 5%, transparent) 31px 32px)`,
      };
    case "kraft":
      return { backgroundImage: `${noise(0.07)}, radial-gradient(ellipse at 20% 0%, color-mix(in srgb, ${palette.accent} 6%, transparent), transparent 60%)` };
    case "blobs":
      return {
        backgroundImage: `radial-gradient(40% 30% at 10% 10%, color-mix(in srgb, ${palette.accent} 9%, transparent), transparent 70%), radial-gradient(35% 30% at 90% 80%, color-mix(in srgb, ${palette.accent} 7%, transparent), transparent 70%)`,
      };
    case "halftone":
      return {
        backgroundImage: `radial-gradient(color-mix(in srgb, ${ink} 9%, transparent) 1.2px, transparent 1.4px)`,
        backgroundSize: "14px 14px",
      };
    case "night-gradient":
      return {
        backgroundImage: `radial-gradient(60% 50% at 80% 0%, color-mix(in srgb, ${palette.accent} 16%, transparent), transparent 70%), radial-gradient(50% 40% at 0% 100%, color-mix(in srgb, ${palette.accent} 10%, transparent), transparent 70%)`,
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(color-mix(in srgb, ${ink} 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${ink} 6%, transparent) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      };
    case "frost":
      return {
        backgroundImage: `radial-gradient(70% 60% at 15% 10%, color-mix(in srgb, ${palette.accent} 12%, transparent), transparent 70%), radial-gradient(60% 50% at 90% 90%, color-mix(in srgb, ${palette.accent} 9%, transparent), transparent 70%)`,
      };
    case "pixel":
      return {
        backgroundImage: `linear-gradient(45deg, color-mix(in srgb, ${ink} 5%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in srgb, ${ink} 5%, transparent) 75%)`,
        backgroundSize: "16px 16px",
      };
    case "none":
    default:
      return {};
  }
}
