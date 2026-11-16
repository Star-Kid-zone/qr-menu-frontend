import type { SkinDefinition } from "../types";

/**
 * Form values a skin writes when an owner picks it (style gallery or a kit):
 * its palette into the site and menu colour fields, its reading face into
 * both fonts, plus its hero tint and heading style.
 */
export function skinFormValues(skin: SkinDefinition): Record<string, string> {
  const p = skin.palette;
  const roles: Record<string, string> = {
    accent_color: p.bg,
    secondary_color: p.surface,
    primary_color: p.accent,
    text_primary_color: p.text,
    text_secondary_color: p.textMuted,
    accent_text_color: p.accentText,
    border_color: p.border,
    section_bg_color: p.band,
    footer_bg_color: p.footer,
    font_family: skin.fonts.body,
  };
  const out: Record<string, string> = { skin_id: skin.id, hero_overlay: skin.heroOverlay, heading_class: skin.headingClass };
  for (const [k, v] of Object.entries(roles)) {
    out[k] = v;
    out[`menu_${k}`] = v;
  }
  return out;
}
