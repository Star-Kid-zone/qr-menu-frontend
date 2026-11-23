import type { SocialLink } from '@/types';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
}

export interface LinkState {
  review_link: string;
  payment_link: string;
}

export interface LandingFeatureSection {
  enabled: boolean;
  items: string[];
}

export type LandingFeatureMap = Record<string, LandingFeatureSection>;

export interface LandingOffer {
  id: number;
  title: string;
  description?: string | null;
  offer_type?: string | null;
  offer_value?: string | null;
  badge_text?: string | null;
  end_date?: string;
}

export interface LandingBusinessState {
  business_name: string;
  phone: string;
  address: string;
  website_url: string;
  social_media: SocialLink[];
  industry_id: number | string | null;
  about_features: LandingFeatureMap;
  offers: LandingOffer[];
}

export interface LandingSettingState {
  id: number | null;
  menubtn_status: boolean;
  paybtn_status: boolean;
  reviewbtn_status: boolean;
  special_offerstatus: boolean;
  menu_theme: string | null;
  landing_theme: string;
  loading_screen_theme: string;
  announcement_text: string | null;
  announcement_enabled: boolean;
}
