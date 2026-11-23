import type { AmenityId } from '@/components/site-system/types';

/**
 * Owner-managed guest-site content (docs/site-system/PLAN.md §2.9):
 * awards & press, team, events, amenities. Backed by /workspace/{awards,team,events,amenities}.
 */

export interface Award {
  id: string;
  title: string;
  publisher: string | null;
  year: number | null;
  url: string | null;
  logoUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  photoUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export interface SiteEvent {
  id: string;
  title: string;
  description: string | null;
  /** ISO date-time with offset. */
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
}

export interface Amenity {
  id: AmenityId;
  note?: string;
}

/** Fields an owner can send; '' clears an optional link. */
export type AwardInput = Partial<Omit<Award, 'id'>> & { title?: string };
export type TeamMemberInput = Partial<Omit<TeamMember, 'id'>>;
export type SiteEventInput = Partial<Omit<SiteEvent, 'id'>>;

export type WebsiteSectionTabId =
  | 'workspace'
  | 'businesses'
  | 'public-site'
  | 'banners'
  | 'offers'
  | 'gallery'
  | 'content'
  | 'faqs'
  | 'reviews';

export interface WebsiteSectionItem {
  id: string;
  label: string;
  tabs: WebsiteSectionTabId[];
}
