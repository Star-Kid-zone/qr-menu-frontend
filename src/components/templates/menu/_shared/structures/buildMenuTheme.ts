import type { PublicMenuTemplateProps } from "@/components/templates/core/types";

export interface MenuStructureTheme {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  fontFamily: string;
  cardStyle: string;
  footerBg: string;
  sectionBg: string;
}

/**
 * The colours every menu structure draws with: the resolved site look (the
 * skin, then the owner's menu colours, then their site colours — see
 * site-system/kit/look.ts), so the menu always matches the landing page.
 */
export function buildMenuTheme(p: PublicMenuTemplateProps): MenuStructureTheme {
  const look = p.look;
  if (look) {
    const pal = look.palette;
    return {
      bg: pal.bg,
      surface: pal.surface,
      accent: pal.accent,
      textPrimary: pal.text,
      textSecondary: pal.textMuted,
      accentText: pal.accentText,
      border: pal.border,
      footerBg: pal.footer,
      sectionBg: pal.band,
      fontFamily: look.fonts.body,
      cardStyle: p.cardStyle || "rounded-2xl",
    };
  }
  // Callers without a resolved look (tests that build props by hand).
  return {
    bg:            p.accent        || "#f8fafc",
    surface:       p.secondary     || "#ffffff",
    accent:        p.primary       || "#0f172a",
    textPrimary:   p.textPrimary   || "#0f172a",
    textSecondary: p.textSecondary || "#475569",
    accentText:    p.accentText    || "#ffffff",
    border:        p.borderColor   || "#e2e8f0",
    footerBg:      p.footerBg      || "#0f172a",
    sectionBg:     p.sectionBg     || "#f1f5f9",
    fontFamily:    p.fontFamily    || '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
    cardStyle:     p.cardStyle     || "rounded-2xl",
  };
}
