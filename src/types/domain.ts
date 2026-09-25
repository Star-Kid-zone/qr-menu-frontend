export interface SocialLink {
  platform?: string;
  icon?: string;
  name?: string;
  url?: string;
  enabled?: boolean;
}

export interface Business {
  id: number;
  business_name?: string;
  name?: string;
  phone?: string;
  description?: string;
  address?: string;
  website_url?: string;
  social_media?: SocialLink[];
  social_links?: SocialLink[];
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  about_features?: unknown;
  user_id?: number;
  workspace_id?: number | null;
  industry_id?: number | null;
  active?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface Menu {
  id: number;
  business_id?: number;
  name?: string;
  item: string;
  description: string;
  price: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  /** Extra gallery photos beyond the cover `image_url`/`imageUrl` — stored as plain URL
   *  strings, though some legacy data may still hand back `{id, url}` objects. */
  images?: (string | { id: number; url: string })[];
  /** Extra promo videos for the item — plain URL strings. */
  videos?: string[];
  category: string;
  type: string;
  popular: boolean;
  availability: boolean;
  availability_time?: string;
  /** e.g. ['vegetarian', 'gluten_free'] — see constants/dietary.constants.ts */
  dietaryTags?: string[];
  allergens?: string[];
  /** 0 (not spicy) to 3 (hot); undefined/null = not specified */
  spiceLevel?: number | null;
  calories?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type MenuItem = Menu;

export interface QRCode {
  id: number;
  business_id: number;
  code: string;
  data?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: number;
  business_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  business_id: number;
  user_id: number;
  rating: number;
  review_link?: string;
  comment?: string;
  user?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
}

export interface Setting {
  id: number;
  user_id?: number;
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
  currency_id?: number | null;
  currency?: Currency;
  created_at?: string;
  updated_at?: string;
}

export interface IndustryFeature {
  id: number;
  name: string;
}

export interface BusinessAboutFeatures {
  enabled: boolean;
  items: Array<{
    name: string;
    description?: string;
    enabled?: boolean;
  }>;
}

export interface Industry {
  id: number;
  name: string;
}

export interface IndustryCategory {
  id: number;
  name: string;
  industry_id: number;
}

export interface IndustryType {
  id: number;
  name: string;
  industry_id: number;
}
