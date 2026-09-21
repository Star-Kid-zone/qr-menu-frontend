import * as z from 'zod';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/, 'Must be a valid hex color');

export const workspaceSettingsSchema = z.object({
  theme_colour:        z.string().min(1, 'Theme alias is required'),
  // Core colours
  primary_color:       hexColor,
  secondary_color:     hexColor,
  accent_color:        hexColor,
  // Extended colours
  text_primary_color:   hexColor,
  text_secondary_color: hexColor,
  accent_text_color:    hexColor,
  border_color:         hexColor,
  footer_bg_color:      hexColor,
  section_bg_color:     hexColor,
  // Typography & style (Landing)
  font_family:   z.string(),
  card_style:    z.string(),
  hero_overlay:  z.string(),
  heading_class: z.string(),
  // Text customisation
  theme_badge:   z.string(),
  theme_marquee: z.string(),
  hero_tagline:  z.string(),
  // Menu design (separate from landing)
  menu_primary_color:       hexColor,
  menu_secondary_color:     hexColor,
  menu_accent_color:        hexColor,
  menu_text_primary_color:  hexColor,
  menu_text_secondary_color: hexColor,
  menu_accent_text_color:   hexColor,
  menu_border_color:        hexColor,
  menu_footer_bg_color:     hexColor,
  menu_section_bg_color:    hexColor,
  menu_font_family:         z.string(),
  menu_card_style:          z.string(),
  // Layout
  menu_theme:          z.string().min(1, 'Menu layout is required'),
  landing_theme:       z.string().min(1, 'Landing layout is required'),
  landing_structure:   z.string(),
  menu_structure:      z.string(),
  loading_screen_theme: z.string().min(1, 'Loading screen is required'),
  // Visibility
  menubtn_status:      z.boolean(),
  paybtn_status:       z.boolean(),
  reviewbtn_status:    z.boolean(),
  special_offerstatus: z.boolean(),
  announcement_enabled: z.boolean(),
  announcement_text:   z.string(),
  currency_id:         z.number().int().positive().nullable(),
});
