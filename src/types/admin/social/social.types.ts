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
    platformOptionsJson?: Record<string, unknown> | null;
  }>;
};

export type CreatePostInput = {
  assetId?: string;
  weeklyPosterId?: string;
  platformAssetId?: string;
  title?: string;
  displayTimezone?: string;
  scheduledAt?: string;
  recurrenceRule?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;
  recurrenceEndDate?: string | null;
  destinations: PostDestinationInput[];
};
