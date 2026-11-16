import { LANDING_THEME_DATA } from '@/components/templates/landing/_shared/themeData';
import type { ThemeConfig } from '@/components/templates/landing/_shared/BaseTemplate';
import type { SkinDefinition, SkinFamily } from '../types';
import { FAMILY_DEFAULTS } from './families';

/**
 * The old style templates that pass the contrast checks, as skins (docs/site-system/PLAN.md §2.6).
 *
 * Derived at runtime from LANDING_THEME_DATA instead of copied, so there is
 * one source for their colours and fonts and a converted skin can never drift
 * from the template it replaces (skins.test.ts checks every value).
 * The only hand-written part is which family each template belongs to.
 */
export const LEGACY_FAMILY: Record<string, SkinFamily> = {
  // Royal and classic
  'art-deco': 'royal-classic', 'baroque-gold': 'royal-classic',
  'renaissance-classic': 'royal-classic', 'victorian-maximalism': 'royal-classic', 'serif-elegance': 'royal-classic',
  'dark-academia': 'royal-classic', 'light-academia': 'royal-classic', 'gothic-noir': 'royal-classic',
  velum: 'royal-classic', 'oil-painting-ui': 'royal-classic',
  // Luxury minimal
  'arctic-minimal': 'luxury-minimal', 'zen-ui': 'luxury-minimal', nocturne: 'luxury-minimal',
  'minimalist-monochrome': 'luxury-minimal',
  // Modern minimal
  minimalism: 'modern-minimal', 'swiss-international': 'modern-minimal',
  'grid-minimal': 'modern-minimal', modernism: 'modern-minimal',
  'fluent-design': 'modern-minimal',
  'dashboard-ui': 'modern-minimal',
  // Editorial
  'editorial-magazine': 'editorial', 'newspaper-style': 'editorial',
  'typography-centric': 'editorial', 'high-contrast-typography': 'editorial', 'display-type-heavy': 'editorial',
  'kinetic-typography': 'editorial', folio: 'editorial',
  // Warm and rustic
  'chalkboard-style': 'warm-rustic', 'charcoal-sketch': 'warm-rustic',
  forge: 'warm-rustic',
  illustrative: 'warm-rustic',
  // Botanical
  botanical: 'botanical', 'jungle-lush': 'botanical',
  solarpunk: 'botanical', 'oceanic-deep': 'botanical',
  // Bold and pop
  maximalism: 'bold-pop', 'neo-brutalism': 'bold-pop',
  'bauhaus-classic': 'bold-pop', 'de-stijl': 'bold-pop', constructivism: 'bold-pop',
  expressionism: 'bold-pop', psychedelic: 'bold-pop', 'pop-surrealism': 'bold-pop',
  surrealism: 'bold-pop',
  // Retro and vintage
  'vintage-print': 'retro-vintage',
  steampunk: 'retro-vintage', 'cassette-futurism': 'retro-vintage',
  'brutalist-industrial': 'retro-vintage', grunge: 'retro-vintage', 'retro-futurism': 'retro-vintage',
  'technical-drawing': 'retro-vintage', 'blueprint-schematic': 'retro-vintage',
  // Neon and night
  'neon-glow': 'neon-night', cyberpunk: 'neon-night', vaporwave: 'neon-night',
  'dark-mode-noir': 'neon-night', 'matrix-style': 'neon-night',
  dreamcore: 'neon-night', 'galactic-void': 'neon-night',
  // Futurist
  'sci-fi-ui': 'futurist', 'ai-interface': 'futurist', 'holographic-ui': 'futurist',
  biopunk: 'futurist', prism: 'futurist', auroramorphism: 'futurist',
  // Pixel and 90s
  'pixel-art': 'pixel-90s', 'ascii-art': 'pixel-90s',
};

/** Prefix that keeps converted ids apart from flagship ids. */
export const LEGACY_PREFIX = 'legacy-';

/** Converts one style template to a skin; the palette and fonts are exactly the template's. */
export function skinFromTheme(theme: ThemeConfig, family: SkinFamily): SkinDefinition {
  const d = FAMILY_DEFAULTS[family];
  const label = theme.slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    id: `${LEGACY_PREFIX}${theme.slug}`,
    family,
    label,
    description: `The ${label} style.`,
    palette: {
      bg: theme.bg,
      surface: theme.surface,
      accent: theme.accent,
      accentText: theme.accentText,
      text: theme.textPrimary,
      textMuted: theme.textSecondary,
      border: theme.border,
      band: theme.sectionBg ?? theme.surface,
      // Same fallbacks as buildLandingContext, so a converted skin renders exactly like its template.
      footer: theme.footerBg ?? theme.bg,
    },
    fonts: { display: theme.fontFamily, body: theme.fontFamily },
    headingClass: theme.headingClass ?? '',
    shape: { ...d.shape, card: theme.cardStyle ?? d.shape.card },
    iconStyle: d.iconStyle,
    ornaments: d.ornaments,
    background: { texture: d.texture },
    heroOverlay: theme.heroOverlay,
    tempo: d.tempo,
    legacyThemeSlug: theme.slug,
  };
}

export const LEGACY_SKINS: readonly SkinDefinition[] = Object.values(LANDING_THEME_DATA)
  .filter((t) => LEGACY_FAMILY[t.slug])
  .map((t) => skinFromTheme(t, LEGACY_FAMILY[t.slug]));
