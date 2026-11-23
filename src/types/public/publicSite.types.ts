import type { Menu } from '@/types/admin/menu/menu.types';
import type { MappedPublicUserDetails } from './templates/mapPublicUserDetails.types';
import type { PublicAward, PublicTeamMember, PublicSiteEvent } from '@/components/site-system/types';

export type PublicMenuPayload = {
  mapped: MappedPublicUserDetails;
  menuItems: Menu[];
  routeSlug: string;
};

export interface PublicSitemapSlug {
  slug: string;
  updatedAt: string;
}

export interface TenantMetadataInput {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  imageUrl?: string | null;
}

export type PortalMenuItem = {
  id: string | number;
  item: string;
  description?: string | null;
  price?: string | number | null;
  type?: string | null;
  popular?: boolean;
  imageUrl?: string | null;
  images?: unknown;
  videos?: unknown;
  dietaryTags?: unknown;
  allergens?: unknown;
  spiceLevel?: unknown;
  calories?: unknown;
  attributes?: unknown;
  priceOptions?: unknown;
};

export type PortalResponse = {
  portalInfo: Record<string, unknown> & {
    payment?: { type?: string; link?: string; qrImage?: string } | null;
  };
  menu?: Record<string, PortalMenuItem[]> | null;
  gallery?: Array<{ id?: string | number; imageUrl?: string | null }> | null;
  offers?: Array<{
    id?: string | number;
    title?: string;
    description?: string | null;
    discount?: string | null;
    imageUrl?: string | null;
  }> | null;
  faqs?: Array<{ id?: string | number; question?: string; answer?: string }> | null;
  googleReviews?: Array<{
    id: string | number;
    authorName: string;
    authorPhotoUrl?: string | null;
    rating: number;
    text?: string | null;
    relativePublishDescription?: string | null;
    publishTime?: string | null;
  }> | null;
  awards?: PublicAward[] | null;
  team?: PublicTeamMember[] | null;
  events?: PublicSiteEvent[] | null;
};
