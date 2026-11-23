import {
  DATA_MODULE_STYLES,
  DEFAULT_QR_DESIGN,
  DEFAULT_QR_FRAME,
  FINDER_STYLES,
  QR_FRAMES,
  QR_HEX_COLOR,
  QR_LAYOUTS,
  QR_PREVIEW_TABLE_NUMBER,
  QR_TEXT_LIMITS,
} from '@/constants/qrCodes.constants';
import type { WorkspaceQrCodeConfig, WorkspaceTheme } from '@/types';
import type {
  QrDesign,
  QrDestination,
  QrFrameFormat,
  QrFrameMeta,
  QrFramePalette,
  QrFrameSettings,
  QrLayout,
  QrStyle,
} from '@/types';
import { contrastRatio, isLight, luminance, mostReadable } from './color';
import { mmToPx, resolvePrintSize } from './print';

function hexOr(value: unknown, fallback: string): string {
  return typeof value === 'string' && QR_HEX_COLOR.test(value) ? value : fallback;
}

function textOr(value: unknown, fallback: string, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : fallback;
}

export function frameById(id: string | null | undefined): QrFrameMeta | undefined {
  return QR_FRAMES.find((f) => f.id === id);
}

export function framesFor(format: QrFrameFormat): QrFrameMeta[] {
  return QR_FRAMES.filter((f) => f.format === format);
}

/** Frames drawn for this business type first, then the ones that suit anyone. */
export function recommendedFrames(format: QrFrameFormat, businessType: string | undefined): QrFrameMeta[] {
  const all = framesFor(format);
  const exact = businessType ? all.filter((f) => f.businessTypes.includes(businessType)) : [];
  const universal = all.filter((f) => f.families === 'all' && !exact.includes(f));
  return [...exact, ...universal];
}

function frameIdFor(format: QrFrameFormat, id: unknown, fallback: string): string {
  const frame = typeof id === 'string' ? frameById(id) : undefined;
  return frame && frame.format === format ? frame.id : fallback;
}

/** The selected frame for the current layout, or null for a bare code. */
export function activeFrame(frame: QrFrameSettings): QrFrameMeta | null {
  if (frame.layout === 'none') return null;
  return frameById(frame.layout === 'card' ? frame.cardId : frame.stickerId) ?? null;
}

export function urlFor(destination: QrDestination, urls: { menu: string; website: string }): string {
  return (destination === 'website' ? urls.website : urls.menu) || urls.menu || urls.website;
}

/** Saved config (possibly partial or from an older shape) to the editor's state. */
export function designFromConfig(
  config: Partial<WorkspaceQrCodeConfig> | null | undefined,
  urls: { menu: string; website: string },
): QrDesign {
  const c = config ?? {};
  const f = (c.frame ?? {}) as Partial<QrFrameSettings>;
  const destination: QrDestination =
    c.destination === 'website' || c.destination === 'menu'
      ? c.destination
      : c.url && urls.website && c.url === urls.website
        ? 'website'
        : 'menu';
  const layout = QR_LAYOUTS.includes(f.layout as QrLayout) ? (f.layout as QrLayout) : DEFAULT_QR_FRAME.layout;

  return {
    destination,
    margin: typeof c.margin === 'number' ? Math.max(0, Math.min(8, c.margin)) : DEFAULT_QR_DESIGN.margin,
    dataPattern: DATA_MODULE_STYLES.find((s) => s.value === c.dataPattern)?.value ?? 'square',
    dataColor: hexOr(c.dataColor, DEFAULT_QR_DESIGN.dataColor),
    finderPattern: FINDER_STYLES.find((s) => s.value === c.finderPattern)?.value ?? 'square',
    finderColor: hexOr(c.finderColor, DEFAULT_QR_DESIGN.finderColor),
    backgroundFill: hexOr(c.backgroundFill, DEFAULT_QR_DESIGN.backgroundFill),
    logo: typeof c.logo === 'string' && c.logo ? c.logo : null,
    frame: {
      layout,
      cardId: frameIdFor('card', f.cardId, DEFAULT_QR_FRAME.cardId),
      stickerId: frameIdFor('sticker', f.stickerId, DEFAULT_QR_FRAME.stickerId),
      paper: hexOr(f.paper, DEFAULT_QR_FRAME.paper),
      ink: hexOr(f.ink, DEFAULT_QR_FRAME.ink),
      accent: hexOr(f.accent, DEFAULT_QR_FRAME.accent),
      headline: textOr(f.headline, DEFAULT_QR_FRAME.headline, QR_TEXT_LIMITS.headline),
      subline: textOr(f.subline, DEFAULT_QR_FRAME.subline, QR_TEXT_LIMITS.subline),
      showName: typeof f.showName === 'boolean' ? f.showName : DEFAULT_QR_FRAME.showName,
      tableNumbers: typeof f.tableNumbers === 'boolean' ? f.tableNumbers : DEFAULT_QR_FRAME.tableNumbers,
      tablePrefix: textOr(f.tablePrefix, DEFAULT_QR_FRAME.tablePrefix, QR_TEXT_LIMITS.tablePrefix),
      printSize: resolvePrintSize(layout, f.printSize).id,
    },
  };
}

