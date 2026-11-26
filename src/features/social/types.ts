import type { SocialAsset, SocialPost, WeeklyPoster, PlatformMarketingAsset } from '@/types';

export type SocialTabId = 'compose' | 'library' | 'history' | 'accounts';
export type LibraryFilter = 'all' | 'platform' | 'uploads' | 'videos' | 'weekly';
export type HistoryFilter = 'all' | 'published' | 'scheduled' | 'draft';
export type RecurrenceRule = 'daily' | 'weekly' | 'biweekly' | 'monthly' | '';

export interface ActivePosterInfo {
  url?: string;
  title: string;
  isVideo: boolean;
  type: 'upload' | 'weekly' | 'platform';
  aspectRatio?: string;
  badge?: string;
}

export type { SocialAsset, SocialPost, WeeklyPoster, PlatformMarketingAsset };
