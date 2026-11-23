import React from "react";
import { QR_FRAME_FONTS, QR_FRAME_FONT_WIDTH } from "@/constants/qrCodes.constants";
import type { QrFrameFont } from "@/types";

/* ── Text ──────────────────────────────────────────────────────────────── */

interface FitTextProps {
  x: number;
  y: number;
  text: string;
  /** Largest font size; shrinks to fit maxWidth. */
  size: number;
  maxWidth: number;
  fill: string;
  font?: QrFrameFont;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  caps?: boolean;
  /** Letter spacing in px at full size. */
  spacing?: number;
  italic?: boolean;
  opacity?: number;
}

/**
 * SVG text that shrinks to fit a width. It estimates instead of measuring, so
 * it gives the same result on screen, in the PNG and in the print sheet.
 */
export function FitText({
  x, y, text, size, maxWidth, fill, font = "sans", weight = 600, anchor = "middle", caps = false, spacing = 0, italic = false, opacity,
}: FitTextProps) {
  if (!text) return null;
  const shown = caps ? text.toUpperCase() : text;
  const perChar = size * QR_FRAME_FONT_WIDTH[font] * (caps ? 1.14 : 1) + spacing;
  const natural = shown.length * perChar;
  const scale = natural > maxWidth ? maxWidth / natural : 1;
  const fontSize = size * scale;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      opacity={opacity}
      style={{
        fontFamily: QR_FRAME_FONTS[font],
        fontWeight: weight,
        fontSize,
        letterSpacing: spacing * scale,
        fontStyle: italic ? "italic" : "normal",
      }}
    >
      {shown}
    </text>
  );
}

/** Text along a circular arc (stickers). `top` runs clockwise over the top, otherwise under the bottom. */
export function ArcText({
  id, cx, cy, r, text, size, fill, font = "display", weight = 700, top = true, spacing = 4,
}: {
  id: string; cx: number; cy: number; r: number; text: string; size: number; fill: string;
  font?: QrFrameFont; weight?: number; top?: boolean; spacing?: number;
}) {
  if (!text) return null;
  const shown = text.toUpperCase();
  // Keep the text within ~150° of arc.
  const maxLen = Math.PI * r * (150 / 180);
  const perChar = size * QR_FRAME_FONT_WIDTH[font] * 1.14 + spacing;
  const scale = Math.min(1, maxLen / (shown.length * perChar));
  const d = top
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
    : `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
  return (
    <>
      <path id={id} d={d} fill="none" />
      <text
        fill={fill}
        textAnchor="middle"
        dominantBaseline={top ? "auto" : "hanging"}
        style={{ fontFamily: QR_FRAME_FONTS[font], fontWeight: weight, fontSize: size * scale, letterSpacing: spacing * scale }}
      >
        <textPath href={`#${id}`} startOffset="50%">
          {shown}
        </textPath>
      </text>
    </>
  );
}

/* ── Shapes ────────────────────────────────────────────────────────────── */

export function starPoints(cx: number, cy: number, outer: number, inner = outer * 0.45, points = 5, rotation = -90): string {
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((rotation + (i * 180) / points) * Math.PI) / 180;
    out.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return out.join(" ");
}

export function StarRow({ cx, y, count, gap, r, colors }: { cx: number; y: number; count: number; gap: number; r: number; colors: string[] }) {
  const start = cx - ((count - 1) * gap) / 2;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <polygon key={i} points={starPoints(start + i * gap, y, r)} fill={colors[i % colors.length]} />
      ))}
    </g>
  );
}

