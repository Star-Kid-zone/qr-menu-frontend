import type { WorkspaceQrCodeConfig } from '@/services/workspace.service';
import type {
  DataModuleStyle,
  FinderPatternStyle,
  QrDesign,
  QrDestination,
  QrEditorTab,
  QrFrameFamily,
  QrFrameFont,
  QrFrameMeta,
  QrFrameSettings,
  QrLayout,
  QrPrintSize,
  QrTextPreset,
} from '@/types';

export type { FinderPatternStyle, DataModuleStyle };

export const FINDER_STYLES: { value: FinderPatternStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'leaf-lg', label: 'Leaf' },
  { value: 'pinched-square', label: 'Pinched' },
  { value: 'heart', label: 'Heart' },
];

export const DATA_MODULE_STYLES: { value: DataModuleStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'box', label: 'Small square' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'vertical-line', label: 'Vertical lines' },
  { value: 'horizontal-line', label: 'Horizontal lines' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'plus', label: 'Plus' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'circuit-board', label: 'Circuit' },
];

/** Dot shapes that phone cameras read less reliably; the page asks owners to test these. */
export const QR_FANCY_DOT_STYLES: readonly DataModuleStyle[] = ['star', 'heart', 'circuit-board', 'plus', 'diamond'];

export const DEFAULT_QR_CONFIG: WorkspaceQrCodeConfig = {
  url: '',
  size: 591,
  margin: 4,
  dataPattern: 'square',
  dataColor: '#1C1526',
  finderPattern: 'square',
  finderColor: '#1C1526',
  backgroundFill: '#ffffff',
  logo: null,
};

/** Dark dots on a light background only: light-on-dark codes fail on some phone cameras. */
export const RANDOM_COLOR_PRESETS = [
  { name: 'Ink', bg: '#ffffff', module: '#1C1526', finder: '#1C1526' },
  { name: 'Aubergine & saffron', bg: '#ffffff', module: '#3B1D4F', finder: '#5B2E85' },
  { name: 'Midnight navy', bg: '#ffffff', module: '#1e1b4b', finder: '#312e81' },
  { name: 'Emerald & cream', bg: '#fafaf9', module: '#064e3b', finder: '#047857' },
  { name: 'Crimson', bg: '#fff1f2', module: '#881337', finder: '#be123c' },
  { name: 'Deep teal', bg: '#f0fdfa', module: '#134e4a', finder: '#0f766e' },
  { name: 'Espresso', bg: '#fffbeb', module: '#451a03', finder: '#78350f' },
  { name: 'Ocean', bg: '#f0f9ff', module: '#075985', finder: '#0369a1' },
  { name: 'Terracotta', bg: '#fef2f2', module: '#7c2d12', finder: '#c2410c' },
  { name: 'Forest', bg: '#f0fdf4', module: '#14532d', finder: '#15803d' },
  { name: 'Berry', bg: '#fdf2f8', module: '#701a75', finder: '#a21caf' },
  { name: 'Slate', bg: '#f8fafc', module: '#1e293b', finder: '#334155' },
] as const;

/* ── Scanning ──────────────────────────────────────────────────────────── */

export const QR_SCAN_RULES = {
  /** WCAG-style contrast ratio between dots and background. */
  minContrast: 3,
  goodContrast: 4.5,
  /** Below this the code is hard to scan from a table. */
  minPrintMm: 20,
  /** A code scans from about ten times its own width. */
  scanDistanceFactor: 10,
  minQuietZone: 2,
} as const;

/** Logo share of the code's width. Kept small so the strongest error correction covers it. */
export const QR_LOGO_RATIO = 0.22;
export const QR_LOGO_MAX_PX = 256;
export const QR_LOGO_MAX_FILE_BYTES = 8 * 1024 * 1024;
export const QR_LOGO_ACCEPT = 'image/png,image/jpeg,image/webp,image/svg+xml';

/* ── Frames ────────────────────────────────────────────────────────────── */

/** Frame artwork coordinate space (A-series portrait card and a square sticker). */
export const QR_FRAME_VIEWBOX: Record<QrLayout, [number, number]> = {
  none: [600, 600],
  card: [600, 846],
  sticker: [600, 600],
};

/** About how much of a frame's width the code takes (frames are drawn to these proportions). */
export const QR_FRAME_QR_SHARE: Record<QrLayout, number> = { none: 1, card: 0.5, sticker: 0.5 };

/** Each role maps to a font loaded in app/layout.tsx. */
export const QR_FRAME_FONTS: Record<QrFrameFont, string> = {
  serif: 'var(--font-fraunces), Georgia, serif',
  text: 'var(--font-newsreader), Georgia, serif',
  sans: 'var(--font-plus-jakarta-sans), Arial, sans-serif',
  display: 'var(--font-outfit), Arial, sans-serif',
  mono: 'var(--font-space-mono), "Courier New", monospace',
};

/** Average glyph width as a share of font size, for fitting text without measuring. */
export const QR_FRAME_FONT_WIDTH: Record<QrFrameFont, number> = {
  serif: 0.56,
  text: 0.5,
  sans: 0.58,
  display: 0.55,
  mono: 0.61,
};

export const QR_FRAME_FAMILY_LABELS: Record<QrFrameFamily, string> = {
  restaurants: 'Restaurants',
  'quick-casual': 'Quick & casual',
  'cafes-sweets': 'Cafés & sweets',
  'bars-lounges': 'Bars & lounges',
  shops: 'Shops',
  other: 'Other',
};

export const QR_EDITOR_TABS: { id: QrEditorTab; label: string }[] = [
  { id: 'frame', label: 'Frame' },
  { id: 'text', label: 'Text' },
  { id: 'style', label: 'QR style' },
  { id: 'link', label: 'Link' },
];

export const QR_LAYOUTS: readonly QrLayout[] = ['none', 'card', 'sticker'];
export const QR_HEX_COLOR = /^#([a-f\d]{6})$/i;

export const QR_LAYOUT_OPTIONS:{ id: QrLayout; label: string }[] = [
  { id: 'card', label: 'Table card' },
  { id: 'sticker', label: 'Sticker' },
  { id: 'none', label: 'QR only' },
];

