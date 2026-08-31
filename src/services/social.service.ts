import api from './api.service';

export type SocialAccount = { id: string; platform: 'facebook' | 'instagram'; displayName: string; username?: string | null; status: string };
export type SocialAsset = { id: string; originalFilename: string; publishingUrl: string; thumbnailUrl?: string | null; mimeType: string; fileSizeBytes: number; createdAt: string };
export type WeeklyPoster = { id: string; weekStart: string; title: string; imageUrl: string; thumbnailUrl?: string | null; originalFilename: string };
export type SocialPost = { id: string; title?: string | null; lifecycleStatus: string; approvalStatus: string; scheduledAtUtc?: string | null; destinations?: Array<{ id: string; socialAccountId: string; caption: string; status: string; lastErrorMessage?: string | null }> };

export const socialService = {
  getAccounts: () => api.get<SocialAccount[]>('/meta/accounts'),
  startOAuth: (platform: 'facebook' | 'instagram') => api.get<{ url: string }>(`/meta/oauth/start?platform=${platform}`),
  disconnect: (id: string) => api.delete(`/meta/accounts/${id}`),
  getAssets: () => api.get<SocialAsset[]>('/meta/assets'),
  getWeeklyPosters: () => api.get<WeeklyPoster[]>('/meta/weekly-posters'),
  createWeeklyPoster: (file: File, title: string, weekStart: string) => { const form = new FormData(); form.append('image', file); form.append('title', title); form.append('weekStart', weekStart); return api.post<{ poster: WeeklyPoster }>('/meta/weekly-posters', form, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  uploadAsset: (file: File, tags = '') => { const form = new FormData(); form.append('image', file); form.append('tags', tags); return api.post<{ asset: SocialAsset }>('/meta/assets/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  getPosts: () => api.get<SocialPost[]>('/meta/posts'),
  createPost: (data: unknown) => api.post<SocialPost>('/meta/posts', data),
  publishNow: (id: string) => api.post(`/meta/posts/${id}/publish-now`),
  schedule: (id: string, scheduledAt: string) => api.post(`/meta/posts/${id}/schedule`, { scheduledAt }),
  cancel: (id: string) => api.post(`/meta/posts/${id}/cancel`),
};
