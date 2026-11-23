import type { SocialPlatform } from '@/types/admin/social/social.types';

export const POPULAR_HASHTAGS = [
  '#DailySpecial',
  '#FoodLovers',
  '#ChefSpecial',
  '#FreshFlavor',
  '#WeekendVibes',
  '#SpecialOffer',
  '#LocalEats',
  '#DineWithUs',
] as const;

export const SOCIAL_PLATFORMS_META = [
  {
    id: 'instagram',
    name: 'Instagram',
    subname: 'Reels & Feed',
    capabilities: 'Reels · Feed · Carousels',
    brandColor: '#E1306C',
    gradient: 'from-[#f09433] via-[#dc2743] to-[#bc1888]',
    glowShadow: 'rgba(225, 48, 108, 0.35)',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    subname: 'Page & Videos',
    capabilities: 'Page Posts · Videos · Feed',
    brandColor: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0D65D9]',
    glowShadow: 'rgba(24, 119, 242, 0.35)',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    subname: 'Short Updates & Media',
    capabilities: 'Tweets · 280 chars · Media',
    brandColor: '#FFFFFF',
    gradient: 'from-neutral-800 to-black',
    glowShadow: 'rgba(255, 255, 255, 0.2)',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    subname: 'Professional Network',
    capabilities: 'Articles · Company Feed',
    brandColor: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#004182]',
    glowShadow: 'rgba(10, 102, 194, 0.35)',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    subname: 'Short-form Vertical Reels',
    capabilities: '9:16 Video · Sound',
    brandColor: '#FE2C55',
    gradient: 'from-neutral-950 via-neutral-900 to-black',
    glowShadow: 'rgba(254, 44, 85, 0.35)',
  },
] as const;

export const PLATFORM_META: Record<
  SocialPlatform,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
    maxCaptionLength: number;
    supportsVideo: boolean;
    characterCounter: boolean;
  }
> = {
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
