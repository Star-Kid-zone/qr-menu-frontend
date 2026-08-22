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

/** Builds a consistent theme object entirely from DB-saved values (same
 * fallback palette as the landing page's `buildTheme`) — used by every menu
 * "structure" component so they don't each hardcode their own defaults. */
export function buildMenuTheme(p: PublicMenuTemplateProps): MenuStructureTheme {
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
