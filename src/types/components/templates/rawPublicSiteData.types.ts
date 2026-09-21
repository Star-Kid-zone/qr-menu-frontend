import type { Menu } from "@/types";

/**
 * Raw API response shape from GET /settings/user/:id and /settings/user/slug/:slug
 * Passed directly to landing templates — no transformation applied.
 */
export type RawPublicSiteData = {
  user_id: number;
  settings: Record<string, unknown>;
  business: Record<string, unknown> | null;
  payment: Record<string, unknown> | null;
  review: Record<string, unknown> | null;
  gallery: Array<{
    id?: number;
    image_url?: string | null;
    image_path?: string | null;
  }>;
  offers: Array<{
    id?: number;
    title?: string;
    description?: string | null;
    badge_text?: string | null;
    offer_value?: string | null;
    offer_type?: string | null;
  }>;
  menuItems: Menu[];
  faqs?: Array<{ id?: number | string; question?: string; answer?: string }>;
  googleReviews?: Array<{
    id: string | number;
    authorName: string;
    authorPhotoUrl: string | null;
    rating: number;
    text: string | null;
    relativePublishDescription: string | null;
    publishTime?: string | null;
  }>;
  currency?: { code?: string; symbol?: string } | null;
  workspace_gallery?: Array<{
    id?: number;
    image_url?: string | null;
    image_path?: string | null;
  }>;
  workspace_offers?: unknown[];
  [key: string]: unknown;
};

/** Runtime callbacks injected by TenantLandingPage — not from the API */
export type LandingTemplateCallbacks = {
  menuHref: string;
  onPay: () => void;
  onReview: () => void;
  track: (
    actionType: string,
    actionTarget?: string,
    metadata?: Record<string, unknown>,
  ) => void;
  LinkComponent: React.ComponentType<{
    to: string;
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
  }>;
};

/** Full prop type received by every landing template */
export type LandingTemplateProps = {
  data: RawPublicSiteData;
  routeSlug: string | null;
  /** Resolved template slug (from TenantLandingPage's getSafeSlug) — used by GenericLandingTemplate to look up its theme. Ignored by bespoke templates. */
  themeSlug?: string;
} & LandingTemplateCallbacks;
