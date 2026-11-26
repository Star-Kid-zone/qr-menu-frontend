import api from './api.service';
import { ANALYTICS_BASE_URL } from '@/constants/analytics.constants';

import type { DashboardData, VisitorsPage } from '@/types/admin/analytics/analytics.types';

export type { DashboardData };

class AnalyticsService {
  async getDashboard(range: string = '7d'): Promise<DashboardData> {
    const response = await api.get<DashboardData>(ANALYTICS_BASE_URL, {
      params: { range },
    });
    return response.data;
  }

  async getVisitors(page: number = 1, pageSize: number = 20): Promise<VisitorsPage> {
    const response = await api.get<VisitorsPage>(`${ANALYTICS_BASE_URL}/visitors`, {
      params: { page, pageSize },
    });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
