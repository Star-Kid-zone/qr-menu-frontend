import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { listSourceFiles, relPath, stripNoise, lineAt, SRC } from './helpers/sourceScan.js';
import * as Constants from '../constants/index.js';

/**
 * Constants-location rule: fixed values live in `src/constants/<domain>.constants.ts`
 * and are imported from there (or from `src/constants/index.ts`).
 *
 *  1. No module-level data constant (string / number / array / object / regex)
 *     outside `src/constants/`. Env-derived values belong in `src/config/`.
 *  2. No literal HTTP status codes: use `HTTP_STATUS.*`.
 *  3. All domain constants in `src/constants/*.constants.ts` are re-exported in `src/constants/index.ts`.
 *  4. Constants files stay pure: no direct `process.env`, no services, no hooks.
 */

// Top-level folders that legitimately hold definitions or dev benchmarks
const SKIP_DIRS = ['constants', 'config', 'types', 'test'];

/** Next.js App Router required route segment exports */
const NEXTJS_ROUTE_EXPORTS = new Set([
  'metadata',
  'viewport',
  'config',
  'dynamic',
  'revalidate',
  'runtime',
  'fetchCache',
  'preferredRegion',
  'maxDuration',
  'generateStaticParams',
]);

/**
 * Top-level `const`s that start with a literal but are code, UI markup, or schema fragments.
 * Keep this list minimal and justified.
 */
const ALLOWED_CONSTS: Record<string, string> = {
  // Navigation definitions (config/navigation re-exports)
  'config/navigation.ts:ADMIN_NAV': 'navigation hierarchy with React icons',
  'config/navigation.ts:SUPERADMIN_NAV': 'superadmin navigation hierarchy with React icons',

  // Dev labs (visual preview benches with sample mockup fixtures)
  'app/layout-lab/[key]/LayoutLabClient.tsx:DARK_SETTINGS': 'lab mockup preview fixtures',
  'app/menu-lab/[key]/sample.ts:ITEMS': 'lab mockup preview dishes',
  'app/menu-lab/[key]/sample.ts:LIGHT': 'lab mockup preview theme',
  'app/menu-lab/[key]/sample.ts:DARK': 'lab mockup preview theme',
  'app/menu-lab/[key]/sample.ts:PUB_ITEMS': 'lab mockup preview dishes',
  'app/menu-lab/[key]/sample.ts:SHOP_ITEMS': 'lab mockup preview dishes',
  'app/skin-lab/SkinLabClient.tsx:STYLES': 'lab mockup preview styles',
  'app/skin-lab/SkinLabClient.tsx:SAMPLE_ICONS': 'lab mockup preview icons',

  // Marketing page public copy (features/marketing)
  'features/marketing/content.ts:LOOKS_WITH_PHOTOS': 'marketing showcase photo pairings',
  'features/marketing/content.ts:GUEST_SCREENS': 'marketing feature showcase copy',
  'features/marketing/content.ts:DASHBOARD_AREAS': 'marketing dashboard breakdown copy',
  'features/marketing/content.ts:STEPS': 'marketing onboard steps copy',
  'features/marketing/content.ts:FAQS': 'marketing landing FAQ copy',
  'features/marketing/components/GuestJourney.tsx:SCREENS': 'marketing presentation screen slider items',
  'features/marketing/components/PhoneScreens.tsx:RESTAURANT': 'marketing phone mockup restaurant info',
  'features/marketing/components/PhoneScreens.tsx:DISHES': 'marketing phone mockup dishes',
  'features/marketing/components/SiteHeader.tsx:NAV': 'marketing header navigation links',
  'features/marketing/components/QrMark.tsx:SEED': 'marketing SVG visual seed constant',
  'features/marketing/components/QrMark.tsx:SIZE': 'marketing SVG visual size constant',

  // Site system icon glyph catalogs (SVG path strings)
  'components/site-system/icons/glyphs.ts:PIN': 'SVG icon path data',
  'components/site-system/icons/glyphs.ts:UI': 'SVG icon path map',
  'components/site-system/icons/glyphs.ts:AMENITIES': 'SVG icon path map',
  'components/site-system/icons/glyphs.ts:DIETARY': 'SVG icon path map',
  'components/site-system/icons/glyphs.ts:GLYPHS': 'SVG icon path map',
  'components/site-system/icons/glyphs.ts:GLYPH_ALIASES': 'SVG icon alias map',
  'components/site-system/icons/glyphs.ts:GLYPH_GROUPS': 'SVG icon category groups',
  'components/site-system/icons/glyphsCatalog.ts:BOWL': 'SVG icon path data',
  'components/site-system/icons/glyphsCatalog.ts:FOOD': 'SVG icon path map',
  'components/site-system/icons/glyphsCatalog.ts:DRINKS': 'SVG icon path map',
  'components/site-system/icons/glyphsCatalog.ts:SHOP': 'SVG icon path map',
  'components/site-system/icons/glyphsCatalog.ts:CATALOG_ALIASES': 'SVG icon alias map',
  'components/site-system/icons/glyphsFestival.ts:EGG': 'SVG icon path data',
  'components/site-system/icons/glyphsFestival.ts:FESTIVAL': 'SVG icon path map',
  'components/site-system/fixtures.ts:FULL_SITE': 'site system visual mockup fixtures',
  'components/site-system/fixtures.ts:BUSINESS_FIXTURES': 'site system business visual mockup fixtures',
  'proxy.ts:UNKNOWN_DOMAIN_PAGE': 'standalone offline HTML page for unknown custom domains',

  // Workspace visual preview helpers and coordinates
  'features/workspace/components/ColourPartPreview.tsx:FIELDS': 'preview part field mapping list',
  'features/workspace/components/ColourPartPreview.tsx:PART_AREAS': 'preview area coordinates and labels',
  'features/workspace/components/ColourPartPreview.tsx:RANK': 'preview visual ranking map',
  'features/workspace/components/LandingDesignStudio.tsx:COLOUR_PREVIEW_PARTS': 'preview parts lookup list',
  'features/workspace/components/LandingDesignStudio.tsx:TEXT_OPTIONS': 're-grouping of imported constants for text controls',
  'features/workspace/components/MenuDesignStudio.tsx:GLYPHS': 'SVG preview coordinate boxes',
  'features/workspace/components/CategoryIconPicker.tsx:GROUPS': 'icon picker group definitions with React icons',
  'features/workspace/studio/SitePickers.tsx:LAYOUT_THUMBS': 'SVG layout thumbnail coordinates',
};

