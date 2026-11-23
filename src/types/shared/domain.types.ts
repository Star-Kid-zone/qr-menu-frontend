export interface SocialLink {
  platform?: string;
  icon?: string;
  name?: string;
  url?: string;
  enabled?: boolean;
}

export interface Currency {
  id: string | number;
  name: string;
  code: string;
  symbol: string;
}

export interface Setting {
  id: string | number;
  user_id?: string | number;
  /** Tenant subdomain slug for public landing (e.g. `vimal` → vimal.localhost). */
  public_slug?: string | null;
  theme_colour?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  menubtn_status?: boolean;
  paybtn_status?: boolean;
  reviewbtn_status?: boolean;
  special_offerstatus?: boolean;
  menu_theme?: number | string;
  landing_theme?: number | string;
  loading_screen_theme?: string;
  announcement_text?: string | null;
  announcement_enabled?: boolean;
  currency_id?: string | number | null;
  currency?: Currency;
  created_at?: string;
  updated_at?: string;
}

export type { Menu } from '@/types/admin/menu/menu.types';
export type { Industry, IndustryCategory, IndustryType } from './industry.types';

export type HostKind =
  | { kind: 'platform' }
  | { kind: 'tenant'; slug: string }
  /** Not ours: a restaurant's own domain, looked up via the API. */
  | { kind: 'custom'; domain: string };

export interface ThemeOption {
  value: string;
  label: string;
  description: string;
}
