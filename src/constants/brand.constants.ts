/**
 * FeastOwl brand: colours, the owl mark's geometry and the public asset paths.
 * Pure data. The mark is drawn on a 128×128 grid; its eyes are the rounded
 * "finder" squares every QR code has.
 */

export const BRAND_COLORS = {
  /** Main brand colour: buttons, links, the logo on light backgrounds. */
  aubergine: '#5B2E85',
  /** Dark surfaces: marketing hero, login panel, app icon tile. */
  plum: '#3B1D4F',
  plumDeep: '#24102F',
  /** The single accent. Never text on white (too faint); fills only. */
  saffron: '#F2B33D',
  ink: '#1C1526',
  chalk: '#F7F5FA',
} as const;

export const OWL_VIEWBOX = '0 0 128 128';

/** Head with two ear tufts. */
export const OWL_BODY_PATH = 'M24 44 L34 14 L52 32 H76 L94 14 L104 44 V98 Q104 116 86 116 H42 Q24 116 24 98 Z';

/** Both eye rings: outer rounded square minus inner rounded square (fill-rule evenodd). */
export const OWL_RINGS_PATH =
  'M40 43 H52 A11 11 0 0 1 63 54 V66 A11 11 0 0 1 52 77 H40 A11 11 0 0 1 29 66 V54 A11 11 0 0 1 40 43 Z ' +
  'M40 49 H52 A5 5 0 0 1 57 54 V66 A5 5 0 0 1 52 71 H40 A5 5 0 0 1 35 66 V54 A5 5 0 0 1 40 49 Z ' +
  'M76 43 H88 A11 11 0 0 1 99 54 V66 A11 11 0 0 1 88 77 H76 A11 11 0 0 1 65 66 V54 A11 11 0 0 1 76 43 Z ' +
  'M76 49 H88 A5 5 0 0 1 93 54 V66 A5 5 0 0 1 88 71 H76 A5 5 0 0 1 71 66 V54 A5 5 0 0 1 76 49 Z';

export const OWL_PUPILS_PATH =
  'M43 54 H49 A3 3 0 0 1 52 57 V63 A3 3 0 0 1 49 66 H43 A3 3 0 0 1 40 63 V57 A3 3 0 0 1 43 54 Z ' +
  'M79 54 H85 A3 3 0 0 1 88 57 V63 A3 3 0 0 1 85 66 H79 A3 3 0 0 1 76 63 V57 A3 3 0 0 1 79 54 Z';

export const OWL_BEAK_PATH = 'M57 84 H71 L64 95 Z';

/**
 * Colour schemes for the mark.
 *  - color:    on light backgrounds
 *  - reversed: on dark backgrounds (saffron owl)
 *  - tile:     the app-icon tile (saffron owl on plum)
 * `mono` (one colour, cut-out eyes) uses currentColor and is not listed here.
 */
export const OWL_PALETTES = {
  color: { body: BRAND_COLORS.aubergine, ring: BRAND_COLORS.chalk, pupil: BRAND_COLORS.saffron, beak: BRAND_COLORS.saffron, tile: null },
  reversed: { body: BRAND_COLORS.saffron, ring: BRAND_COLORS.plumDeep, pupil: BRAND_COLORS.plumDeep, beak: BRAND_COLORS.plumDeep, tile: null },
  tile: { body: BRAND_COLORS.saffron, ring: BRAND_COLORS.plumDeep, pupil: BRAND_COLORS.plumDeep, beak: BRAND_COLORS.plumDeep, tile: BRAND_COLORS.plum },
} as const;

/** Files under public/brand/ (made by scripts/generate-brand-assets.mjs). */
export const BRAND_ASSETS = {
  markSvg: '/brand/feastowl-mark.svg',
  iconSvg: '/brand/feastowl-icon.svg',
  favicon: '/favicon.ico',
  appleTouchIcon: '/brand/apple-touch-icon.png',
  ogImage: '/brand/feastowl-og.png',
  manifest: '/manifest.webmanifest',
} as const;

export const BRAND_OG_IMAGE = { width: 1200, height: 630, alt: 'FeastOwl: QR menu, website and reviews for restaurants' } as const;