const LITERAL_START = /^(['"`\d\[{/-]|new\s+(Set|Map|RegExp)\b)/;
const TOP_LEVEL_CONST = /^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]+)?=\s*([^\n]*)/gm;

/** The balanced `{ ... }` / `[ ... ]` block starting at `start` (inclusive), or '' if unbalanced. */
function balancedBlock(text: string, start: number): string {
  const open = text[start];
  const close = open === '{' ? '}' : open === '[' ? ']' : '';
  if (!close) return '';
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close && --depth === 0) return text.slice(start, i + 1);
  }
  return '';
}

/** An object/array that contains functions, methods, JSX, or React component icons is code, not plain data. */
const CONTAINS_CODE_OR_JSX =
  /\basync\b|=>|\bfunction\b|<[A-Z][A-Za-z0-9]*\b|<\/[A-Za-z0-9]+>|\bicon\s*:\s*Pi[A-Z]|\b[A-Za-z_$][\w$]*\s*\([^)]*\)\s*(?::\s*[^{;]+)?\{/;

function isAllowedConst(fileRel: string, name: string, init: string): boolean {
  if (ALLOWED_CONSTS[`${fileRel}:${name}`]) return true;

  // Next.js App Router route segment exports
  if ((fileRel.startsWith('app/') || fileRel === 'proxy.ts' || fileRel === 'middleware.ts') && NEXTJS_ROUTE_EXPORTS.has(name)) return true;

  // Runtime mutable state stores (in-memory maps/sets)
  if (/^new\s+(Map|Set|WeakMap|WeakSet)\b/.test(init)) return true;

  // Motion animation definitions and variants
  if (fileRel === 'lib/motion.ts' || name.endsWith('Variants') || name.endsWith('Transition')) return true;

  // UI component styling primitives (Tailwind token dictionaries, variant and size maps)
  if (fileRel.startsWith('components/ui/')) return true;

  // React hook form options (e.g. SET_OPTS: shouldDirty, shouldTouch...)
  if (name === 'SET_OPTS') return true;

  // Local CSS class constants (Tailwind utility fragments like iconButton, iconButtonClass, INPUT, SELECT)
  if (/^(iconButton|iconButtonClass|INPUT|SELECT|BTN)$/.test(name)) return true;

  // Design system theme engines (template catalogs and site-system glyph/lottie definitions)
  if (fileRel.startsWith('components/templates/') || fileRel.startsWith('components/site-system/')) return true;

  return false;
}

function dataConstants(file: string, clean: string): string[] {
  const found: string[] = [];
  const fileRel = relPath(file);
  TOP_LEVEL_CONST.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = TOP_LEVEL_CONST.exec(clean))) {
    const [whole, name, init] = m;
    const trimmedInit = init.trim();
    if (!LITERAL_START.test(trimmedInit)) continue;
    if (isAllowedConst(fileRel, name, trimmedInit)) continue;

    const bracketAt = m.index + whole.length - init.length + (init.length - init.trimStart().length);
    if (/^[{[]/.test(trimmedInit) && CONTAINS_CODE_OR_JSX.test(balancedBlock(clean, bracketAt))) continue;

    found.push(`${fileRel}:${lineAt(clean, m.index)} const ${name} is a data constant, move it to src/constants/`);
  }
  return found;
}

const STATUS_PATTERNS: Array<{ label: string; re: RegExp }> = [
  { label: 'literal status equality check === [1-5]xx', re: /\.status\s*===?\s*[1-5]\d\d\b/g },
  { label: 'literal status in .status(...)', re: /\.status\(\s*[1-5]\d\d\s*\)/g },
  { label: 'literal status in { status: ... }', re: /\bstatus:\s*[1-5]\d\d\b/g },
  { label: 'literal Response status: new Response(..., { status: ... })', re: /new\s+Response\([^)]*\{\s*status:\s*[1-5]\d\d\b/g },
];

/** Scans read every source file; allow for a cold disk cache. */
const SCAN_TIMEOUT_MS = 60_000;

describe('frontend constants location', () => {
  const files = listSourceFiles(SKIP_DIRS);

  it('declares no module-level data constant outside src/constants/', () => {
    const violations = files.flatMap((f) => dataConstants(f, stripNoise(fs.readFileSync(f, 'utf8'))));
    expect(violations, `Move these into src/constants/<domain>.constants.ts:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('uses HTTP_STATUS instead of literal status codes', () => {
    const violations: string[] = [];
    for (const f of listSourceFiles(['constants'])) {
      const clean = stripNoise(fs.readFileSync(f, 'utf8'));
      for (const { label, re } of STATUS_PATTERNS) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(clean))) {
          violations.push(`${relPath(f)}:${lineAt(clean, m.index)} ${label}`);
        }
      }
    }
    expect(violations, `Use HTTP_STATUS.* from constants/http.constants.ts:\n${violations.join('\n')}`).toEqual([]);
  }, SCAN_TIMEOUT_MS);

  it('re-exports all domain constants through src/constants/index.ts', () => {
    const constantsDir = path.join(SRC, 'constants');
    const domainFiles = fs.readdirSync(constantsDir).filter((name) => name.endsWith('.constants.ts'));

    expect(domainFiles.length).toBeGreaterThan(0);
    expect(Constants).toBeDefined();
    expect(Constants.HTTP_STATUS).toBeDefined();
    expect(Constants.HTTP_METHODS).toBeDefined();
    expect(Constants.APP_NAME).toBeDefined();
    expect(Constants.STORAGE_KEYS).toBeDefined();
    expect(Constants.DEFAULT_NEW_BLUEPRINT).toBeDefined();
  });

  it('keeps constants files pure (no process.env in constants)', () => {
    const constantsDir = path.join(SRC, 'constants');
    const constFiles = fs.readdirSync(constantsDir).filter((f) => f.endsWith('.ts'));
    const violations: string[] = [];

    for (const file of constFiles) {
      const content = fs.readFileSync(path.join(constantsDir, file), 'utf8');
      if (content.includes('process.env')) {
        violations.push(`${file} reads process.env (env belongs in src/config/)`);
      }
    }

    expect(violations, violations.join('\n')).toEqual([]);
  });
});
