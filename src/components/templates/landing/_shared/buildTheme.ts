import type { ThemeConfig } from './BaseTemplate';
import type { RichContent } from './defaults';

/**
 * Builds a ThemeConfig entirely from DB-saved values (c.colors / c.theme).
 * Used by structure components that don't have a hardcoded template default.
 */
export function buildTheme(c: RichContent): ThemeConfig {
  return {
    slug: c.slug,
    bg:            c.colors.accent        || '#f8fafc',
    surface:       c.colors.secondary     || '#ffffff',
    accent:        c.colors.primary       || '#0f172a',
    textPrimary:   c.colors.textPrimary   || '#0f172a',
    textSecondary: c.colors.textSecondary || '#475569',
    accentText:    c.colors.accentText    || '#ffffff',
    border:        c.colors.borderColor   || '#e2e8f0',
    footerBg:      c.colors.footerBg      || '#0f172a',
    sectionBg:     c.colors.sectionBg     || '#f1f5f9',
    fontFamily:    c.theme.fontFamily     || '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
    cardStyle:     c.theme.cardStyle      || 'rounded-2xl',
    heroOverlay:   c.theme.heroOverlay    || 'linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))',
    badge:         c.theme.badge          || '',
    marqueeText:   c.theme.marqueeText    || '',
  };
}
