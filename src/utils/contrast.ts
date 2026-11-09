/** Colour parsing helpers. Alpha is ignored (treated as opaque). */

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
