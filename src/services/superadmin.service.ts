import api from './api.service';
import type { DashboardData } from './analytics.service';

export type DateRange = 'today' | 'last_7_days' | 'last_30_days' | 'last_90_days';

export interface PlatformOverview {
  range: string;
  period: { start: string; end: string };
  users: {
    total: number;
    active: number;
    by_role: { admin: number; superadmin: number };
  };
  workspaces: { total: number; with_public_slug: number };
  businesses: { total: number; active: number };
  menus: { total: number };
  analytics_in_period: {
    total_events: number;
    distinct_visitors: number;
  };
}

export interface UserListRow {
  id: number;
  phone: string;
  name: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  workspace_count: number;
  business_count: number;
  menu_count: number;
}

export interface UsersListResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  users: UserListRow[];
}

export interface UserDetailResponse {
  user: Record<string, unknown>;
  workspaces: Array<Record<string, unknown> & { public_site_url?: string | null }>;
  businesses: Record<string, unknown>[];
  counts: {
    menus: number;
    reviews: number;
    payments: number;
    analytics_events: number;
  };
}

export interface PlatformAnalyticsOverview {
  range: string;
  period: { start: string; end: string };
  total_visitors: number;
  total_views: number;
  total_clicks: number;
  total_events: number;
  visitors_over_time: Array<{ date: string; visitors: number; events: number }>;
  action_distribution: Array<{ name: string; value: number }>;
}

export interface AnalyticsByUserResponse {
  range: string;
  period: { start: string; end: string };
  tenants: Array<{
    user_id: number;
    name: string;
    phone: string;
    total_events: number;
    unique_visitors: number;
  }>;
}

async function unwrap<T>(p: Promise<{ data: { data: T } }>): Promise<T> {
  const res = await p;
  return res.data.data;
}

export const superadminService = {
  getOverview(range?: DateRange) {
    return unwrap<PlatformOverview>(api.get('/superadmin/overview', { params: { range } }));
  },

  listUsers(params: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: 'admin' | 'superadmin';
    active?: boolean;
  }) {
    return unwrap<UsersListResponse>(api.get('/superadmin/users', { params }));
  },

  getUser(id: number) {
    return unwrap<UserDetailResponse>(api.get(`/superadmin/users/${id}`));
  },

  getPlatformAnalytics(range?: DateRange) {
    return unwrap<PlatformAnalyticsOverview>(api.get('/superadmin/analytics/overview', { params: { range } }));
  },

  getAnalyticsByUser(range?: DateRange, limit?: number) {
    return unwrap<AnalyticsByUserResponse>(
      api.get('/superadmin/analytics/by-user', { params: { range, limit } })
    );
  },

  getTenantAnalytics(userId: number, range?: DateRange) {
    return unwrap<DashboardData>(
      api.get(`/superadmin/analytics/tenants/${userId}`, { params: { range } })
    );
  },
};
