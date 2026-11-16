import type { WorkspaceSettingsFormValues, WorkspaceSetting, WorkspaceSettingSource } from '@/types/workspace.types';
import { parseSiteDocument } from '@/components/templates/sections/document';

/**
 * Maps raw workspace setting domain object to the flat form values expected by UI.
 */
export function mapWorkspaceSettingToFormValues(setting: WorkspaceSetting | null): WorkspaceSettingsFormValues {
  const s = setting;
  return {
    theme_colour:         s?.theme_colour          ?? '',
    // Core colours
    primary_color:        s?.primary_color          ?? '',
    secondary_color:      s?.secondary_color        ?? '',
    accent_color:         s?.accent_color           ?? '',
    // Extended colours
    text_primary_color:   s?.text_primary_color     ?? '',
    text_secondary_color: s?.text_secondary_color   ?? '',
    accent_text_color:    s?.accent_text_color      ?? '',
    border_color:         s?.border_color           ?? '',
    footer_bg_color:      s?.footer_bg_color        ?? '',
    section_bg_color:     s?.section_bg_color       ?? '',
    // Typography & style (Landing)
    font_family:  s?.font_family  ?? '',
    card_style:   s?.card_style   || 'rounded-2xl',
    hero_overlay: s?.hero_overlay || 'linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))',
    heading_class: s?.heading_class || '',
    // Text customisation
    theme_badge:   s?.theme_badge   || '',
    theme_marquee: s?.theme_marquee || '',
    hero_tagline:  s?.hero_tagline  || '',
    // Menu design
    menu_primary_color:        s?.menu_primary_color        ?? '',
    menu_secondary_color:      s?.menu_secondary_color      ?? '',
    menu_accent_color:         s?.menu_accent_color         ?? '',
    menu_text_primary_color:   s?.menu_text_primary_color   ?? '',
    menu_text_secondary_color: s?.menu_text_secondary_color ?? '',
    menu_accent_text_color:    s?.menu_accent_text_color    ?? '',
    menu_border_color:         s?.menu_border_color         ?? '',
    menu_footer_bg_color:      s?.menu_footer_bg_color      ?? '',
    menu_section_bg_color:     s?.menu_section_bg_color     ?? '',
    menu_font_family:          s?.menu_font_family          ?? '',
    menu_card_style:           s?.menu_card_style           || 'rounded-2xl',
    // Layout
    menu_theme:           String(s?.menu_theme           ?? ''),
    landing_theme:        String(s?.landing_theme        ?? ''),
    landing_structure:    s?.landing_structure           || '',
    menu_structure:       s?.menu_structure              || '',
    skin_id:              String(s?.skin_id ?? ''),
    menu_skin_id:         String(s?.menu_skin_id ?? ''),
    business_type:        String(s?.business_type ?? ''),
    loading_screen_theme: s?.loading_screen_theme        || 'default',
    site_document:        parseSiteDocument(s?.site_document),
    // Visibility
    menubtn_status:      !!s?.menubtn_status,
    paybtn_status:       !!s?.paybtn_status,
    reviewbtn_status:    !!s?.reviewbtn_status,
    special_offerstatus: !!s?.special_offerstatus,
    announcement_enabled: !!s?.announcement_enabled,
    announcement_text:   s?.announcement_text || '',
    announcement_starts_at: s?.announcement_starts_at || '',
    announcement_ends_at:   s?.announcement_ends_at   || '',
    currency_id: s?.currency_id ? Number(s.currency_id) : null,
  };
}

