export interface SocialLink {
  platform?: string;
  icon?: string;
  name?: string;
  url?: string;
  enabled?: boolean;
}

export interface Menu {
  id: string | number;
  business_id?: string | number;
  name?: string;
  item: string;
  description: string;
  price: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  /** Extra gallery photos beyond the cover `image_url`/`imageUrl` — stored as plain URL
   *  strings, though some legacy data may still hand back `{id, url}` objects. */
  images?: (string | { id: string | number; url: string })[];
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
  /** Business-type details, display only: { [setId]: { [field]: value } } — see site-system/attributes.ts */
  attributes?: Record<string, Record<string, unknown>>;
  /** Several prices for one item (e.g. Glass / Bottle). `price` is the lowest of them. */
  priceOptions?: Array<{ label: string; price: string }>;
  created_at?: string;
  updated_at?: string;
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

export interface Industry {
  id: string | number;
  name: string;
}

export interface IndustryCategory {
  id: string | number;
  name: string;
  industry_id: string | number;
}

export interface IndustryType {
  id: string | number;
  name: string;
  industry_id: string | number;
}
