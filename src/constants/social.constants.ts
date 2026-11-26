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
