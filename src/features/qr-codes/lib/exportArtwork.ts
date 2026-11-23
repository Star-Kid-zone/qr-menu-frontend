import { SVG_NS } from '@/constants/qrCodes.constants';
import { qrAssetsService } from '@/services/qrAssets.service';

/**
 * Turns the on-screen artwork into files. The preview, the PNG, the SVG and
 * the print sheet are all the same SVG, so what owners see is what prints.
 * Fonts are embedded as data URLs because an SVG drawn as an image (for the
 * PNG) or opened elsewhere cannot reach the page's web fonts.
 */

const fontDataCache = new Map<string, Promise<string>>();

function cleanFamily(name: string): string {
  return name.trim().replace(/^['"]|['"]$/g, '');
}

function fontFaceRules(families: Set<string>): CSSFontFaceRule[] {
  const found: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin sheet
    }
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSFontFaceRule && families.has(cleanFamily(rule.style.getPropertyValue('font-family')))) {
        found.push(rule);
      }
    }
  }
  return found;
}

async function inlineRule(rule: CSSFontFaceRule): Promise<string> {
  const css = rule.cssText;
  const match = /url\((['"]?)([^'")]+)\1\)/.exec(css);
  if (!match) return css;
  const base = rule.parentStyleSheet?.href ?? document.baseURI;
  const absolute = new URL(match[2], base).href;
  let pending = fontDataCache.get(absolute);
  if (!pending) {
    pending = qrAssetsService.fetchAsDataUrl(absolute);
    fontDataCache.set(absolute, pending);
    pending.catch(() => fontDataCache.delete(absolute));
  }
  try {
    const data = await pending;
    return css.replace(match[0], `url("${data}")`);
  } catch {
    return ''; // fall back to the stack's system font
  }
}

/** A detached copy of the artwork with resolved font names, plus the @font-face CSS it needs. */
export async function prepareArtwork(svg: SVGSVGElement): Promise<{ clone: SVGSVGElement; fontCss: string }> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const liveTexts = svg.querySelectorAll('text');
  const cloneTexts = clone.querySelectorAll('text');
  const families = new Set<string>();
  liveTexts.forEach((text, i) => {
    const family = getComputedStyle(text).fontFamily;
    cloneTexts[i]?.style.setProperty('font-family', family);
    family.split(',').forEach((f) => families.add(cleanFamily(f)));
  });
  clone.removeAttribute('class');
  clone.removeAttribute('style');
  clone.setAttribute('xmlns', SVG_NS);
  const faces = await Promise.all(fontFaceRules(families).map(inlineRule));
  return { clone, fontCss: faces.filter(Boolean).join('\n') };
}

/** Serialises the prepared copy at a given size, optionally with fonts inside. */
export function toSvgString(clone: SVGSVGElement, width: string, height: string, fontCss = ''): string {
  const copy = clone.cloneNode(true) as SVGSVGElement;
  copy.setAttribute('width', width);
  copy.setAttribute('height', height);
  if (fontCss) {
    const style = document.createElementNS(SVG_NS, 'style');
    style.textContent = fontCss;
    copy.insertBefore(style, copy.firstChild);
  }
  return new XMLSerializer().serializeToString(copy);
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSvg(markup: string, fileName: string) {
  saveBlob(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }), fileName);
}

/** Rasterises SVG markup (with its fonts embedded) to a PNG of exactly width × height. */
export async function svgToPng(markup: string, width: number, height: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadPng(markup: string, width: number, height: number, fileName: string) {
  saveBlob(await svgToPng(markup, width, height), fileName);
}

/** Prints an HTML document from a hidden frame, then cleans up. */
export function printHtml(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    const cleanup = () => window.setTimeout(() => frame.remove(), 500);
    frame.onload = async () => {
      try {
        const win = frame.contentWindow;
        if (!win) throw new Error('Print frame unavailable');
        await win.document.fonts?.ready;
        win.addEventListener('afterprint', cleanup, { once: true });
        win.focus();
        win.print();
        resolve();
      } catch (err) {
        frame.remove();
        reject(err);
      }
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
  });
}

export function slugFileName(base: string, suffix: string, ext: string): string {
  const safe = (base || 'menu').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  return `${safe || 'menu'}-${suffix}.${ext}`;
}
