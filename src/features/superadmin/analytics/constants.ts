import type { TabId } from './types';

export const TAB_OPTIONS: Array<{ id: TabId; label: string }> = [
  { id: 'traffic', label: 'Traffic & Funnel' },
  { id: 'demand', label: 'Search & Demand Gaps' },
  { id: 'dishes', label: 'Top Dishes' },
  { id: 'time_tech', label: 'Peak Times & Tech' },
  { id: 'tenants', label: 'Tenant Leaderboard' },
];

export const DONUT_COLORS = [
  '#06b6d4', // Teal/Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
];
