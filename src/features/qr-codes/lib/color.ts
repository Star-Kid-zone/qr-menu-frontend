/** Colour maths for the scan check and for picking readable text. */

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{3}|[a-f\d]{6})([a-f\d]{2})?$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** WCAG relative luminance, 0 (black) to 1 (white). Unknown colours count as white. */
export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function isLight(hex: string): boolean {
  return luminance(hex) > 0.45;
}

/** Of the candidates, the one that reads best on `background`. */
export function mostReadable(background: string, candidates: string[]): string {
  return candidates.reduce((best, c) => (contrastRatio(c, background) > contrastRatio(best, background) ? c : best), candidates[0]);
}
