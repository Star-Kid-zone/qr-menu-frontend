"use client";

import { useId, type CSSProperties } from "react";
import type { IconStyle } from "../types";
import { useOptionalSiteLook } from "../SiteLookContext";
import { getGlyph, type Glyph } from "./glyphs";

/**
 * One icon in the site's icon style (docs/site-system/PLAN.md §2.7).
 *
 * Colour comes from `currentColor`, so an icon takes the colour of the text
 * around it. The style comes from the skin (SiteLookContext) unless
 * `iconStyle` is passed. With a `title` the icon is announced; without one it
 * is decorative and hidden from assistive tech.
 */
export interface SiteIconProps {
  name: string;
  size?: number | string;
  title?: string;
  iconStyle?: IconStyle;
  /** Needed only by the pixel style, which is drawn as an image and can't use currentColor. */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const STROKE = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** A drawing's SVG body for one style (no outer <svg>). `uid` keeps filter/pattern ids unique on the page. */
function renderGlyph(g: Glyph, style: IconStyle, uid: string) {
  const area = g.f ?? g.o;
  const solid = g.s ? <path d={g.s} fill="currentColor" stroke="none" /> : null;
  // Outline-only drawings (wifi, arrows, a cross) have no closed area to fill.
  const fillable = Boolean(g.f) || /z\s*$/i.test(g.o.trim());

  switch (style) {
    case "fine-line":
      return (
        <>
          <path d={g.o} {...STROKE} strokeWidth={1.15} />
          {g.d && <path d={g.d} {...STROKE} strokeWidth={1.15} />}
          {solid}
        </>
      );
    case "filled":
      if (!fillable) {
        return (
          <>
            <path d={g.o} {...STROKE} strokeWidth={2.4} />
            {g.d && <path d={g.d} {...STROKE} strokeWidth={2.4} />}
            {solid}
          </>
        );
      }
      {
        // Details are knocked out where they cross the filled shape and inked where
        // they leave it (a magnifier's handle, a share icon's links).
        const inside = `${uid}-in`;
        const outside = `${uid}-out`;
        const knockout = "var(--icon-knockout, var(--site-surface, #fff))";
        return (
          <>
            <defs>
              <clipPath id={inside}><path d={area} /></clipPath>
              <mask id={outside} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#fff" />
                <path d={area} fill="#000" />
              </mask>
            </defs>
            <path d={area} fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
            {g.f && <path d={g.o} {...STROKE} strokeWidth={1.5} />}
            {g.d && <path d={g.d} {...STROKE} stroke={knockout} strokeWidth={1.5} clipPath={`url(#${inside})`} />}
            {g.d && <path d={g.d} {...STROKE} strokeWidth={1.5} mask={`url(#${outside})`} />}
            {g.s && <path d={g.s} fill={knockout} stroke="none" clipPath={`url(#${inside})`} />}
            {g.s && <path d={g.s} fill="currentColor" stroke="none" mask={`url(#${outside})`} />}
          </>
        );
      }
    case "duotone":
      return (
        <>
          {fillable && <path d={area} fill="currentColor" fillOpacity={0.22} stroke="none" />}
          <path d={g.o} {...STROKE} strokeWidth={1.6} />
          {g.d && <path d={g.d} {...STROKE} strokeWidth={1.6} />}
          {solid}
        </>
      );
    case "neon":
      return (
        <g style={{ filter: "drop-shadow(0 0 1.2px currentColor) drop-shadow(0 0 3.5px currentColor)" }}>
          <path d={g.o} {...STROKE} strokeWidth={1.5} />
          {g.d && <path d={g.d} {...STROKE} strokeWidth={1.5} />}
          {solid}
        </g>
      );
    case "engraved": {
      const hatch = `${uid}-hatch`;
      return (
        <>
          <defs>
            <pattern id={hatch} width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="2.4" stroke="currentColor" strokeWidth="0.7" />
            </pattern>
          </defs>
          {fillable && <path d={area} fill={`url(#${hatch})`} stroke="none" opacity={0.75} />}
          <path d={g.o} {...STROKE} strokeWidth={1.45} />
          {g.d && <path d={g.d} {...STROKE} strokeWidth={1} />}
          {solid}
        </>
      );
    }
    case "hand-drawn": {
      const wobble = `${uid}-wobble`;
      return (
        <>
          <defs>
            <filter id={wobble} x="-10%" y="-10%" width="120%" height="120%">
              {/* Low frequency + larger shift = lines that waver like ink, not jitter. */}
              <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="2.2" />
            </filter>
          </defs>
          <g filter={`url(#${wobble})`}>
            <path d={g.o} {...STROKE} strokeWidth={1.8} />
            {/* A second, slightly offset pass reads as a pen going over the line twice. */}
            <path d={g.o} {...STROKE} strokeWidth={0.9} opacity={0.55} transform="translate(0.35 0.3)" />
            {g.d && <path d={g.d} {...STROKE} strokeWidth={1.6} />}
            {solid}
          </g>
        </>
      );
    }
    case "pixel":
    case "line":
    default:
      return (
        <>
          <path d={g.o} {...STROKE} strokeWidth={1.75} />
          {g.d && <path d={g.d} {...STROKE} strokeWidth={1.75} />}
          {solid}
        </>
      );
  }
}

/** The pixel style: the line drawing rasterised on a 12×12 grid, then scaled up without smoothing. */
function pixelDataUri(g: Glyph, color: string): string {
  const esc = (d: string) => d.replace(/"/g, "'");
  const stroke = `fill='none' stroke='${color}' stroke-width='2.2' stroke-linecap='square' stroke-linejoin='miter'`;
  const body =
    `<path d="${esc(g.o)}" ${stroke}/>` +
    (g.d ? `<path d="${esc(g.d)}" ${stroke}/>` : "") +
    (g.s ? `<path d="${esc(g.s)}" fill='${color}'/>` : "");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' shape-rendering='crispEdges'>${body}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function SiteIcon({ name, size = 24, title, iconStyle, color, className, style }: SiteIconProps) {
  const look = useOptionalSiteLook();
  const uid = useId().replace(/:/g, "");
  const glyph = getGlyph(name);
  if (!glyph) return null;

  const resolved: IconStyle = iconStyle ?? look?.iconStyle ?? "line";
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };

  if (resolved === "pixel") {
    const ink = color ?? look?.palette.text ?? "#111111";
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a 12px data URI; next/image adds nothing here
      <img
        src={pixelDataUri(glyph, ink)}
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        alt={title ?? ""}
        {...(title ? {} : { "aria-hidden": true })}
        className={className}
        style={{ imageRendering: "pixelated", width: size, height: size, display: "inline-block", ...style }}
        data-icon={name}
        data-icon-style="pixel"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ color, flexShrink: 0, ...style }}
      focusable="false"
      data-icon={name}
      data-icon-style={resolved}
      {...a11y}
    >
      {title && <title>{title}</title>}
      {renderGlyph(glyph, resolved, `si${uid}`)}
    </svg>
  );
}
