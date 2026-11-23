import api from './api.service';
import type {
  Award,
  TeamMember,
  SiteEvent,
  Amenity,
  AwardInput,
  TeamMemberInput,
  SiteEventInput,
} from '@/types/admin/site/siteContent.types';

export type {
  Award,
  TeamMember,
  SiteEvent,
  Amenity,
  AwardInput,
  TeamMemberInput,
  SiteEventInput,
};

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