export const QR_FRAMES: QrFrameMeta[] = [
  /* Table cards: any business */
  {
    id: 'classic', name: 'Clean card', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'ink', name: 'Ink', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'cream', name: 'Cream', paper: '#FBF6EC', ink: '#2B2118', accent: '#B4532A' },
      { id: 'sage', name: 'Sage', paper: '#EEF2EA', ink: '#1F3326', accent: '#4F7A5A' },
    ],
  },
  {
    id: 'scan-tab', name: 'Scan tab', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'aubergine', name: 'Aubergine', paper: '#F7F5FA', ink: '#24102F', accent: '#5B2E85' },
      { id: 'saffron', name: 'Saffron', paper: '#FFF8E8', ink: '#2A1B05', accent: '#A86A06' },
      { id: 'mono', name: 'Mono', paper: '#FFFFFF', ink: '#111111', accent: '#111111' },
    ],
  },
  {
    id: 'arch', name: 'Arch window', format: 'card', families: 'all', businessTypes: ['cafe', 'bakery-patisserie', 'healthy-vegan'],
    palettes: [
      { id: 'terracotta', name: 'Terracotta', paper: '#C8643B', ink: '#2B160C', accent: '#FBE9D9' },
      { id: 'olive', name: 'Olive', paper: '#5E6B3A', ink: '#1E2410', accent: '#F1EBD6' },
      { id: 'blush', name: 'Blush', paper: '#E9B8A8', ink: '#3A1E17', accent: '#FFF5F0' },
    ],
  },
  {
    id: 'ticket', name: 'Ticket', format: 'card', families: 'all', businessTypes: ['street-food', 'fast-food', 'burger-joint'],
    palettes: [
      { id: 'mustard', name: 'Mustard', paper: '#F2B33D', ink: '#1C1526', accent: '#FFFFFF' },
      { id: 'red', name: 'Diner red', paper: '#C8352B', ink: '#FFF4E6', accent: '#F2B33D' },
      { id: 'teal', name: 'Teal', paper: '#1E6F6A', ink: '#F4EBDD', accent: '#F2B33D' },
    ],
  },
  {
    id: 'bloom', name: 'Bloom', format: 'card', families: ['cafes-sweets', 'shops', 'other'], businessTypes: ['desserts-ice-cream', 'gourmet-hampers', 'generic'],
    palettes: [
      { id: 'garden', name: 'Garden', paper: '#FDF1E6', ink: '#2A1A12', accent: '#D9472B' },
      { id: 'indigo', name: 'Indigo', paper: '#F3F1FB', ink: '#1D1A3A', accent: '#4B47B8' },
      { id: 'rose', name: 'Rose', paper: '#FFF0F2', ink: '#3A1220', accent: '#C2386B' },
    ],
  },
  /* Restaurants */
  {
    id: 'trattoria', name: 'Trattoria', format: 'card', families: ['restaurants'], businessTypes: ['italian-trattoria', 'pizzeria'],
    palettes: [
      { id: 'rosso', name: 'Rosso', paper: '#FBF6EC', ink: '#2B1A14', accent: '#B8322A' },
      { id: 'verde', name: 'Verde', paper: '#F6F4EA', ink: '#1E2A1A', accent: '#3E7A3A' },
      { id: 'blu', name: 'Blu', paper: '#F5F6FA', ink: '#172036', accent: '#2F4D8A' },
    ],
  },
  {
    id: 'deco', name: 'Deco', format: 'card', families: ['restaurants'], businessTypes: ['fine-dining', 'steakhouse'],
    palettes: [
      { id: 'noir', name: 'Noir & gold', paper: '#15121A', ink: '#F4E9D0', accent: '#C9A24A' },
      { id: 'ivory', name: 'Ivory & gold', paper: '#FAF5EA', ink: '#211A10', accent: '#A9822F' },
      { id: 'emerald', name: 'Emerald', paper: '#0F2A22', ink: '#F1E8D2', accent: '#C9A24A' },
    ],
  },
  {
    id: 'mandala', name: 'Mandala', format: 'card', families: ['restaurants', 'cafes-sweets'], businessTypes: ['north-indian', 'south-indian', 'biryani-house', 'indian-sweets', 'chai-tea-house'],
    palettes: [
      { id: 'marigold', name: 'Marigold', paper: '#FFF6E5', ink: '#3A1608', accent: '#D9631E' },
      { id: 'peacock', name: 'Peacock', paper: '#EAF4F2', ink: '#0D2B33', accent: '#0F7C7A' },
      { id: 'kumkum', name: 'Kumkum', paper: '#FFF1EC', ink: '#3B0A0A', accent: '#B3202A' },
    ],
  },
  {
    id: 'waves', name: 'Waves', format: 'card', families: ['restaurants'], businessTypes: ['chinese', 'japanese', 'sushi-bar', 'thai-pan-asian'],
    palettes: [
      { id: 'indigo', name: 'Indigo', paper: '#F7F3EA', ink: '#141B33', accent: '#26407A' },
      { id: 'vermilion', name: 'Vermilion', paper: '#FBF4EA', ink: '#25120C', accent: '#C23B22' },
      { id: 'matcha', name: 'Matcha', paper: '#F1F3E6', ink: '#1C2414', accent: '#5D7A2C' },
    ],
  },
  {
    id: 'tiles', name: 'Tiles', format: 'card', families: ['restaurants'], businessTypes: ['lebanese-mezze', 'turkish-grill', 'arabian-mandi', 'shawarma-wraps'],
    palettes: [
      { id: 'iznik', name: 'Iznik', paper: '#F6F3EC', ink: '#10233F', accent: '#1F5FA8' },
      { id: 'saffron', name: 'Saffron', paper: '#FBF3E2', ink: '#2E1A07', accent: '#C27C0E' },
      { id: 'cedar', name: 'Cedar', paper: '#EFF3EC', ink: '#13281C', accent: '#2E6B45' },
    ],
  },
  {
    id: 'bunting', name: 'Bunting', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['mexican'],
    palettes: [
      { id: 'fiesta', name: 'Fiesta', paper: '#FFF8EC', ink: '#24140A', accent: '#E0457B' },
      { id: 'lime', name: 'Lime', paper: '#F7FAEC', ink: '#1A2410', accent: '#2F9E6B' },
      { id: 'cobalt', name: 'Cobalt', paper: '#F3F6FC', ink: '#0E1A33', accent: '#2563C9' },
    ],
  },
  {
    id: 'harbour', name: 'Harbour', format: 'card', families: ['restaurants'], businessTypes: ['seafood'],
    palettes: [
      { id: 'navy', name: 'Navy', paper: '#F2F5F8', ink: '#0F2238', accent: '#1F4E79' },
      { id: 'coral', name: 'Coral', paper: '#FFF5F0', ink: '#2A1510', accent: '#D4593A' },
      { id: 'sand', name: 'Sand', paper: '#F7F0E2', ink: '#1F2A33', accent: '#3C7A8C' },
    ],
  },
  /* Quick & casual */
  {
    id: 'awning', name: 'Awning', format: 'card', families: ['quick-casual'], businessTypes: ['street-food', 'burger-joint', 'fast-food', 'shawarma-wraps'],
    palettes: [
      { id: 'cherry', name: 'Cherry', paper: '#FFF9F0', ink: '#1E0F0B', accent: '#D7352B' },
      { id: 'sunny', name: 'Sunny', paper: '#FFFBEF', ink: '#221A06', accent: '#E3A11A' },
      { id: 'mint', name: 'Mint', paper: '#F3FBF7', ink: '#0E2A20', accent: '#1E8A63' },
    ],
  },
  {
    id: 'sprig', name: 'Fresh sprig', format: 'card', families: ['quick-casual', 'cafes-sweets'], businessTypes: ['healthy-vegan', 'juice-bar'],
    palettes: [
      { id: 'leaf', name: 'Leaf', paper: '#F3F8EE', ink: '#16301C', accent: '#3F8A3C' },
      { id: 'citrus', name: 'Citrus', paper: '#FFF9EA', ink: '#2A2108', accent: '#E08A12' },
      { id: 'berry', name: 'Berry', paper: '#FBF1F5', ink: '#2E1020', accent: '#A8326A' },
    ],
  },
  /* Cafés & sweets */
  {
    id: 'steam', name: 'Coffee steam', format: 'card', families: ['cafes-sweets'], businessTypes: ['cafe', 'chai-tea-house'],
    palettes: [
      { id: 'latte', name: 'Latte', paper: '#F5EDE2', ink: '#2B1A10', accent: '#8A5A3B' },
      { id: 'espresso', name: 'Espresso', paper: '#2A1C14', ink: '#F5EBDD', accent: '#D8A86B' },
      { id: 'oat', name: 'Oat', paper: '#FAF6EE', ink: '#262019', accent: '#6E7F4F' },
    ],
  },
  {
    id: 'lace', name: 'Lace', format: 'card', families: ['cafes-sweets', 'shops'], businessTypes: ['bakery-patisserie', 'desserts-ice-cream', 'chocolatier', 'indian-sweets'],
    palettes: [
      { id: 'pistachio', name: 'Pistachio', paper: '#EFF5E6', ink: '#24301A', accent: '#7FA35A' },
      { id: 'strawberry', name: 'Strawberry', paper: '#FFF0F1', ink: '#3A1218', accent: '#D24D63' },
      { id: 'cocoa', name: 'Cocoa', paper: '#F6EEE6', ink: '#2A170D', accent: '#7A4A2A' },
    ],
  },
  /* Bars & lounges */
  {
    id: 'laurel', name: 'Laurels & stars', format: 'card', families: ['bars-lounges'], businessTypes: ['cocktail-bar', 'shisha-lounge', 'pub'],
    palettes: [
      { id: 'vintage', name: 'Vintage', paper: '#EEDDB5', ink: '#2F4A5E', accent: '#D9663A' },
      { id: 'night', name: 'Night', paper: '#1A2233', ink: '#F2E6C9', accent: '#E0A23A' },
      { id: 'bottle', name: 'Bottle', paper: '#E8EEDF', ink: '#1E3A2A', accent: '#B5462B' },
    ],
  },
  {
    id: 'hops', name: 'Taproom', format: 'card', families: ['bars-lounges'], businessTypes: ['brewery-taproom', 'pub'],
    palettes: [
      { id: 'amber', name: 'Amber', paper: '#F7EBD3', ink: '#2A1A08', accent: '#C2761A' },
      { id: 'stout', name: 'Stout', paper: '#1C1712', ink: '#F3E7D0', accent: '#D49A3A' },
      { id: 'pale', name: 'Pale ale', paper: '#F4F2E6', ink: '#232A12', accent: '#7C9A2E' },
    ],
  },
  {
    id: 'vine', name: 'Vine', format: 'card', families: ['bars-lounges', 'shops'], businessTypes: ['wine-bar', 'wine-shop'],
    palettes: [
      { id: 'bordeaux', name: 'Bordeaux', paper: '#F8F1EA', ink: '#2A0F18', accent: '#7A1F3A' },
      { id: 'rose', name: 'Rosé', paper: '#FCEFEA', ink: '#3A1A1A', accent: '#C2627A' },
      { id: 'cellar', name: 'Cellar', paper: '#20141A', ink: '#F1E4DA', accent: '#B68A5A' },
    ],
  },
  /* Shops */
  {
    id: 'tag', name: 'Gift tag', format: 'card', families: ['shops'], businessTypes: ['cheese-deli', 'gourmet-hampers', 'chocolatier', 'wine-shop'],
    palettes: [
      { id: 'kraft', name: 'Kraft', paper: '#D9B98C', ink: '#2A1A0C', accent: '#FFFFFF' },
      { id: 'forest', name: 'Forest', paper: '#2E4A3A', ink: '#0E1A13', accent: '#F3EAD6' },
      { id: 'plum', name: 'Plum', paper: '#5B2E85', ink: '#1C0D2A', accent: '#F2B33D' },
    ],
  },

  /* Table cards, second collection: any business */
  {
    id: 'viewfinder', name: 'Viewfinder', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'ink', name: 'Ink', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'coral', name: 'Coral', paper: '#FFF4EF', ink: '#2A1510', accent: '#E4573D' },
      { id: 'mint', name: 'Mint', paper: '#EFFAF5', ink: '#0E2A20', accent: '#14946B' },
    ],
  },
  {
    id: 'geo', name: 'Geometric', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'bauhaus', name: 'Bauhaus', paper: '#F4EFE6', ink: '#1A1A1A', accent: '#D9442B' },
      { id: 'blue', name: 'Blue', paper: '#F2F4F8', ink: '#14213A', accent: '#2563C9' },
      { id: 'mustard', name: 'Mustard', paper: '#FBF5E6', ink: '#1F1A10', accent: '#D99A1E' },
    ],
  },
  {
    id: 'polaroid', name: 'Snapshot', format: 'card', families: 'all', businessTypes: ['cafe'],
    palettes: [
      { id: 'blush', name: 'Blush', paper: '#F6E3DC', ink: '#2A1A16', accent: '#E0A43A' },
      { id: 'sky', name: 'Sky', paper: '#E3EEF6', ink: '#14263A', accent: '#E46B4F' },
      { id: 'sage', name: 'Sage', paper: '#E4EDE2', ink: '#1C2B1E', accent: '#D9A13A' },
    ],
  },
  {
    id: 'postcard', name: 'Postcard', format: 'card', families: 'all', businessTypes: ['seafood'],
    palettes: [
      { id: 'airmail', name: 'Airmail', paper: '#FBF7EE', ink: '#1C2A4A', accent: '#C8352B' },
      { id: 'green', name: 'Green', paper: '#F6F4EA', ink: '#1E2A1A', accent: '#2E7D4F' },
      { id: 'plum', name: 'Plum', paper: '#F7F3F8', ink: '#2A1530', accent: '#5B2E85' },
    ],
  },
  {
    id: 'ribbon', name: 'Ribbon', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'scarlet', name: 'Scarlet', paper: '#FFF9F2', ink: '#2A1510', accent: '#C2342B' },
      { id: 'navy', name: 'Navy', paper: '#F5F7FB', ink: '#14213A', accent: '#1F3F7A' },
      { id: 'gold', name: 'Gold', paper: '#FBF6EA', ink: '#211A10', accent: '#9A6C14' },
    ],
  },
  {
    id: 'terrazzo', name: 'Terrazzo', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'blush', name: 'Blush', paper: '#FAF5F0', ink: '#2A1F1A', accent: '#D9806A' },
      { id: 'ocean', name: 'Ocean', paper: '#F4F7F8', ink: '#162630', accent: '#4F8FA8' },
      { id: 'olive', name: 'Olive', paper: '#F7F6EF', ink: '#22261A', accent: '#7A8A3A' },
    ],
  },
  {
    id: 'retro', name: 'Seventies', format: 'card', families: 'all', businessTypes: ['juice-bar'],
    palettes: [
      { id: 'sunset', name: 'Sunset', paper: '#FFF4E2', ink: '#3A1C0C', accent: '#E8742C' },
      { id: 'mustard', name: 'Mustard', paper: '#F7EFD9', ink: '#3B2412', accent: '#C8902A' },
      { id: 'groovy', name: 'Groovy', paper: '#FDF0EC', ink: '#2E1430', accent: '#D9467A' },
    ],
  },
  {
    id: 'newspaper', name: 'Newspaper', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'newsprint', name: 'Newsprint', paper: '#F3EFE4', ink: '#1C1A16', accent: '#B8322A' },
      { id: 'blue', name: 'Blue ink', paper: '#EEF1F4', ink: '#141C26', accent: '#2B4F7A' },
      { id: 'sepia', name: 'Sepia', paper: '#F2E8D5', ink: '#2A1E10', accent: '#8A5A2B' },
    ],
  },
  {
    id: 'confetti', name: 'Confetti', format: 'card', families: 'all', businessTypes: ['desserts-ice-cream'],
    palettes: [
      { id: 'party', name: 'Party', paper: '#FFFFFF', ink: '#24102F', accent: '#E89A12' },
      { id: 'candy', name: 'Candy', paper: '#FFF5F8', ink: '#2E1020', accent: '#E0457B' },
      { id: 'fresh', name: 'Fresh', paper: '#F3FBF8', ink: '#0E2A20', accent: '#1F9A72' },
    ],
  },
  {
    id: 'chalkboard', name: 'Chalkboard', format: 'card', families: 'all', businessTypes: ['cafe', 'pub', 'street-food', 'pizzeria'],
    palettes: [
      { id: 'slate', name: 'Slate', paper: '#2B3530', ink: '#F2F0E8', accent: '#8B5E3C' },
      { id: 'black', name: 'Black', paper: '#1C1C1E', ink: '#F5F5F0', accent: '#A47148' },
      { id: 'green', name: 'Green', paper: '#23402F', ink: '#EEF2E8', accent: '#9A6A3C' },
    ],
  },
  /* Third collection: graphic, any business */
  {
    id: 'bauhaus', name: 'Bauhaus', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'primary', name: 'Primary', paper: '#F4EFE6', ink: '#1A1A1A', accent: '#D23C2A' },
      { id: 'blue', name: 'Blue', paper: '#F2F1EC', ink: '#141B33', accent: '#2347A8' },
      { id: 'mustard', name: 'Mustard', paper: '#FAF4E4', ink: '#1E1A10', accent: '#D99A1E' },
    ],
  },
  {
    id: 'memphis', name: 'Memphis', format: 'card', families: 'all', businessTypes: ['juice-bar', 'desserts-ice-cream'],
    palettes: [
      { id: 'pop', name: 'Pop', paper: '#FFF6EC', ink: '#1E1433', accent: '#FF5C8A' },
      { id: 'mint', name: 'Mint', paper: '#EFFAF5', ink: '#0F2A22', accent: '#18A07A' },
      { id: 'lemon', name: 'Lemon', paper: '#FFFBE6', ink: '#22200A', accent: '#3A6FF2' },
    ],
  },
  {
    id: 'receipt', name: 'Receipt', format: 'card', families: 'all', businessTypes: ['fast-food', 'street-food'],
    palettes: [
      { id: 'till', name: 'Till roll', paper: '#FFFFFF', ink: '#1E1E1E', accent: '#E9E4DA' },
      { id: 'mint', name: 'Mint', paper: '#FFFFFF', ink: '#17302A', accent: '#9ED8C3' },
      { id: 'pink', name: 'Pink', paper: '#FFFDF8', ink: '#2A1420', accent: '#F4A7B9' },
    ],
  },
  {
    id: 'boarding-pass', name: 'Boarding pass', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'sky', name: 'Sky', paper: '#FFFFFF', ink: '#14213A', accent: '#2563C9' },
      { id: 'sunset', name: 'Sunset', paper: '#FFF9F3', ink: '#2A1408', accent: '#D2482A' },
      { id: 'aubergine', name: 'Aubergine', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
    ],
  },
  {
    id: 'marquee', name: 'Marquee', format: 'card', families: 'all', businessTypes: ['burger-joint', 'cocktail-bar'],
    palettes: [
      { id: 'classic', name: 'Classic', paper: '#FFF8EA', ink: '#7A1420', accent: '#FFD45C' },
      { id: 'noir', name: 'Noir', paper: '#F7F4EE', ink: '#15121A', accent: '#F2B33D' },
      { id: 'teal', name: 'Teal', paper: '#F2FAF8', ink: '#0E3B3A', accent: '#FFD45C' },
    ],
  },
  {
    id: 'night-sky', name: 'Night sky', format: 'card', families: 'all', businessTypes: ['shisha-lounge', 'cocktail-bar', 'fine-dining'],
    palettes: [
      { id: 'midnight', name: 'Midnight', paper: '#0F1A33', ink: '#EEF2FF', accent: '#F2C76B' },
      { id: 'plum', name: 'Plum', paper: '#1E0F2E', ink: '#F5EEFF', accent: '#F2B33D' },
      { id: 'forest', name: 'Forest', paper: '#0E221A', ink: '#ECF6EE', accent: '#E8D28A' },
    ],
  },
  {
    id: 'stitched', name: 'Stitched patch', format: 'card', families: 'all', businessTypes: ['burger-joint', 'brewery-taproom'],
    palettes: [
      { id: 'denim', name: 'Denim', paper: '#E6EDF6', ink: '#1B2A44', accent: '#B4532A' },
      { id: 'canvas', name: 'Canvas', paper: '#F1EBDD', ink: '#2A2216', accent: '#3F5B3A' },
      { id: 'leather', name: 'Leather', paper: '#F4E8DA', ink: '#3A2212', accent: '#8A4B25' },
    ],
  },
  {
    id: 'gingham', name: 'Gingham', format: 'card', families: 'all', businessTypes: ['italian-trattoria', 'pizzeria', 'bakery-patisserie', 'cheese-deli'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#FFFDF8', ink: '#2A1410', accent: '#C8352B' },
      { id: 'blue', name: 'Blue', paper: '#FDFEFF', ink: '#14213A', accent: '#2E5AAC' },
      { id: 'green', name: 'Green', paper: '#FCFEF9', ink: '#18301E', accent: '#3E7D4A' },
    ],
  },
  {
    id: 'split', name: 'Colour block', format: 'card', families: 'all', businessTypes: [],
    palettes: [
      { id: 'aubergine', name: 'Aubergine', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'terracotta', name: 'Terracotta', paper: '#FFF8F0', ink: '#2B1A10', accent: '#A84B26' },
      { id: 'forest', name: 'Forest', paper: '#F6FAF7', ink: '#10241B', accent: '#1F5A43' },
    ],
  },
  /* Second collection: restaurants and quick service */
  {
    id: 'noren', name: 'Noren', format: 'card', families: ['restaurants'], businessTypes: ['japanese', 'sushi-bar'],
    palettes: [
      { id: 'indigo', name: 'Indigo', paper: '#F7F3EA', ink: '#141B33', accent: '#26407A' },
      { id: 'vermilion', name: 'Vermilion', paper: '#FBF4EA', ink: '#25120C', accent: '#B8322A' },
      { id: 'charcoal', name: 'Charcoal', paper: '#F4F2EE', ink: '#1A1A1A', accent: '#2E2E2E' },
    ],
  },
  {
    id: 'lantern', name: 'Lanterns', format: 'card', families: ['restaurants'], businessTypes: ['chinese', 'thai-pan-asian'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#FFF6EC', ink: '#2A0E08', accent: '#C8302A' },
      { id: 'gold', name: 'Gold', paper: '#FFF8E6', ink: '#2A1A05', accent: '#B87A0E' },
      { id: 'jade', name: 'Jade', paper: '#F1F6F0', ink: '#11261A', accent: '#1F7A55' },
    ],
  },
  {
    id: 'spice', name: 'Chilli', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['north-indian', 'south-indian', 'mexican', 'thai-pan-asian'],
    palettes: [
      { id: 'chilli', name: 'Chilli', paper: '#FFF6EC', ink: '#2A1208', accent: '#C8302A' },
      { id: 'saffron', name: 'Saffron', paper: '#FFF8E8', ink: '#2A1A05', accent: '#B8650E' },
      { id: 'green', name: 'Green chilli', paper: '#F4F8EE', ink: '#1A2410', accent: '#3F8A2C' },
    ],
  },
  {
    id: 'banana-leaf', name: 'Banana leaf', format: 'card', families: ['restaurants'], businessTypes: ['south-indian'],
    palettes: [
      { id: 'leaf', name: 'Leaf', paper: '#FFF8EC', ink: '#2A1A0C', accent: '#2F7A3A' },
      { id: 'deep', name: 'Deep green', paper: '#F6F4EA', ink: '#1A2410', accent: '#1F5A2E' },
      { id: 'tender', name: 'Tender', paper: '#FBF6E6', ink: '#22200C', accent: '#4E8A2E' },
    ],
  },
  {
    id: 'jharokha', name: 'Palace arch', format: 'card', families: ['restaurants'], businessTypes: ['north-indian', 'biryani-house', 'fine-dining'],
    palettes: [
      { id: 'rose', name: 'Rose', paper: '#FFF4F0', ink: '#3A0E16', accent: '#A8324A' },
      { id: 'ivory', name: 'Ivory & gold', paper: '#FAF5EA', ink: '#211A10', accent: '#A9822F' },
      { id: 'peacock', name: 'Peacock', paper: '#EEF5F3', ink: '#0D2B33', accent: '#0F6E6C' },
    ],
  },
  {
    id: 'olive', name: 'Olive wreath', format: 'card', families: ['restaurants'], businessTypes: ['italian-trattoria', 'pizzeria', 'lebanese-mezze', 'turkish-grill'],
    palettes: [
      { id: 'olive', name: 'Olive', paper: '#F7F5EC', ink: '#26281A', accent: '#6B7A3A' },
      { id: 'clay', name: 'Clay', paper: '#FBF1E8', ink: '#2E160C', accent: '#7A8A4A' },
      { id: 'aegean', name: 'Aegean', paper: '#F2F6FA', ink: '#14263A', accent: '#5C7A4A' },
    ],
  },
  {
    id: 'grill', name: 'Flame grill', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['steakhouse', 'turkish-grill', 'arabian-mandi', 'burger-joint'],
    palettes: [
      { id: 'charcoal', name: 'Charcoal', paper: '#1E1A18', ink: '#F5E9DC', accent: '#E8612C' },
      { id: 'ember', name: 'Ember', paper: '#FFF4EA', ink: '#2A140C', accent: '#D9481E' },
      { id: 'smoke', name: 'Smoke', paper: '#EFEAE4', ink: '#1F1B18', accent: '#B5481F' },
    ],
  },
  {
    id: 'gilded', name: 'Gilded frame', format: 'card', families: ['restaurants'], businessTypes: ['fine-dining', 'steakhouse'],
    palettes: [
      { id: 'gold', name: 'Gold', paper: '#FBF7EE', ink: '#211A10', accent: '#B8913A' },
      { id: 'noir', name: 'Noir', paper: '#16131A', ink: '#F4E9D0', accent: '#C9A24A' },
      { id: 'burgundy', name: 'Burgundy', paper: '#3A1220', ink: '#F6E9DA', accent: '#C9A24A' },
    ],
  },
  {
    id: 'diner', name: 'Diner', format: 'card', families: ['quick-casual'], businessTypes: ['burger-joint', 'fast-food', 'street-food'],
    palettes: [
      { id: 'cherry', name: 'Cherry', paper: '#FFF8EF', ink: '#1A1414', accent: '#D7352B' },
      { id: 'teal', name: 'Teal', paper: '#F2FBFA', ink: '#10201F', accent: '#0F7F75' },
      { id: 'pink', name: 'Pink', paper: '#FFF3F6', ink: '#1E1418', accent: '#D6336C' },
    ],
  },
  {
    id: 'citrus', name: 'Citrus', format: 'card', families: ['quick-casual', 'cafes-sweets'], businessTypes: ['juice-bar', 'healthy-vegan'],
    palettes: [
      { id: 'orange', name: 'Orange', paper: '#FFF8EE', ink: '#2A1A0A', accent: '#E8701A' },
      { id: 'lemon', name: 'Lemon', paper: '#FFFCE8', ink: '#262006', accent: '#D9AE0A' },
      { id: 'lime', name: 'Lime', paper: '#F6FBEA', ink: '#1A2608', accent: '#5E9A22' },
    ],
  },
  /* Third collection: cuisines and quick service */
  {
    id: 'food-truck', name: 'Food truck', format: 'card', families: ['quick-casual'], businessTypes: ['street-food', 'fast-food', 'shawarma-wraps', 'burger-joint'],
    palettes: [
      { id: 'tomato', name: 'Tomato', paper: '#FFF6E9', ink: '#2A1408', accent: '#C93C25' },
      { id: 'teal', name: 'Teal', paper: '#EFF8F6', ink: '#0E2A28', accent: '#13786F' },
      { id: 'blue', name: 'Blue', paper: '#F2F6FF', ink: '#121D3A', accent: '#2B59C3' },
    ],
  },
  {
    id: 'sakura', name: 'Sakura', format: 'card', families: ['restaurants'], businessTypes: ['japanese', 'sushi-bar'],
    palettes: [
      { id: 'blossom', name: 'Blossom', paper: '#FFF7F7', ink: '#2B1A1E', accent: '#E88AA6' },
      { id: 'ink', name: 'Ink and red', paper: '#F7F3EA', ink: '#1A1A1A', accent: '#C8352B' },
      { id: 'dusk', name: 'Dusk', paper: '#F3F0FA', ink: '#221A33', accent: '#B48AD8' },
    ],
  },
  {
    id: 'papel', name: 'Papel picado', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['mexican'],
    palettes: [
      { id: 'fiesta', name: 'Fiesta', paper: '#FFF8EE', ink: '#1F2A6B', accent: '#E5367A' },
      { id: 'verde', name: 'Verde', paper: '#F5FBF4', ink: '#6B1A35', accent: '#1F9A5A' },
      { id: 'naranja', name: 'Naranja', paper: '#FFF7EC', ink: '#3B1A5C', accent: '#F06A1D' },
    ],
  },
  {
    id: 'kolam', name: 'Kolam', format: 'card', families: ['restaurants', 'cafes-sweets'], businessTypes: ['south-indian', 'indian-sweets', 'chai-tea-house'],
    palettes: [
      { id: 'oxide', name: 'Red oxide', paper: '#8A3A24', ink: '#FFF4E6', accent: '#FBE3C4' },
      { id: 'turmeric', name: 'Turmeric', paper: '#FFF6DE', ink: '#3A1F05', accent: '#B04E0C' },
      { id: 'leaf', name: 'Leaf', paper: '#F2F8EE', ink: '#14301C', accent: '#2E7D46' },
    ],
  },
  {
    id: 'arabesque', name: 'Arabesque', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['arabian-mandi', 'lebanese-mezze', 'turkish-grill', 'shawarma-wraps', 'biryani-house'],
    palettes: [
      { id: 'majorelle', name: 'Majorelle', paper: '#FBF7EE', ink: '#14234D', accent: '#2346A8' },
      { id: 'saffron', name: 'Saffron', paper: '#FFF8EA', ink: '#3A1F06', accent: '#A8681C' },
      { id: 'emerald', name: 'Emerald', paper: '#F5FAF6', ink: '#0F2E22', accent: '#1E7A55' },
    ],
  },
  {
    id: 'rope', name: 'Nautical rope', format: 'card', families: ['restaurants'], businessTypes: ['seafood'],
    palettes: [
      { id: 'navy', name: 'Navy', paper: '#F6F8FB', ink: '#14213A', accent: '#C9A26A' },
      { id: 'sea', name: 'Sea', paper: '#F1F8F9', ink: '#0D3340', accent: '#2B7F8E' },
      { id: 'red', name: 'Red', paper: '#FBF7F2', ink: '#1E2340', accent: '#B8322A' },
    ],
  },
  {
    id: 'thali', name: 'Thali', format: 'card', families: ['restaurants'], businessTypes: ['north-indian', 'south-indian', 'biryani-house'],
    palettes: [
      { id: 'steel', name: 'Steel', paper: '#F6F1E7', ink: '#2A1A0C', accent: '#C9CDD2' },
      { id: 'brass', name: 'Brass', paper: '#FBF4E4', ink: '#2E1C08', accent: '#D8B25C' },
      { id: 'leaf', name: 'Leaf', paper: '#EAF3E2', ink: '#183018', accent: '#B9C3BD' },
    ],
  },
  {
    id: 'bamboo', name: 'Bamboo', format: 'card', families: ['restaurants'], businessTypes: ['chinese', 'japanese', 'thai-pan-asian', 'sushi-bar'],
    palettes: [
      { id: 'green', name: 'Green', paper: '#F4F8EE', ink: '#15301A', accent: '#5E9A3A' },
      { id: 'jade', name: 'Jade', paper: '#EFF7F4', ink: '#0F2A22', accent: '#2E8A6A' },
      { id: 'gold', name: 'Gold', paper: '#FFF9EC', ink: '#2B1D08', accent: '#B88A2E' },
    ],
  },
  {
    id: 'butcher', name: 'Butcher', format: 'card', families: ['restaurants', 'quick-casual'], businessTypes: ['steakhouse', 'burger-joint', 'arabian-mandi'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#FAF5EC', ink: '#1E1A16', accent: '#A8262B' },
      { id: 'black', name: 'Black', paper: '#F4F1EA', ink: '#151515', accent: '#2E2E2E' },
      { id: 'forest', name: 'Forest', paper: '#F6F4EC', ink: '#1A2418', accent: '#2F5A3A' },
    ],
  },
  /* Second collection: cafés, sweets, bars and shops */
  {
    id: 'drips', name: 'Drips', format: 'card', families: ['cafes-sweets'], businessTypes: ['desserts-ice-cream'],
    palettes: [
      { id: 'strawberry', name: 'Strawberry', paper: '#FFF5F6', ink: '#3A1218', accent: '#E6698A' },
      { id: 'chocolate', name: 'Chocolate', paper: '#FBF4EE', ink: '#2A170D', accent: '#6B3A22' },
      { id: 'mint', name: 'Mint', paper: '#F1FBF7', ink: '#0E2A20', accent: '#5CC8A4' },
    ],
  },
  {
    id: 'wheat', name: 'Wheat', format: 'card', families: ['cafes-sweets'], businessTypes: ['bakery-patisserie'],
    palettes: [
      { id: 'golden', name: 'Golden', paper: '#FBF6EA', ink: '#2A1E0C', accent: '#C9952E' },
      { id: 'rye', name: 'Rye', paper: '#F6F1E8', ink: '#2A1A10', accent: '#8A5A2B' },
      { id: 'sage', name: 'Sage', paper: '#F3F5EE', ink: '#1C2418', accent: '#8A9A5A' },
    ],
  },
  {
    id: 'botanical', name: 'Botanical', format: 'card', families: ['cafes-sweets', 'quick-casual'], businessTypes: ['cafe', 'healthy-vegan'],
    palettes: [
      { id: 'monstera', name: 'Monstera', paper: '#F3F7F1', ink: '#14261A', accent: '#2F6B45' },
      { id: 'blush', name: 'Blush', paper: '#FBF1EE', ink: '#2A1A16', accent: '#4F7A5A' },
      { id: 'night', name: 'Night', paper: '#18241D', ink: '#EEF3EC', accent: '#3F8A5A' },
    ],
  },
  {
    id: 'kulhad', name: 'Chai cups', format: 'card', families: ['cafes-sweets'], businessTypes: ['chai-tea-house', 'indian-sweets'],
    palettes: [
      { id: 'clay', name: 'Clay', paper: '#FFF6EA', ink: '#2E1408', accent: '#B5562A' },
      { id: 'chai', name: 'Chai', paper: '#F7EFE4', ink: '#2A1A10', accent: '#8A4A26' },
      { id: 'festive', name: 'Festive', paper: '#FFF4F0', ink: '#3A0A10', accent: '#C8302A' },
    ],
  },
  {
    id: 'choco', name: 'Chocolate bar', format: 'card', families: ['cafes-sweets', 'shops'], businessTypes: ['chocolatier', 'desserts-ice-cream'],
    palettes: [
      { id: 'milk', name: 'Milk', paper: '#FBF4EC', ink: '#2A170D', accent: '#7A4A2A' },
      { id: 'dark', name: 'Dark', paper: '#F4EEEA', ink: '#1E120C', accent: '#4A2A1A' },
      { id: 'ruby', name: 'Ruby', paper: '#FFF2F4', ink: '#3A1220', accent: '#B23A5A' },
    ],
  },
  {
    id: 'neon', name: 'Neon', format: 'card', families: ['bars-lounges'], businessTypes: ['cocktail-bar', 'shisha-lounge'],
    palettes: [
      { id: 'pink', name: 'Pink', paper: '#120F1F', ink: '#F5F0FF', accent: '#FF4FA3' },
      { id: 'cyan', name: 'Cyan', paper: '#0B1620', ink: '#EAF8FF', accent: '#33D6FF' },
      { id: 'lime', name: 'Lime', paper: '#101410', ink: '#F1FFE9', accent: '#9BFF4F' },
    ],
  },
  {
    id: 'foam', name: 'Fresh pour', format: 'card', families: ['bars-lounges'], businessTypes: ['brewery-taproom', 'pub'],
    palettes: [
      { id: 'lager', name: 'Lager', paper: '#F2B43A', ink: '#2A1A05', accent: '#FFF8E7' },
      { id: 'amber', name: 'Amber', paper: '#D9822B', ink: '#2A1305', accent: '#FFF4E0' },
      { id: 'stout', name: 'Stout', paper: '#2A1A12', ink: '#F6EAD7', accent: '#E9D9B8' },
    ],
  },
  {
    id: 'wine-label', name: 'Wine label', format: 'card', families: ['bars-lounges', 'shops'], businessTypes: ['wine-bar', 'wine-shop'],
    palettes: [
      { id: 'bottle', name: 'Bottle green', paper: '#1F3A2B', ink: '#1E1A14', accent: '#F3EBD8' },
      { id: 'bordeaux', name: 'Bordeaux', paper: '#4A1424', ink: '#2A0F18', accent: '#F6EEE2' },
      { id: 'blanc', name: 'Blanc', paper: '#E6E0C6', ink: '#1E1A14', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'crate', name: 'Market crate', format: 'card', families: ['shops'], businessTypes: ['cheese-deli', 'gourmet-hampers'],
    palettes: [
      { id: 'pine', name: 'Pine', paper: '#FBF7EE', ink: '#2A1E10', accent: '#C9A26A' },
      { id: 'walnut', name: 'Walnut', paper: '#F6F1EA', ink: '#24170C', accent: '#7A5230' },
      { id: 'whitewash', name: 'Whitewash', paper: '#F4F4F0', ink: '#1E1E1A', accent: '#D8D2C4' },
    ],
  },
  /* Third collection: treats, bars and shops */
  {
    id: 'latte', name: 'Latte art', format: 'card', families: ['cafes-sweets'], businessTypes: ['cafe'],
    palettes: [
      { id: 'latte', name: 'Latte', paper: '#FBF6EF', ink: '#2B1C12', accent: '#8A5A3B' },
      { id: 'mocha', name: 'Mocha', paper: '#F3ECE4', ink: '#24160E', accent: '#5C3A24' },
      { id: 'matcha', name: 'Matcha', paper: '#F5F8EF', ink: '#1E2A16', accent: '#6E8F3A' },
    ],
  },
  {
    id: 'sprinkles', name: 'Sprinkles', format: 'card', families: ['cafes-sweets'], businessTypes: ['desserts-ice-cream', 'bakery-patisserie'],
    palettes: [
      { id: 'strawberry', name: 'Strawberry', paper: '#FFF5F7', ink: '#3A1426', accent: '#F06292' },
      { id: 'chocolate', name: 'Chocolate', paper: '#FBF4EE', ink: '#2A160C', accent: '#6B3A22' },
      { id: 'blueberry', name: 'Blueberry', paper: '#F4F4FF', ink: '#1E1B4B', accent: '#7C6FE8' },
    ],
  },
  {
    id: 'macaron', name: 'Macarons', format: 'card', families: ['cafes-sweets', 'shops'], businessTypes: ['bakery-patisserie', 'chocolatier', 'desserts-ice-cream'],
    palettes: [
      { id: 'raspberry', name: 'Raspberry', paper: '#FFF8F6', ink: '#3A1622', accent: '#C2185B' },
      { id: 'pistachio', name: 'Pistachio', paper: '#F7FBF3', ink: '#1E2E18', accent: '#557F33' },
      { id: 'lavender', name: 'Lavender', paper: '#FAF7FF', ink: '#2A1E44', accent: '#7A5AB8' },
    ],
  },
  {
    id: 'scoop', name: 'Scoops', format: 'card', families: ['cafes-sweets'], businessTypes: ['desserts-ice-cream'],
    palettes: [
      { id: 'bubblegum', name: 'Bubblegum', paper: '#FFF4F8', ink: '#3A1430', accent: '#E84A8A' },
      { id: 'mint', name: 'Mint', paper: '#F1FBF6', ink: '#0F2E22', accent: '#2BAE7E' },
      { id: 'sorbet', name: 'Sorbet', paper: '#FFF7EE', ink: '#3A1A0A', accent: '#F07A2E' },
    ],
  },
  {
    id: 'mithai', name: 'Mithai box', format: 'card', families: ['cafes-sweets', 'shops'], businessTypes: ['indian-sweets', 'gourmet-hampers', 'chocolatier'],
    palettes: [
      { id: 'rani', name: 'Rani pink', paper: '#FFF6F2', ink: '#3A0E1E', accent: '#C2185B' },
      { id: 'kesar', name: 'Kesar', paper: '#FFF8EA', ink: '#3A1F05', accent: '#B8650F' },
      { id: 'pista', name: 'Pista', paper: '#F6FAF0', ink: '#1C2E14', accent: '#557F2E' },
    ],
  },
  {
    id: 'martini', name: 'Martini', format: 'card', families: ['bars-lounges'], businessTypes: ['cocktail-bar', 'wine-bar', 'fine-dining'],
    palettes: [
      { id: 'noir', name: 'Noir', paper: '#15121A', ink: '#F4EFE6', accent: '#D6B25E' },
      { id: 'emerald', name: 'Emerald', paper: '#0F2A22', ink: '#EEF6F0', accent: '#E0C27A' },
      { id: 'burgundy', name: 'Burgundy', paper: '#2A0F18', ink: '#F6EEE2', accent: '#E6B87A' },
    ],
  },
  {
    id: 'coaster', name: 'Beer mat', format: 'card', families: ['bars-lounges'], businessTypes: ['pub', 'brewery-taproom'],
    palettes: [
      { id: 'pub', name: 'Pub red', paper: '#FBF5E9', ink: '#2A160A', accent: '#B8322A' },
      { id: 'lager', name: 'Lager', paper: '#FFF9EA', ink: '#2A1D05', accent: '#D9A21E' },
      { id: 'stout', name: 'Stout', paper: '#F4EFE8', ink: '#1A120C', accent: '#2A1A10' },
    ],
  },
  {
    id: 'cheese', name: 'Cheese board', format: 'card', families: ['shops'], businessTypes: ['cheese-deli', 'wine-shop', 'wine-bar'],
    palettes: [
      { id: 'gouda', name: 'Gouda', paper: '#FFFBF0', ink: '#2A1E0A', accent: '#F2B33D' },
      { id: 'brie', name: 'Brie', paper: '#FBF8F2', ink: '#2A2418', accent: '#E8D9A8' },
      { id: 'cheddar', name: 'Cheddar', paper: '#FFF7EC', ink: '#2E1A08', accent: '#E8862A' },
    ],
  },
  {
    id: 'hamper', name: 'Hamper', format: 'card', families: ['shops'], businessTypes: ['gourmet-hampers', 'wine-shop', 'chocolatier'],
    palettes: [
      { id: 'ruby', name: 'Ruby', paper: '#FBF6EC', ink: '#2A1C10', accent: '#B8322A' },
      { id: 'green', name: 'Green', paper: '#F7F9F2', ink: '#1B2A16', accent: '#2F6B45' },
      { id: 'gold', name: 'Gold', paper: '#FFFDF6', ink: '#2A1E0C', accent: '#8F6A1E' },
    ],
  },

  /* Stickers */
  {
    id: 'badge', name: 'Round badge', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'aubergine', name: 'Aubergine', paper: '#5B2E85', ink: '#1C1526', accent: '#F2B33D' },
      { id: 'black', name: 'Black', paper: '#111111', ink: '#111111', accent: '#FFFFFF' },
      { id: 'red', name: 'Red', paper: '#C8352B', ink: '#1A0C0A', accent: '#FFF4E6' },
    ],
  },
  {
    id: 'sticker-tab', name: 'Scan me', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'ink', name: 'Ink', paper: '#1C1526', ink: '#1C1526', accent: '#FFFFFF' },
      { id: 'saffron', name: 'Saffron', paper: '#F2B33D', ink: '#2A1B05', accent: '#2A1B05' },
      { id: 'teal', name: 'Teal', paper: '#0F766E', ink: '#0C2524', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'seal', name: 'Bottle cap', format: 'sticker', families: ['bars-lounges', 'quick-casual'], businessTypes: ['brewery-taproom', 'pub', 'juice-bar', 'fast-food'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#B8322A', ink: '#1E0B08', accent: '#FFF4E6' },
      { id: 'gold', name: 'Gold', paper: '#D49A2A', ink: '#2A1A05', accent: '#2A1A05' },
      { id: 'green', name: 'Green', paper: '#2F6B45', ink: '#0F2216', accent: '#F3EAD6' },
    ],
  },
  {
    id: 'bubble', name: 'Speech bubble', format: 'sticker', families: 'all', businessTypes: ['cafe', 'street-food'],
    palettes: [
      { id: 'pink', name: 'Pink', paper: '#E0457B', ink: '#2A0C17', accent: '#FFFFFF' },
      { id: 'blue', name: 'Blue', paper: '#2563C9', ink: '#0B1A33', accent: '#FFFFFF' },
      { id: 'lemon', name: 'Lemon', paper: '#F5D547', ink: '#262006', accent: '#262006' },
    ],
  },
  {
    id: 'stamp', name: 'Stamp', format: 'sticker', families: ['shops', 'cafes-sweets', 'restaurants'], businessTypes: ['cheese-deli', 'bakery-patisserie', 'fine-dining'],
    palettes: [
      { id: 'cream', name: 'Cream', paper: '#F6EEDC', ink: '#2A1D10', accent: '#9A3B26' },
      { id: 'navy', name: 'Navy', paper: '#EEF1F6', ink: '#14213A', accent: '#14213A' },
      { id: 'sage', name: 'Sage', paper: '#EDF2E8', ink: '#1C2E20', accent: '#4F7A5A' },
    ],
  },
  {
    id: 'burst', name: 'Starburst', format: 'sticker', families: 'all', businessTypes: ['desserts-ice-cream', 'burger-joint'],
    palettes: [
      { id: 'saffron', name: 'Saffron', paper: '#F2B33D', ink: '#24102F', accent: '#5B2E85' },
      { id: 'coral', name: 'Coral', paper: '#F26B4F', ink: '#2A0F08', accent: '#FFFFFF' },
      { id: 'mint', name: 'Mint', paper: '#5CC8A4', ink: '#0B2A20', accent: '#0B2A20' },
    ],
  },
  {
    id: 'heart', name: 'Heart', format: 'sticker', families: ['cafes-sweets'], businessTypes: ['desserts-ice-cream', 'bakery-patisserie', 'chocolatier'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#D7352B', ink: '#1A0C0A', accent: '#FFF4E6' },
      { id: 'pink', name: 'Pink', paper: '#F28AAE', ink: '#2E0C18', accent: '#2E0C18' },
      { id: 'plum', name: 'Plum', paper: '#5B2E85', ink: '#1C0D2A', accent: '#F2B33D' },
    ],
  },
  {
    id: 'hexagon', name: 'Hexagon', format: 'sticker', families: 'all', businessTypes: ['healthy-vegan', 'juice-bar'],
    palettes: [
      { id: 'honey', name: 'Honey', paper: '#F2B33D', ink: '#2A1B05', accent: '#2A1B05' },
      { id: 'leaf', name: 'Leaf', paper: '#2F7A3A', ink: '#0E2416', accent: '#F3F8EE' },
      { id: 'ink', name: 'Ink', paper: '#1C1526', ink: '#1C1526', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'arch-sticker', name: 'Arch', format: 'sticker', families: 'all', businessTypes: ['cafe', 'bakery-patisserie'],
    palettes: [
      { id: 'terracotta', name: 'Terracotta', paper: '#C8643B', ink: '#2B160C', accent: '#FFF4EA' },
      { id: 'sage', name: 'Sage', paper: '#9DB58C', ink: '#1C2418', accent: '#1C2418' },
      { id: 'navy', name: 'Navy', paper: '#1F3F7A', ink: '#0B1A33', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'flower', name: 'Flower', format: 'sticker', families: ['cafes-sweets', 'shops'], businessTypes: ['desserts-ice-cream', 'gourmet-hampers', 'indian-sweets'],
    palettes: [
      { id: 'sunny', name: 'Sunny', paper: '#F5D547', ink: '#262006', accent: '#262006' },
      { id: 'blush', name: 'Blush', paper: '#F2B8B0', ink: '#3A1A16', accent: '#3A1A16' },
      { id: 'lilac', name: 'Lilac', paper: '#C2B0E8', ink: '#1E1438', accent: '#1E1438' },
    ],
  },
  {
    id: 'shield', name: 'Shield', format: 'sticker', families: ['bars-lounges', 'restaurants'], businessTypes: ['pub', 'brewery-taproom', 'steakhouse'],
    palettes: [
      { id: 'forest', name: 'Forest', paper: '#2E4A3A', ink: '#0E1A13', accent: '#F3EAD6' },
      { id: 'crimson', name: 'Crimson', paper: '#8E1F2A', ink: '#1E0A0C', accent: '#F6E7C8' },
      { id: 'black', name: 'Black & gold', paper: '#161616', ink: '#161616', accent: '#E0A23A' },
    ],
  },
  {
    id: 'label', name: 'Ribbon label', format: 'sticker', families: 'all', businessTypes: ['fine-dining', 'wine-bar'],
    palettes: [
      { id: 'cream', name: 'Cream', paper: '#F6EEDC', ink: '#2A1D10', accent: '#9A3B26' },
      { id: 'mint', name: 'Mint', paper: '#E8F6EF', ink: '#0E2A20', accent: '#0F7F5E' },
      { id: 'lavender', name: 'Lavender', paper: '#F1ECFA', ink: '#24163A', accent: '#5B2E85' },
    ],
  },
  {
    id: 'price-tag', name: 'Price tag', format: 'sticker', families: ['shops'], businessTypes: ['wine-shop', 'cheese-deli', 'gourmet-hampers', 'chocolatier'],
    palettes: [
      { id: 'kraft', name: 'Kraft', paper: '#D9B98C', ink: '#2A1A0C', accent: '#2A1A0C' },
      { id: 'black', name: 'Black', paper: '#161616', ink: '#161616', accent: '#F2B33D' },
      { id: 'white', name: 'White', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
    ],
  },
  {
    id: 'diamond', name: 'Diamond', format: 'sticker', families: ['bars-lounges'], businessTypes: ['cocktail-bar', 'wine-bar', 'shisha-lounge'],
    palettes: [
      { id: 'gold', name: 'Gold', paper: '#C9A24A', ink: '#1E160A', accent: '#1E160A' },
      { id: 'noir', name: 'Noir', paper: '#15121A', ink: '#15121A', accent: '#C9A24A' },
      { id: 'teal', name: 'Teal', paper: '#0F766E', ink: '#0C2524', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'ring', name: 'Dotted ring', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'white', name: 'White', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'cream', name: 'Cream', paper: '#FBF6EC', ink: '#2B2118', accent: '#B4532A' },
      { id: 'sage', name: 'Sage', paper: '#EEF2EA', ink: '#1F3326', accent: '#4F7A5A' },
    ],
  },
  {
    id: 'ticket-sticker', name: 'Ticket', format: 'sticker', families: ['quick-casual'], businessTypes: ['street-food', 'fast-food', 'burger-joint'],
    palettes: [
      { id: 'mustard', name: 'Mustard', paper: '#F2B33D', ink: '#1C1526', accent: '#1C1526' },
      { id: 'red', name: 'Red', paper: '#C8352B', ink: '#1A0C0A', accent: '#FFF4E6' },
      { id: 'teal', name: 'Teal', paper: '#1E6F6A', ink: '#0C2524', accent: '#F4EBDD' },
    ],
  },  /* Third sticker collection */
  {
    id: 'cloud', name: 'Cloud', format: 'sticker', families: 'all', businessTypes: ['desserts-ice-cream', 'cafe'],
    palettes: [
      { id: 'sky', name: 'Sky', paper: '#BFE3F7', ink: '#0B2233', accent: '#0B2233' },
      { id: 'white', name: 'White', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'peach', name: 'Peach', paper: '#FFD3B8', ink: '#3A1A0C', accent: '#3A1A0C' },
    ],
  },
  {
    id: 'octagon', name: 'Octagon', format: 'sticker', families: 'all', businessTypes: ['fast-food', 'street-food'],
    palettes: [
      { id: 'red', name: 'Red', paper: '#C8352B', ink: '#1A0C0A', accent: '#FFFFFF' },
      { id: 'black', name: 'Black', paper: '#161616', ink: '#161616', accent: '#F2B33D' },
      { id: 'green', name: 'Green', paper: '#1F7A4A', ink: '#0C2216', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'cup', name: 'Coffee cup', format: 'sticker', families: ['cafes-sweets'], businessTypes: ['cafe', 'chai-tea-house'],
    palettes: [
      { id: 'espresso', name: 'Espresso', paper: '#4A2C1C', ink: '#1E120A', accent: '#F6EAD8' },
      { id: 'latte', name: 'Latte', paper: '#E8D3B8', ink: '#2A1A0C', accent: '#2A1A0C' },
      { id: 'mint', name: 'Mint', paper: '#BFE6D3', ink: '#0E2A20', accent: '#0E2A20' },
    ],
  },
  {
    id: 'blob', name: 'Blob', format: 'sticker', families: 'all', businessTypes: ['healthy-vegan', 'juice-bar'],
    palettes: [
      { id: 'lime', name: 'Lime', paper: '#C8E86A', ink: '#1C2606', accent: '#1C2606' },
      { id: 'lilac', name: 'Lilac', paper: '#CDB8F2', ink: '#1E1438', accent: '#1E1438' },
      { id: 'coral', name: 'Coral', paper: '#F27A5E', ink: '#2A0F08', accent: '#2A0F08' },
    ],
  },
  {
    id: 'rosette', name: 'Award rosette', format: 'sticker', families: 'all', businessTypes: ['fine-dining', 'bakery-patisserie', 'indian-sweets'],
    palettes: [
      { id: 'gold', name: 'Gold', paper: '#E0A93A', ink: '#2A1A05', accent: '#2A1A05' },
      { id: 'royal', name: 'Royal blue', paper: '#2346A8', ink: '#0B1A33', accent: '#FFFFFF' },
      { id: 'ruby', name: 'Ruby', paper: '#A8262B', ink: '#1E0A0C', accent: '#FFF4E6' },
    ],
  },
  {
    id: 'sun', name: 'Sunshine', format: 'sticker', families: 'all', businessTypes: ['juice-bar', 'healthy-vegan', 'mexican'],
    palettes: [
      { id: 'sunny', name: 'Sunny', paper: '#F7C948', ink: '#2A1B05', accent: '#2A1B05' },
      { id: 'orange', name: 'Orange', paper: '#F28C28', ink: '#2A1205', accent: '#2A1205' },
      { id: 'terracotta', name: 'Terracotta', paper: '#B8562F', ink: '#2B160C', accent: '#FFF4EA' },
    ],
  },
  {
    id: 'pint', name: 'Pint glass', format: 'sticker', families: ['bars-lounges'], businessTypes: ['pub', 'brewery-taproom'],
    palettes: [
      { id: 'lager', name: 'Lager', paper: '#E8A92A', ink: '#2A1A05', accent: '#2A1A05' },
      { id: 'stout', name: 'Stout', paper: '#2A1A10', ink: '#1A100A', accent: '#F3E6CC' },
      { id: 'ale', name: 'Red ale', paper: '#A84E1A', ink: '#1E0C04', accent: '#FFF3E0' },
    ],
  },
  {
    id: 'phone', name: 'Phone screen', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'black', name: 'Black', paper: '#1C1526', ink: '#1C1526', accent: '#FFFFFF' },
      { id: 'aubergine', name: 'Aubergine', paper: '#5B2E85', ink: '#1C1526', accent: '#F7F2FF' },
      { id: 'coral', name: 'Coral', paper: '#C8352B', ink: '#1A0C0A', accent: '#FFF4E6' },
    ],
  },
  {
    id: 'luggage-tag', name: 'Luggage tag', format: 'sticker', families: ['shops'], businessTypes: ['gourmet-hampers', 'wine-shop', 'cheese-deli'],
    palettes: [
      { id: 'kraft', name: 'Kraft', paper: '#D9B98C', ink: '#2A1A0C', accent: '#2A1A0C' },
      { id: 'navy', name: 'Navy', paper: '#1F3F7A', ink: '#0B1A33', accent: '#FFFFFF' },
      { id: 'mint', name: 'Mint', paper: '#CFEBDD', ink: '#0E2A20', accent: '#0E2A20' },
    ],
  },
  {
    id: 'squircle', name: 'App icon', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'aubergine', name: 'Aubergine', paper: '#5B2E85', ink: '#1C1526', accent: '#FFFFFF' },
      { id: 'saffron', name: 'Saffron', paper: '#F2B33D', ink: '#2A1B05', accent: '#2A1B05' },
      { id: 'ocean', name: 'Ocean', paper: '#1E5FC0', ink: '#0B1A33', accent: '#FFFFFF' },
    ],
  },
  {
    id: 'scroll', name: 'Scroll', format: 'sticker', families: ['restaurants', 'bars-lounges'], businessTypes: ['fine-dining', 'wine-bar', 'italian-trattoria'],
    palettes: [
      { id: 'parchment', name: 'Parchment', paper: '#F1E3C2', ink: '#2A1D10', accent: '#6B2E1A' },
      { id: 'ivory', name: 'Ivory', paper: '#FBF6EA', ink: '#1E1A14', accent: '#1E1A14' },
      { id: 'sage', name: 'Sage', paper: '#DCE6D2', ink: '#1C2E20', accent: '#1C2E20' },
    ],
  },
  {
    id: 'split-circle', name: 'Half and half', format: 'sticker', families: 'all', businessTypes: [],
    palettes: [
      { id: 'aubergine', name: 'Aubergine', paper: '#FFFFFF', ink: '#1C1526', accent: '#5B2E85' },
      { id: 'tomato', name: 'Tomato', paper: '#FFF6EC', ink: '#2A1408', accent: '#C23A22' },
      { id: 'forest', name: 'Forest', paper: '#F4F8F2', ink: '#12261A', accent: '#1F5A43' },
    ],
  },

];

/** Suggested words, matched to where the scan lands (never promise a feature that is not there). */
export const QR_TEXT_PRESETS: Record<QrDestination, QrTextPreset[]> = {
  menu: [
    { headline: 'Scan for our menu', subline: 'Point your phone camera here' },
    { headline: 'Menu inside', subline: 'No app needed, just scan' },
    { headline: "See today's menu", subline: 'Scan with your camera' },
    { headline: 'Hungry?', subline: 'Scan to see the menu' },
    { headline: 'Drinks list', subline: 'Scan to see what we pour' },
  ],
  website: [
    { headline: 'Visit us online', subline: 'Scan to open our website' },
    { headline: 'Say hello', subline: 'Hours, directions and more' },
    { headline: 'Find out more', subline: 'Scan with your phone camera' },
  ],
};

export const QR_TEXT_LIMITS = { headline: 40, subline: 60, tablePrefix: 20 } as const;

/** Physical print sizes per layout; downloads are 300 dpi at this size. */
export const QR_PRINT_SIZES: Record<QrLayout, QrPrintSize[]> = {
  none: [
    { id: 'qr-30', label: '3 cm', hint: 'Menu corner', mm: [30, 30] },
    { id: 'qr-50', label: '5 cm', hint: 'Table card', mm: [50, 50] },
    { id: 'qr-100', label: '10 cm', hint: 'Poster', mm: [100, 100] },
  ],
  card: [
    { id: 'a6', label: 'A6', hint: 'Table tent · 105 × 148 mm', mm: [105, 148] },
    { id: 'a5', label: 'A5', hint: 'Counter · 148 × 210 mm', mm: [148, 210] },
    { id: 'a4', label: 'A4', hint: 'Poster · 210 × 297 mm', mm: [210, 297] },
  ],
  sticker: [
    { id: 's50', label: '5 cm', hint: 'Table corner', mm: [50, 50] },
    { id: 's75', label: '7.5 cm', hint: 'Counter', mm: [75, 75] },
    { id: 's100', label: '10 cm', hint: 'Door or window', mm: [100, 100] },
  ],
};

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const QR_EXPORT_DPI = 300;
export const MM_PER_INCH = 25.4;

/** A4 print sheet. Cards tile edge to edge (cut along the guides); stickers get a gap. */
export const QR_PRINT_SHEET = {
  pageMm: [210, 297] as [number, number],
  card: { gapMm: 0, marginMm: 0 },
  loose: { gapMm: 4, marginMm: 3 },
  maxCopies: 200,
} as const;

export const DEFAULT_QR_FRAME: QrFrameSettings = {
  layout: 'card',
  cardId: 'classic',
  stickerId: 'badge',
  paper: '#FFFFFF',
  ink: '#1C1526',
  accent: '#5B2E85',
  headline: 'Scan for our menu',
  subline: 'Point your phone camera here',
  showName: true,
  tableNumbers: false,
  tablePrefix: 'Table',
  printSize: 'a6',
};

export const DEFAULT_QR_DESIGN: QrDesign = {
  destination: 'menu',
  margin: DEFAULT_QR_CONFIG.margin,
  dataPattern: 'square',
  dataColor: DEFAULT_QR_CONFIG.dataColor,
  finderPattern: 'square',
  finderColor: DEFAULT_QR_CONFIG.finderColor,
  backgroundFill: DEFAULT_QR_CONFIG.backgroundFill,
  logo: null,
  frame: DEFAULT_QR_FRAME,
};

/** Shown in the preview when table numbers are on. */
export const QR_PREVIEW_TABLE_NUMBER = 1;

/**
 * Placeholder swapped per copy when printing a numbered sheet. Three private-use
 * characters: as long as a 3-digit number, so text is sized the same.
 */
export const QR_PRINT_TABLE_TOKEN = '';
export const QR_PRINT_UID_TOKEN = 'qrprintuid';
