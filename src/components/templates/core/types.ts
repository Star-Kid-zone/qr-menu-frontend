import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Menu } from '@/types';
import type { SocialLink } from '@/types';
import type { AnalyticsEvent } from '@/services/analytics.service';
import type { SiteLook } from '@/components/site-system/types';

export type PublicTrackFn = (
  actionType: AnalyticsEvent['action_type'],
  actionTarget?: string,
  metadata?: Record<string, unknown>,
  extras?: { menuItemId?: number; searchQuery?: string }
) => void;

/** Router `Link` shape so templates stay testable without importing the router in every file. */
export type PublicLink = ComponentType<{
  to: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}>;

export type GalleryItem = {
  id?: number;
  image_url?: string | null;
  image_path?: string | null;
};

export type OfferRow = {
  id?: number;
  title?: string;
  description?: string | null;
  badge_text?: string | null;
  offer_value?: string | null;
  offer_type?: string | null;
};

/** Branch row — mirrors workspace `businesses[]` / list-business. */
export type PublicBusinessBranch = {
  id?: number;
  business_name: string;
  phone?: string;
  address?: string;
  active?: boolean;
};

export type PublicLandingTemplateProps = {
  businessName: string;
  phone: string;
  address: string;
  websiteUrl: string;
  websiteHref: string;
  social: Array<{ url?: string; name?: string; platform?: string }>;
  announcement: string | null;
  primary: string;
  secondary: string;
  accent: string;
  menuBtn: boolean;
  payBtn: boolean;
  reviewBtn: boolean;
  paymentLink: string;
  reviewLink: string;
  offersOn: boolean;
  offers: OfferRow[];
  gallery: GalleryItem[];
  menuHref: string;
  onPay: () => void;
  onReview: () => void;
  track: PublicTrackFn;
  LinkComponent: PublicLink;
  /** Multiple locations (workspace businesses) — optional directory blocks in some templates. */
  branches?: PublicBusinessBranch[];
  /** Lines from `about_features` industry blocks. */
  aboutHighlights?: string[];
  /** Workspace palette alias e.g. `ember-glow`. */
  themeColour?: string | null;
  /** Workspace id — for analytics. */
  workspaceId?: number | null;
  [key: string]: unknown;
};

export type PublicMenuTemplateProps = {
  businessName: string;
  businessHours?: string;
  phone?: string;
  whatsappNumber?: string;
  locationUrl?: string;
  socialLinks: SocialLink[];
  /** Legacy alias used by some menu templates. */
  social?: SocialLink[];
  primary: string;
  secondary: string;
  accent: string;
  grouped: [string, Menu[]][];
  currencySymbol: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  /** All unique categories derived from menu items */
  allCategories: string[];
  /** All unique types derived from menu items */
  allTypes: string[];
  /** Whether any items are marked popular (false when the owner turned filters off) */
  hasPopular: boolean;
  /** Show the search box (owner can turn it off in the menu Sections panel). */
  showSearch: boolean;
  /** Categories to offer as filter chips — empty when the owner turned filters off. Navigation (tabs/sidebars) uses allCategories. */
  filterCategories: string[];
  /** Active category filter — null means all */
  activeCategory: string | null;
  setActiveCategory: (c: string | null) => void;
  /** Active type filter — null means all */
  activeType: string | null;
  setActiveType: (t: string | null) => void;
  /** When true, only popular items are shown */
  popularOnly: boolean;
  setPopularOnly: (v: boolean) => void;
  /** All dietary tags present on at least one item (e.g. 'vegetarian') */
  allDietaryTags: string[];
  /** Active dietary-tag filter — null means all */
  activeDietaryTag: string | null;
  setActiveDietaryTag: (tag: string | null) => void;
  /** Currently open item-detail modal, if any. */
  selectedItem: Menu | null;
  openItem: (item: Menu) => void;
  closeItem: () => void;
  landingHref: string;
  payBtn: boolean;
  paymentLink: string;
  onPay: () => void;
  track: PublicTrackFn;
  LinkComponent: PublicLink;
  gallery: GalleryItem[];
  workspaceId?: number | null;
  offers?: OfferRow[];
  offersOn?: boolean;
  /** Workspace typography / extended colors — used to override menu template defaults */
  fontFamily?: string;
  cardStyle?: string;
  heroOverlay?: string;
  textPrimary?: string;
  textSecondary?: string;
  accentText?: string;
  borderColor?: string;
  footerBg?: string;
  sectionBg?: string;
  address?: string;
  announcement?: string | null;
  /** The resolved site look for the menu page (skin + owner menu colours, business type). */
  look?: SiteLook;
  [key: string]: unknown;
};
