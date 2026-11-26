import type { Setting, SocialLink } from "@/types";
import type { SiteDocument } from "@/components/templates/sections/types";
import type { QrDestination, QrFrameSettings } from "../qrCodes/qrCodes.types";

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
  /** Site system: chosen style (skin) for the site and, optionally, the menu; '' = from the style template. */
  skin_id: string;
  menu_skin_id: string;
  /** Business type id ('' = from the starter kit, else generic). */
  business_type: string;
  /** Website CMS: section order + hidden flags for landing/menu. null = default layout. */
  site_document: SiteDocument | null;
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
  currency_id: string | null;
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

interface WorkspaceAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface WorkspaceBusiness {
  id: string;
  business_name: string;
  phone: string;
  address?: string;
  website_url?: string;
  industry_id?: string | null;
  social_media?: SocialLink[];
  social_links?: SocialLink[];
  availability?: WorkspaceAvailability[];
  active: boolean;
  user_id: string;
  industry?: {
    id: string;
    name: string;
  } | null;
  gstin?: string | null;
  pincode?: string | null;
  taxInclusive?: boolean;
  serviceChargePercent?: number | string | null;
}

export interface WorkspaceGalleryItem {
  id: string;
  workspaceId?: string;
  imageUrl: string;
  createdAt?: string;
  user_id?: string;
  workspace_id?: string | null;
  caption?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  is_active?: boolean;
  sort_order?: number | null;
  updated_at?: string;
}

interface WorkspaceSettingSource extends Omit<
  Partial<Setting>,
  "currency_id"
> {
  id?: string;
  currency_id?: string | null;
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
  skin_id?: string | null;
  menu_skin_id?: string | null;
  business_type?: string | null;
  site_document?: SiteDocument | null;
  // Announcement schedule (ISO strings)
  announcement_starts_at?: string | null;
  announcement_ends_at?: string | null;
}

export type WorkspaceSetting = WorkspaceSettingSource;

export interface WorkspaceTheme {
  themeColour: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  accentTextColor: string;
  borderColor: string;
  footerBgColor: string;
  sectionBgColor: string;
  fontFamily: string;
  cardStyle: string;
  heroOverlay: string;
  themeBadge: string;
  themeMarquee: string;
  headingClass?: string;
  heroTagline?: string;
  menuTheme: string;
  landingTheme: string;
  landingStructure: string;
  loadingScreenTheme: string;
  /** Site system: '' = not chosen (falls back to landingTheme / menuTheme / the generic business type). */
  skinId?: string;
  menuSkinId?: string;
  businessType?: string;
  // Menu-specific design
  menuPrimaryColor?: string;
  menuSecondaryColor?: string;
  menuAccentColor?: string;
  menuTextPrimaryColor?: string;
  menuTextSecondaryColor?: string;
  menuAccentTextColor?: string;
  menuBorderColor?: string;
  menuFooterBgColor?: string;
  menuSectionBgColor?: string;
  menuFontFamily?: string;
  menuCardStyle?: string;
  menuStructure?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

interface WorkspaceButtons {
  menubtnStatus: boolean;
  paybtnStatus: boolean;
  reviewbtnStatus: boolean;
  specialOfferStatus: boolean;
}

interface WorkspaceAnnouncement {
  text: string | null;
  enabled: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface WorkspaceBusinessProfile {
  id?: string;
  name?: string;
  industryId?: string | null;
  phone?: string;
  address?: string | null;
  businessHours?: string | null;
  whatsappNumber?: string | null;
  locationUrl?: string | null;
  websiteUrl?: string | null;
  socialLinks?: SocialLink[] | null;
  availability?: Array<{ day: string; startTime: string; endTime: string }> | null;
  gstin?: string | null;
  taxInclusive?: boolean;
  serviceChargePercent?: number | string | null;
  pincode?: string | null;
}

export interface WorkspaceReviewConfig {
  googleReviewLink: string | null;
  googlePlaceId?: string | null;
}

export interface GooglePlaceResult {
  placeId: string;
  name: string;
  address: string;
  reviewLink: string;
}

export interface GoogleReviewRecord {
  id: string;
  workspaceId: string;
  googleReviewId: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativePublishDescription: string | null;
  publishTime: string | null;
  createdAt: string;
  isFeatured: boolean;
  replyText?: string | null;
  replyTime?: string | null;
  isAutoReplied?: boolean;
}

export interface WorkspacePaymentConfig {
  type: string;
  link: string | null;
  qrImage: string | null;
}

export interface WorkspaceQrCodeConfig {
  url: string;
  size: number;
  margin: number;
  dataPattern: string;
  dataColor: string;
  finderPattern: string;
  finderColor: string;
  backgroundFill: string;
  logo: string | null;
  /** Where a scan lands; the URL is rebuilt from it so an address change follows through. */
  destination?: QrDestination;
  frame?: QrFrameSettings | null;
}

export interface WorkspaceOfferItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  discount: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

interface WorkspaceCurrency {
  code: string;
  symbol: string;
}

interface WorkspaceContent {
  storyHeadline: string | null;
  storyBody: string | null;
  stats: Array<{ label: string; value: string }>;
}

export interface WorkspaceFaq {
  id: string;
  workspaceId: string;
  question: string;
  answer: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface WorkspaceData {
  workspaceId: string;
  publicSlug: string | null;
  theme: WorkspaceTheme;
  buttons: WorkspaceButtons;
  announcement: WorkspaceAnnouncement;
  business: WorkspaceBusinessProfile | null;
  review: WorkspaceReviewConfig;
  payment: WorkspacePaymentConfig;
  qrCode: WorkspaceQrCodeConfig;
  content: WorkspaceContent;
  /** Website CMS section layout; null = default layout. */
  siteDocument?: SiteDocument | null;
  /** IANA time zone the restaurant runs in (default "UTC"). */
  timezone?: string;
  gallery: WorkspaceGalleryItem[];
  offers: WorkspaceOfferItem[];
  faqs: WorkspaceFaq[];
  currency: WorkspaceCurrency | null;
  currencyId?: string | null;
}

export interface WorkspaceListItem {
  id: string;
  publicSlug: string | null;
  themeColour: string;
  defaultTimezone: string;
  role: string;
  isDefault: boolean;
}

/** A custom domain connected (or being connected) to the guest site. */
export interface SiteDomain {
  id: string;
  domain: string;
  verified: boolean;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  dns: {
    txt: { name: string; value: string };
    cname: { name: string; target: string } | null;
  };
}

/** One saved snapshot of the website layout (sections, menu categories, open/closed status). */
export interface SiteVersion {
  id: string;
  createdAt: string;
  createdByName: string | null;
  /** The snapshot guests see now. */
  isCurrent: boolean;
  summary: string;
}

export interface MenuColorField {
  name: MenuColorKey;
  label: string;
}

export type ColourRole =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'textPrimary'
  | 'textSecondary'
  | 'accentText'
  | 'borderColor'
  | 'footerBg'
  | 'sectionBg';

export type ColourSet = Record<ColourRole, string>;

export interface MenuColourTheme {
  id: string;
  name: string;
  colors: ColourSet;
}