/** A leafy branch along an arc. Mirror it with `flip` for the other side. */
export function Branch({
  cx, cy, radius, from, to, leaves, leaf, color, flip = false, stem = true,
}: {
  cx: number; cy: number; radius: number; from: number; to: number; leaves: number; leaf: number;
  color: string; flip?: boolean; stem?: boolean;
}) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt = (d: number) => [cx + radius * Math.cos(rad(d)), cy + radius * Math.sin(rad(d))];
  const [sx, sy] = pt(from);
  const [ex, ey] = pt(to);
  const sweep = to > from ? 1 : 0;
  const items = Array.from({ length: leaves }, (_, i) => {
    const t = leaves === 1 ? 0.5 : i / (leaves - 1);
    const d = from + (to - from) * t;
    const [x, y] = pt(d);
    const tangent = d + (to > from ? 90 : -90);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = tangent + side * 38;
    const size = leaf * (0.75 + 0.25 * Math.sin(Math.PI * t));
    return (
      <ellipse key={i} cx={x} cy={y} rx={size / 2} ry={size / 5.2} fill={color} transform={`rotate(${angle} ${x} ${y}) translate(${size / 2.4} 0)`} />
    );
  });
  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      {stem ? (
        <path d={`M ${sx} ${sy} A ${radius} ${radius} 0 0 ${sweep} ${ex} ${ey}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      ) : null}
      {items}
    </g>
  );
}

/** Rosette of petals, used in corners. */
export function Rosette({ cx, cy, r, petals, color, ring }: { cx: number; cy: number; r: number; petals: number; color: string; ring?: string }) {
  return (
    <g>
      {Array.from({ length: petals }, (_, i) => {
        const a = (360 / petals) * i;
        return <ellipse key={i} cx={cx} cy={cy - r * 0.55} rx={r * 0.17} ry={r * 0.45} fill={color} transform={`rotate(${a} ${cx} ${cy})`} />;
      })}
      {Array.from({ length: petals * 2 }, (_, i) => {
        const a = ((360 / (petals * 2)) * i * Math.PI) / 180;
        return <circle key={`d${i}`} cx={cx + Math.cos(a) * r * 1.12} cy={cy + Math.sin(a) * r * 1.12} r={r * 0.045} fill={color} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.22} fill={ring ?? color} />
      <circle cx={cx} cy={cy} r={r * 0.1} fill={color} />
    </g>
  );
}

/** Eight-point star (two overlapping squares), the tile motif. */
export function eightPoint(cx: number, cy: number, r: number): string {
  return starPoints(cx, cy, r, r * 0.72, 8, -90);
}

/** Five-petal flower. */
export function Flower({ cx, cy, r, petal, center }: { cx: number; cy: number; r: number; petal: string; center: string }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const a = ((72 * i - 90) * Math.PI) / 180;
        return <circle key={i} cx={cx + Math.cos(a) * r * 0.55} cy={cy + Math.sin(a) * r * 0.55} r={r * 0.45} fill={petal} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.32} fill={center} />
    </g>
  );
}

/** Scalloped (bumpy) circle outline, e.g. a bottle cap. */
export function scallopCircle(cx: number, cy: number, r: number, bumps: number, depth: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= bumps * 8; i++) {
    const a = (i / (bumps * 8)) * Math.PI * 2;
    const rr = r - depth / 2 + (depth / 2) * Math.cos(a * bumps);
    parts.push(`${i === 0 ? "M" : "L"} ${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `${parts.join(" ")} Z`;
}

/** A sine wave line across a width. */
export function wavePath(x: number, y: number, width: number, amplitude: number, wavelength: number): string {
  let d = `M ${x} ${y}`;
  for (let px = x; px < x + width; px += wavelength / 2) {
    const dir = ((px - x) / (wavelength / 2)) % 2 === 0 ? -1 : 1;
    d += ` q ${wavelength / 4} ${amplitude * dir * 2} ${wavelength / 2} 0`;
  }
  return d;
}

/** Background fill, shared by every frame. */
export function Paper({ w, h, fill, rx = 0 }: { w: number; h: number; fill: string; rx?: number }) {
  return <rect x={0} y={0} width={w} height={h} rx={rx} fill={fill} />;
}

/** A rounded pill with centred text, for table numbers. */
export function Pill({ cx, cy, text, fill, color, font = "display", size = 22, minWidth = 120 }: {
  cx: number; cy: number; text: string; fill: string; color: string; font?: QrFrameFont; size?: number; minWidth?: number;
}) {
  if (!text) return null;
  const width = Math.max(minWidth, text.length * size * 0.62 + size * 1.6);
  const height = size * 1.9;
  return (
    <g>
      <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} rx={height / 2} fill={fill} />
      <FitText x={cx} y={cy + size * 0.36} text={text} size={size} maxWidth={width - size} fill={color} font={font} weight={700} />
    </g>
  );
}

/** Deterministic pseudo-random numbers, so patterns look the same on screen and in print. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Regular polygon points (hexagons, octagons…). */
export function polygonPoints(cx: number, cy: number, r: number, sides: number, rotation = 0): string {
  return Array.from({ length: sides }, (_, i) => {
    const a = ((rotation + (360 / sides) * i) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/** Four-point sparkle. */
export function sparkle(cx: number, cy: number, r: number): string {
  return starPoints(cx, cy, r, r * 0.28, 4, -90);
}

/** Soft glow for neon designs. */
export function GlowFilter({ id, blur = 6 }: { id: string; blur?: number }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={blur} />
    </filter>
  );
}
