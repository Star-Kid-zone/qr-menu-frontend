export type RangeKey = '7d' | '30d' | 'all';

export interface StatCardItem {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
  /** Change vs the previous period. Absent when there is nothing to compare. */
  delta?: { pct: number; label: string } | null;
}
