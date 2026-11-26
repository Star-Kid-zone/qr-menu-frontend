import api from './api.service';
import type { PlatformMarketingAsset } from '@/types';

import type { SocialPlatform, SocialAccount, SocialAsset, WeeklyPoster, SocialPost, CreatePostInput } from '@/types/admin/social/social.types';

export type { SocialPlatform, SocialAccount, SocialAsset, WeeklyPoster, SocialPost, CreatePostInput };

export const socialService = {
  // ─── OAuth ──────────────────────────────────────────────────────────────────
  startOAuth: (platform: SocialPlatform) =>
    api.get<{ url: string }>(`/meta/oauth/start?platform=${platform}`),

  // ─── Accounts ───────────────────────────────────────────────────────────────
  getAccounts: () => api.get<SocialAccount[]>('/meta/accounts'),
  checkAccount: (id: string) => api.post<unknown>(`/meta/accounts/${id}/check`),
  disconnect: (id: string) => api.delete<unknown>(`/meta/accounts/${id}`),

  // ─── Assets ─────────────────────────────────────────────────────────────────
  getAssets: () => api.get<SocialAsset[]>('/meta/assets'),

  /** Upload an image OR video asset */
  uploadAsset: (file: File, tags = '') => {
    const form = new FormData();
    form.append('media', file);          // ← key changed from 'image' to 'media'
    form.append('tags', tags);
    return api.post<{ asset: SocialAsset }>('/meta/assets/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAsset: (id: string) => api.delete<unknown>(`/meta/assets/${id}`),

  // ─── Weekly posters ──────────────────────────────────────────────────────────
  getWeeklyPosters: () => api.get<WeeklyPoster[]>('/meta/weekly-posters'),
  createWeeklyPoster: (file: File, title: string, weekStart: string) => {
    const form = new FormData();
    form.append('image', file);
    form.append('title', title);
    form.append('weekStart', weekStart);
    return api.post<{ poster: WeeklyPoster }>('/meta/weekly-posters', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ─── Posts ───────────────────────────────────────────────────────────────────
  getPosts: () => api.get<SocialPost[]>('/meta/posts'),
  getPost: (id: string) => api.get<SocialPost>(`/meta/posts/${id}`),

  /**
   * Create a post with per-platform captions and optional recurrence.
   */
  createPost: (data: CreatePostInput) => api.post<SocialPost>('/meta/posts', data),

  publishNow: (id: string) => api.post<unknown>(`/meta/posts/${id}/publish-now`),
  schedule: (id: string, scheduledAt: string) =>
    api.post(`/meta/posts/${id}/schedule`, { scheduledAt }),
  submitApproval: (id: string) => api.post<unknown>(`/meta/posts/${id}/submit-approval`),
  cancel: (id: string) => api.post<unknown>(`/meta/posts/${id}/cancel`),
  retry: (id: string) => api.post<unknown>(`/meta/posts/${id}/retry`),
  getPostResults: (id: string) => api.get(`/meta/posts/${id}/results`),

  // ─── Recurring series ────────────────────────────────────────────────────────
  cancelRecurringSeries: (rootPostId: string) =>
    api.delete<unknown>(`/meta/posts/${rootPostId}/recurring-series`),

  // ─── Calendar ────────────────────────────────────────────────────────────────
  getCalendar: () => api.get<SocialPost[]>('/meta/calendar'),

  // ─── Platform Distributed Assets ─────────────────────────────────────────────
  getPlatformAssets: () => api.get<{ data: PlatformMarketingAsset[] }>('/meta/platform-assets'),
};

// ─── Platform metadata ─────────────────────────────────────────────────────────

import { PLATFORM_META } from '@/constants/social.constants';

export { PLATFORM_META };

/** Days until a token expires (null if no expiry stored) */
export function tokenDaysLeft(account: SocialAccount): number | null {
  if (!account.tokenExpiresAt) return null;
  const ms = new Date(account.tokenExpiresAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Status badge info based on account status + expiry */
export function tokenStatusBadge(account: SocialAccount): { label: string; color: string } {
  if (account.status === 'expired') return { label: 'Expired', color: '#dc2626' };
  if (account.status === 'error') return { label: 'Error', color: '#dc2626' };
  if (account.status === 'revoked') return { label: 'Revoked', color: '#6b7280' };
  const days = tokenDaysLeft(account);
  if (days !== null && days <= 7) return { label: `Expires in ${days}d`, color: '#f59e0b' };
  return { label: 'Connected', color: '#16a34a' };
}
