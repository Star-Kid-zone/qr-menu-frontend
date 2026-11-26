import * as z from 'zod';
import type { SiteDocument } from '@/components/templates/sections/types';

// Blank = no override: the chosen style decides this colour.
const hexColor = z.string().regex(/^(#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?)?$/, 'Must be a valid hex color');

export const workspaceSettingsSchema = z.object({
  theme_colour:        z.string(),
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
  // Old style templates: optional now that a style (skin) decides the look.
  menu_theme:          z.string(),
  landing_theme:       z.string(),
  landing_structure:   z.string(),
  menu_structure:      z.string(),
  skin_id:             z.string(),
  menu_skin_id:        z.string(),
  business_type:       z.string(),
  loading_screen_theme: z.string(),
  // Validated on the server (siteDocumentSchema); the editor only produces well-formed documents.
  site_document:       z.custom<SiteDocument | null>(),
  // Visibility
  menubtn_status:      z.boolean(),
  paybtn_status:       z.boolean(),
  reviewbtn_status:    z.boolean(),
  special_offerstatus: z.boolean(),
  announcement_enabled: z.boolean(),
  announcement_text:   z.string(),
  announcement_starts_at: z.string(),
  announcement_ends_at:   z.string(),
  currency_id:         z.string().regex(/^\d+$/).nullable(),
});

/** Announcement banner form (Website > Banners). */
export const bannerAnnouncementSchema = z.object({
  announcement_enabled: z.boolean(),
  announcement_text: z.string(),
  // datetime-local input values ("YYYY-MM-DDTHH:mm") or "" for unset — parsed
  // to/from ISO strings at the API boundary in listbusiness/page.tsx.
  announcement_starts_at: z.string(),
  announcement_ends_at: z.string(),
}).refine(
  (v) => !v.announcement_starts_at || !v.announcement_ends_at || v.announcement_starts_at < v.announcement_ends_at,
  { message: "Start must be before end.", path: ["announcement_ends_at"] },
);
