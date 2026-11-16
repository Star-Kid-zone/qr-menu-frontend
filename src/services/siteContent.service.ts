import api from './api.service';
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

export const siteContentService = {
  listAwards: () => api.get<Award[]>('/workspace/awards'),
  createAward: (data: AwardInput & { title: string }) => api.post<Award>('/workspace/awards', data),
  updateAward: (id: string, data: AwardInput) => api.put<Award>(`/workspace/awards/${id}`, data),
  removeAward: (id: string) => api.delete<{ removed: boolean }>(`/workspace/awards/${id}`),

  listTeam: () => api.get<TeamMember[]>('/workspace/team'),
  createTeamMember: (data: TeamMemberInput & { name: string }) => api.post<TeamMember>('/workspace/team', data),
  updateTeamMember: (id: string, data: TeamMemberInput) => api.put<TeamMember>(`/workspace/team/${id}`, data),
  removeTeamMember: (id: string) => api.delete<{ removed: boolean }>(`/workspace/team/${id}`),

  listEvents: () => api.get<SiteEvent[]>('/workspace/events'),
  createEvent: (data: SiteEventInput & { title: string; startsAt: string }) => api.post<SiteEvent>('/workspace/events', data),
  updateEvent: (id: string, data: SiteEventInput) => api.put<SiteEvent>(`/workspace/events/${id}`, data),
  removeEvent: (id: string) => api.delete<{ removed: boolean }>(`/workspace/events/${id}`),

  getAmenities: () => api.get<Amenity[]>('/workspace/amenities'),
  setAmenities: (amenities: Amenity[]) => api.put<Amenity[]>('/workspace/amenities', { amenities }),

  /** Superadmin corrections to the occasion date table ("id:year" → window), read-only. */
  /** Superadmin wording for occasion packs (suggested banner / specials category), read-only. */
  getOccasionPacks: () => api.get<Record<string, { banner?: string; specialsCategory?: string }>>('/workspace/occasion-packs'),
};
