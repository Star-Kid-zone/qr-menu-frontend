/** Colour parsing helpers. Alpha is ignored (treated as opaque). */
import type { Readability } from "@/types";

export type { Readability };

export function parseHex(input: string | null | undefined): [number, number, number] | null {
  if (!input) return null;
  const m = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length <= 4) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Normalises a CSS computed colour (`rgb()/rgba()`) or hex to lowercase `#rrggbb`; transparent → null. */
export function toHex6(input: string | null | undefined): string | null {
  if (!input) return null;
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(input.trim());
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    if (alpha === 0) return null;
    return "#" + [rgb[1], rgb[2], rgb[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  }
  const parsed = parseHex(input);
  if (!parsed) return null;
  return "#" + parsed.map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** WCAG 2.x relative luminance of a hex colour; null when it isn't a hex colour. */
function luminance(hex: string): number | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours (1–21), or null if either isn't a hex colour. */
export function contrastRatio(a: string | null | undefined, b: string | null | undefined): number | null {
  const la = a ? luminance(a) : null;
  const lb = b ? luminance(b) : null;
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA buckets: ≥4.5 normal text, ≥3 large text only, otherwise hard to read. */
export function readability(ratio: number): Readability {
  return ratio >= 4.5 ? "good" : ratio >= 3 ? "large-only" : "poor";
}
