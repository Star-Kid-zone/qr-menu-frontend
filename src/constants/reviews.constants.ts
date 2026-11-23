import type { AutoReplyToneOption } from '@/types';

export type { AutoReplyToneOption };

export const LOW_RATING_MAX = 3;

export const AUTO_REPLY_TONE_OPTIONS: AutoReplyToneOption[] = [
  { id: 'warm_professional', label: 'Warm & Professional', icon: '✨' },
  { id: 'friendly', label: 'Friendly & Casual', icon: '👋' },
  { id: 'enthusiastic', label: 'Enthusiastic & Grateful', icon: '🎉' },
  { id: 'concise', label: 'Concise & Direct', icon: '🎯' },
];

export const REVIEW_FILTER_CHIPS = [
  { id: 'needs_reply', label: 'Needs reply' },
  { id: 'low', label: 'Low ratings' },
  { id: 'featured', label: 'On website' },
  { id: 'all', label: 'All' },
] as const;

export const REVIEW_SORT_OPTIONS = [
  { id: 'urgent', label: 'Most urgent' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'highest', label: 'Highest rating' },
  { id: 'lowest', label: 'Lowest rating' },
] as const;

export const ADD_REVIEW_STEPS = [
  { id: 'find', label: 'Find' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'import', label: 'Import' },
] as const;
