import api from './api.service';

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  displayName: string;
  username?: string | null;
  profileImageUrl?: string | null;
  status: 'connected' | 'expired' | 'revoked' | 'error';
  tokenExpiresAt?: string | null;
  tokenRefreshedAt?: string | null;
};

export type SocialAsset = {
  id: string;
  originalFilename: string;
  publishingUrl: string;
  thumbnailUrl?: string | null;
  mimeType: string;
  mediaType: 'image' | 'video' | 'reel' | 'short';
  fileSizeBytes: number;
  createdAt: string;
};

export type WeeklyPoster = {
  id: string;
  weekStart: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  originalFilename: string;
};

export type PostDestinationInput = {
  accountId: string;
  caption: string;
  linkUrl?: string | null;
  platformOptions?: {
    firstComment?: string;
    altText?: string;
    replySettings?: 'everyone' | 'mentionedUsers' | 'subscribers';
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    shareToFeed?: boolean;
  } | null;
};

export type SocialPost = {
  id: string;
  title?: string | null;
  lifecycleStatus: string;
  approvalStatus: string;
  scheduledAtUtc?: string | null;
  recurrenceRule?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  recurrenceEndDate?: string | null;
  parentPostId?: string | null;
  destinations?: Array<{
    id: string;
    socialAccountId: string;
    caption: string;
    status: string;
    permalink?: string | null;
    externalPostId?: string | null;
    publishedAt?: string | null;
    lastErrorMessage?: string | null;
    platformOptionsJson?: Record<string, any> | null;
  }>;
};

export type CreatePostInput = {
  assetId?: string;
  weeklyPosterId?: string;
  title?: string;
  displayTimezone?: string;
  scheduledAt?: string;
  recurrenceRule?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  recurrenceEndDate?: string | null;
  destinations: PostDestinationInput[];
};

export const socialService = {
  // ─── OAuth ──────────────────────────────────────────────────────────────────
  startOAuth: (platform: SocialPlatform) =>
    api.get<{ url: string }>(`/meta/oauth/start?platform=${platform}`),

  // ─── Accounts ───────────────────────────────────────────────────────────────
  getAccounts: () => api.get<SocialAccount[]>('/meta/accounts'),
  checkAccount: (id: string) => api.post(`/meta/accounts/${id}/check`),
  disconnect: (id: string) => api.delete(`/meta/accounts/${id}`),

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

  deleteAsset: (id: string) => api.delete(`/meta/assets/${id}`),

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

  publishNow: (id: string) => api.post(`/meta/posts/${id}/publish-now`),
  schedule: (id: string, scheduledAt: string) =>
    api.post(`/meta/posts/${id}/schedule`, { scheduledAt }),
  submitApproval: (id: string) => api.post(`/meta/posts/${id}/submit-approval`),
  cancel: (id: string) => api.post(`/meta/posts/${id}/cancel`),
  retry: (id: string) => api.post(`/meta/posts/${id}/retry`),
  getPostResults: (id: string) => api.get(`/meta/posts/${id}/results`),

  // ─── Recurring series ────────────────────────────────────────────────────────
  cancelRecurringSeries: (rootPostId: string) =>
    api.delete(`/meta/posts/${rootPostId}/recurring-series`),

  // ─── Calendar ────────────────────────────────────────────────────────────────
  getCalendar: () => api.get<SocialPost[]>('/meta/calendar'),
};

// ─── Platform metadata ─────────────────────────────────────────────────────────

export const PLATFORM_META: Record<SocialPlatform, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  maxCaptionLength: number;
  supportsVideo: boolean;
  characterCounter: boolean;
}> = {
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    bgColor: '#E7F3FF',
    icon: 'F',
    maxCaptionLength: 63206,
    supportsVideo: true,
    characterCounter: false,
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    bgColor: '#FFEEF4',
    icon: 'IG',
    maxCaptionLength: 2200,
    supportsVideo: true,
    characterCounter: true,
  },
  twitter: {
    label: 'Twitter / X',
    color: '#000000',
    bgColor: '#F0F0F0',
    icon: 'X',
    maxCaptionLength: 280,
    supportsVideo: true,
    characterCounter: true,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    bgColor: '#E8F0FB',
    icon: 'in',
    maxCaptionLength: 3000,
    supportsVideo: false,
    characterCounter: true,
  },
  tiktok: {
    label: 'TikTok',
    color: '#FF0050',
    bgColor: '#FFF0F5',
    icon: 'TT',
    maxCaptionLength: 2200,
    supportsVideo: true,
    characterCounter: false,
  },
};

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
