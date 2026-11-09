import type { Setting, SocialLink } from "@/types";

export type WorkspaceToggleKey =
  | "menubtn_status"
  | "paybtn_status"
  | "reviewbtn_status"
  | "special_offerstatus"
  | "announcement_enabled";

export type WorkspaceColorKey =
  | "primary_color"
  | "secondary_color"
  | "accent_color"
  | "text_primary_color"
  | "text_secondary_color"
  | "accent_text_color"
  | "border_color"
  | "footer_bg_color"
  | "section_bg_color";

export type MenuColorKey =
  | "menu_primary_color"
  | "menu_secondary_color"
  | "menu_accent_color"
  | "menu_text_primary_color"
  | "menu_text_secondary_color"
  | "menu_accent_text_color"
  | "menu_border_color"
  | "menu_footer_bg_color"
  | "menu_section_bg_color";

export interface WorkspaceSettingsFormValues {
  theme_colour: string;
  // Core colours
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  // Extended colours
  text_primary_color: string;
  text_secondary_color: string;
  accent_text_color: string;
  border_color: string;
  footer_bg_color: string;
  section_bg_color: string;
  // Typography & style (Landing)
  font_family: string;
  card_style: string;
  hero_overlay: string;
  heading_class: string;
  // Text customisation
  theme_badge: string;
  theme_marquee: string;
  hero_tagline: string;
  // Menu design (separate from landing)
  menu_primary_color: string;
  menu_secondary_color: string;
  menu_accent_color: string;
  menu_text_primary_color: string;
  menu_text_secondary_color: string;
  menu_accent_text_color: string;
  menu_border_color: string;
  menu_footer_bg_color: string;
  menu_section_bg_color: string;
  menu_font_family: string;
  menu_card_style: string;
  // Layout
  menu_theme: string;
  landing_theme: string;
  landing_structure: string;
  menu_structure: string;
  loading_screen_theme: string;
  // Visibility toggles
  menubtn_status: boolean;
  paybtn_status: boolean;
  reviewbtn_status: boolean;
  special_offerstatus: boolean;
  announcement_enabled: boolean;
  announcement_text: string;
  /** datetime-local input values ("YYYY-MM-DDTHH:mm") or "" for unset. */
  announcement_starts_at: string;
  announcement_ends_at: string;
  currency_id: number | null;
}

export interface WorkspaceLayoutOption {
  value: string;
  label: string;
  description: string;
}

export interface WorkspacePalette {
  name: string;
  alias: string;
  // Core colours (map to primary/secondary/accent_color in DB)
  primary: string;
  secondary: string;
  accent: string;
  // Extended colours
  textPrimary?: string;
  textSecondary?: string;
  accentText?: string;
  borderColor?: string;
  footerBg?: string;
  sectionBg?: string;
  // Typography & style
  fontFamily?: string;
  cardStyle?: string;
  heroOverlay?: string;
  headingClass?: string;
  // Text content
  badge?: string;
  marqueeText?: string;
  heroTagline?: string;
}

export interface WorkspaceToggleOption {
  id: WorkspaceToggleKey;
  label: string;
  description: string;
}

export interface WorkspaceColorField {
  name: WorkspaceColorKey;
  label: string;
}

export interface WorkspaceAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface WorkspaceBusiness {
  id: number;
  business_name: string;
  phone: string;
  address?: string;
  website_url?: string;
  industry_id?: number | null;
  social_media?: SocialLink[];
  social_links?: SocialLink[];
  availability?: WorkspaceAvailability[];
  active: boolean;
  user_id: number;
  industry?: {
    id: number;
    name: string;
  } | null;
  gstin?: string | null;
  pincode?: string | null;
  taxInclusive?: boolean;
  serviceChargePercent?: number | string | null;
}

export interface WorkspaceOffer {
  id: number;
  user_id: number;
  workspace_id?: number | null;
  title: string;
  description?: string | null;
  offer_type: "percentage_discount" | "bogo" | "flat_discount" | "custom";
  offer_value?: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  badge_text?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceGalleryItem {
  id: number;
  user_id: number;
  workspace_id?: number | null;
  caption?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  is_active: boolean;
  sort_order?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceDashboardData {
  settings: WorkspaceSetting | null;
  business: WorkspaceBusiness | null;
  businesses: WorkspaceBusiness[];
  review: unknown;
  payment: unknown;
  offers: WorkspaceOffer[];
  workspace_offers: WorkspaceOffer[];
  gallery: WorkspaceGalleryItem[];
  workspace_gallery: WorkspaceGalleryItem[];
}

export interface WorkspaceSettingSource extends Omit<
  Partial<Setting>,
  "currency_id"
> {
  id?: number;
  currency_id?: number | string | null;
  // Extended colours
  text_primary_color?: string | null;
  text_secondary_color?: string | null;
  accent_text_color?: string | null;
  border_color?: string | null;
  footer_bg_color?: string | null;
  section_bg_color?: string | null;
  // Typography & style (Landing)
  font_family?: string | null;
  card_style?: string | null;
  hero_overlay?: string | null;
  heading_class?: string | null;
  // Text customisation
  theme_badge?: string | null;
  theme_marquee?: string | null;
  hero_tagline?: string | null;
  // Menu design (separate from landing)
  menu_primary_color?: string | null;
  menu_secondary_color?: string | null;
  menu_accent_color?: string | null;
  menu_text_primary_color?: string | null;
  menu_text_secondary_color?: string | null;
  menu_accent_text_color?: string | null;
  menu_border_color?: string | null;
  menu_footer_bg_color?: string | null;
  menu_section_bg_color?: string | null;
  menu_font_family?: string | null;
  menu_card_style?: string | null;
  // Layout
  landing_structure?: string | null;
  menu_structure?: string | null;
  // Announcement schedule (ISO strings)
  announcement_starts_at?: string | null;
  announcement_ends_at?: string | null;
}

export type WorkspaceSetting = WorkspaceSettingSource;
