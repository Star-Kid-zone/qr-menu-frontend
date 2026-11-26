type AnalyticsActionType = 'visit' | 'click' | 'view' | 'navigation' | 'search';

export type AnalyticsTabId = 'traffic' | 'demand' | 'dishes' | 'time_tech' | 'tenants';

export interface AnalyticsEvent {
  fingerprint: string;
  visitor_id: string;
  user_id?: string;
  business_id?: string;
  action_type: AnalyticsActionType;
  action_target?: string;
  /** Set when tracking a click/view on a specific dish. */
  menu_item_id?: string;
  /** Set when tracking a guest search query. */
  search_query?: string;
  metadata?: Record<string, unknown>;
  page_url?: string;
  timestamp?: number;
}

export interface DashboardData {
  summary: {
    totalVisits: number;
    totalClicks: number;
    totalSearches: number;
    uniqueVisitors: number;
    popularItem: string;
  };
  today: {
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
    visits: number;
    clicks: number;
    searches: number;
    events: number;
  };
  visitorTrend: Array<{ date: string; newVisitors: number; returningVisitors: number }>;
  zeroResultSearches: Array<{ query: string; count: number }>;
  visitHistory: Array<{ date: string; count: number }>;
  clickBreakdown: Record<string, number>;
  topMenuItems: Array<{
    menuItemId: string;
    item: string;
    imageUrl: string | null;
    price: string;
    count: number;
  }>;
  topSearches: Array<{ query: string; count: number }>;
  /** How guests arrived — 'direct' when no UTM param or cross-site referrer was captured. */
  acquisition: Array<{ source: string; count: number }>;
  /** Totals for the period just before the selected one. Null for "all time". */
  previous?: { visits: number; visitors: number; clicks: number; searches: number } | null;
  /** Visits per hour of day (0-23), server-local time. */
  visitsByHour?: Array<{ hour: number; count: number }>;
}

interface VisitorRow {
  visitorId: string;
  fingerprint: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  firstSeen: string;
  lastSeen: string;
  totalEvents: number;
  visits: number;
  clicks: number;
  searches: number;
}

export interface VisitorsPage {
  visitors: VisitorRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AnalyticsDerivedMetrics {
  conversionRate: string;
  avgDailyVisits: number;
  peakDay: string;
  peakCount: number;
  totalClickSum: number;
}

export interface Insight {
  id: string;
  text: string;
  href?: string;
  cta?: string;
}

