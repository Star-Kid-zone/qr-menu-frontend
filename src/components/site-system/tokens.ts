import type { CSSProperties } from 'react';
import { contrastRatio } from '@/utils/contrast';
import type { Palette, SiteLook } from './types';

/**
 * Text colours for the footer band. Many skins pair a dark footer with dark
 * body text, so the footer reads with whichever of the page's text or page
 * background colour contrasts more with it.
 */
export function footerInk(palette: Palette): Record<'--site-footer-text' | '--site-footer-muted' | '--site-footer-accent', string> {
  const onText = contrastRatio(palette.footer, palette.text) ?? 0;
  const onBg = contrastRatio(palette.footer, palette.bg) ?? 0;
  const ink = onText >= onBg ? palette.text : palette.bg;
  // The accent only when it reads on the footer; otherwise the ink.
  const accentOk = (contrastRatio(palette.footer, palette.accent) ?? 0) >= 3;
  return {
    '--site-footer-text': ink,
    '--site-footer-muted': `color-mix(in srgb, ${ink} 74%, ${palette.footer})`,
    '--site-footer-accent': accentOk ? palette.accent : ink,
  };
}

/**
 * The token contract (docs/site-system/PLAN.md §1.2) as CSS custom
 * properties. Extends the existing `--site-*` set from
 * components/templates/sections/themeVars.ts with the new tokens; the
 * names of the existing ones are unchanged so current sections keep working.
 *
 * Layouts and menu structures read only these variables (plus
 * SiteLookContext) — never a colour, font or icon of their own.
 */
export function siteLookCssVars(look: SiteLook): CSSProperties {
  const { palette, fonts, occasion } = look;
  const vars: Record<string, string> = {
    '--site-bg': palette.bg,
    '--site-surface': palette.surface,
    '--site-section-bg': palette.band,
    '--site-footer-bg': palette.footer,
    '--site-border': palette.border,
    '--site-text': palette.text,
    '--site-text-muted': palette.textMuted,
    '--site-accent': palette.accent,
    '--site-accent-text': palette.accentText,
    '--site-hero-overlay': look.skin.heroOverlay,
    '--site-font': fonts.body,
    '--site-font-display': fonts.display || fonts.body,
    '--site-radius': `${look.radius}px`,
    '--site-tempo': String(look.motion === 'off' ? 0 : look.tempo),
    ...footerInk(palette),
  };

  if (occasion) {
    const [t1, t2, t3] = occasion.definition.tints;
    vars['--occ-1'] = t1;
    vars['--occ-2'] = t2 ?? t1;
    vars['--occ-3'] = t3 ?? t2 ?? t1;
    vars['--occ-ink'] = occasion.definition.ink;
  }

  return vars as CSSProperties;
}
