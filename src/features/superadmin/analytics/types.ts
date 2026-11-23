import type {
  PlatformAnalyticsOverview,
  AnalyticsByUserResponse,
} from '@/types';

export type TabId = 'traffic' | 'demand' | 'dishes' | 'time_tech' | 'tenants';

export interface MetricCardProps {
  title: string;
  value: number;
  sub?: string;
  badge?: string;
  badgeTone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
  highlight?: boolean;
  highlightTone?: 'cyan' | 'emerald';
}

export interface TrafficFunnelTabProps {
  platform: PlatformAnalyticsOverview;
}

export interface SearchDemandTabProps {
  platform: PlatformAnalyticsOverview;
}

export interface TopDishesTabProps {
  platform: PlatformAnalyticsOverview;
}

export interface PeakTimeTechTabProps {
  platform: PlatformAnalyticsOverview;
}

export interface TenantLeaderboardTabProps {
  byUser: AnalyticsByUserResponse;
  tenantSearch: string;
  onSearchChange: (search: string) => void;
  tenantSort: 'events' | 'visitors' | 'conversion';
  onSortChange: (sort: 'events' | 'visitors' | 'conversion') => void;
}