export function getDefaultWorkspaceSettings(): WorkspaceSettingsFormValues {
  return {
    theme_colour:         '#0F766E',
    primary_color:        '#0F766E',
    secondary_color:      '#14B8A6',
    accent_color:         '#134E4A',
    text_primary_color:   '#0f172a',
    text_secondary_color: '#475569',
    accent_text_color:    '#ffffff',
    border_color:         '#e2e8f0',
    footer_bg_color:      '#0B2B29',
    section_bg_color:     '#f1f5f9',
    font_family:  '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
    card_style:   'rounded-2xl',
    hero_overlay: 'linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))',
    heading_class: '',
    theme_badge:   '',
    theme_marquee: '',
    hero_tagline:  '',
    menu_primary_color:        '#0F766E',
    menu_secondary_color:      '#14B8A6',
    menu_accent_color:         '#134E4A',
    menu_text_primary_color:   '#0f172a',
    menu_text_secondary_color: '#475569',
    menu_accent_text_color:    '#ffffff',
    menu_border_color:         '#e2e8f0',
    menu_footer_bg_color:      '#0B2B29',
    menu_section_bg_color:     '#f1f5f9',
    menu_font_family:          '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
    menu_card_style:           'rounded-2xl',
    menu_theme:           '1',
    landing_theme:        '1',
    landing_structure:    '',
    menu_structure:       '',
    skin_id:              '',
    menu_skin_id:         '',
    business_type:        '',
    loading_screen_theme: 'default',
    site_document:        null,
    menubtn_status:      true,
    paybtn_status:       true,
    reviewbtn_status:    true,
    special_offerstatus: true,
    announcement_enabled: false,
    announcement_text:   '',
    announcement_starts_at: '',
    announcement_ends_at:   '',
    currency_id: null,
  };
}

/**
 * Builds a partial Setting payload from form values for API updates.
 */
export function buildWorkspaceSettingsPayload(values: WorkspaceSettingsFormValues): WorkspaceSettingSource {
  return {
    theme_colour:         values.theme_colour,
    primary_color:        values.primary_color,
    secondary_color:      values.secondary_color,
    accent_color:         values.accent_color,
    text_primary_color:   values.text_primary_color,
    text_secondary_color: values.text_secondary_color,
    accent_text_color:    values.accent_text_color,
    border_color:         values.border_color,
    footer_bg_color:      values.footer_bg_color,
    section_bg_color:     values.section_bg_color,
    font_family:          values.font_family,
    card_style:           values.card_style,
    hero_overlay:         values.hero_overlay,
    heading_class:        values.heading_class,
    theme_badge:          values.theme_badge,
    theme_marquee:        values.theme_marquee,
    hero_tagline:         values.hero_tagline,
    menu_primary_color:        values.menu_primary_color,
    menu_secondary_color:      values.menu_secondary_color,
    menu_accent_color:         values.menu_accent_color,
    menu_text_primary_color:   values.menu_text_primary_color,
    menu_text_secondary_color: values.menu_text_secondary_color,
    menu_accent_text_color:    values.menu_accent_text_color,
    menu_border_color:         values.menu_border_color,
    menu_footer_bg_color:      values.menu_footer_bg_color,
    menu_section_bg_color:     values.menu_section_bg_color,
    menu_font_family:          values.menu_font_family,
    menu_card_style:           values.menu_card_style,
    menu_theme:           values.menu_theme,
    landing_theme:        values.landing_theme,
    landing_structure:    values.landing_structure,
    menu_structure:       values.menu_structure,
    skin_id:              values.skin_id,
    menu_skin_id:         values.menu_skin_id,
    business_type:        values.business_type,
    loading_screen_theme: values.loading_screen_theme,
    site_document:        values.site_document,
    menubtn_status:       values.menubtn_status,
    paybtn_status:        values.paybtn_status,
    reviewbtn_status:     values.reviewbtn_status,
    special_offerstatus:  values.special_offerstatus,
    announcement_enabled: values.announcement_enabled,
    announcement_text:    values.announcement_text,
    announcement_starts_at: values.announcement_starts_at || null,
    announcement_ends_at:   values.announcement_ends_at   || null,
    currency_id:          values.currency_id,
  };
}

/** "YYYY-MM-DDTHH:mm" (datetime-local input value, browser-local time) <-> ISO string. */
export function isoToDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function datetimeLocalToIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