/** Editor state to the config the API saves. */
export function configFromDesign(design: QrDesign, urls: { menu: string; website: string }): WorkspaceQrCodeConfig {
  const print = resolvePrintSize(design.frame.layout, design.frame.printSize);
  return {
    url: urlFor(design.destination, urls),
    size: mmToPx(print.mm[0]),
    margin: design.margin,
    dataPattern: design.dataPattern,
    dataColor: design.dataColor,
    finderPattern: design.finderPattern,
    finderColor: design.finderColor,
    backgroundFill: design.backgroundFill,
    logo: design.logo,
    destination: design.destination,
    frame: { ...design.frame, printSize: print.id },
  };
}

export function qrStyleOf(design: QrDesign, value: string): QrStyle {
  return {
    value,
    dataPattern: design.dataPattern,
    dataColor: design.dataColor,
    finderPattern: design.finderPattern,
    finderColor: design.finderColor,
    backgroundFill: design.backgroundFill,
    logo: design.logo,
  };
}

/**
 * Applies a frame palette. The code keeps dark-on-light: it sits on the paper
 * when the paper is light enough, otherwise on a white plate.
 */
export function withPalette(design: QrDesign, palette: Pick<QrFramePalette, 'paper' | 'ink' | 'accent'>): QrDesign {
  // Near-white paper carries the code itself; anything more colourful gets a white plate.
  const plate = luminance(palette.paper) > 0.75 && contrastRatio(palette.ink, palette.paper) >= 4.5 ? palette.paper : '#FFFFFF';
  const dots = contrastRatio(palette.ink, plate) >= 4.5 ? palette.ink : '#1C1526';
  const eyes = contrastRatio(palette.accent, plate) >= 3 ? palette.accent : dots;
  return {
    ...design,
    backgroundFill: plate,
    dataColor: dots,
    finderColor: eyes,
    frame: { ...design.frame, paper: palette.paper, ink: palette.ink, accent: palette.accent },
  };
}

/** A palette built from the site's own colours, when it has them. */
export function brandPalette(theme: Partial<WorkspaceTheme> | null | undefined): QrFramePalette | null {
  const primary = hexOr(theme?.primaryColor, '') || hexOr(theme?.accentColor, '');
  if (!primary) return null;
  const textCandidate = hexOr(theme?.textPrimaryColor, '#1C1526');
  const ink = mostReadable('#FFFFFF', [textCandidate, '#1C1526']);
  const paper = hexOr(theme?.sectionBgColor, '#FFFFFF');
  return { id: 'brand', name: 'Your brand', paper: isLight(paper) ? paper : '#FFFFFF', ink, accent: primary };
}

export function tableLabel(frame: QrFrameSettings, n: number | string = QR_PREVIEW_TABLE_NUMBER): string {
  return frame.tableNumbers ? `${frame.tablePrefix.trim()} ${n}`.trim() : '';
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical((value as Record<string, unknown>)[k])]));
  }
  return value;
}

/** Same design, whatever the key order? Used for the unsaved-changes indicator. */
export function sameDesign(a: QrDesign, b: QrDesign): boolean {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}
