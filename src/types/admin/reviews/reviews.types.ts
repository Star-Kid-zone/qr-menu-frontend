export type { GoogleReviewRecord } from '../workspace/workspace.types';

export interface AutoReplyToneOption {
  id: string;
  label: string;
  icon: string;
}

export type ReviewFilterStatus = 'all' | 'unreplied' | 'replied' | 'flagged';
export type ReviewSortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
