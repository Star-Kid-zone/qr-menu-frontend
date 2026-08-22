import { Setting } from '@/types';
import api from './api.service';

export const settingService = {
  getSettings: () => api.get('/settings'),
  getUserSettings: () => api.get('/settings/user'),
  getWorkspaceDashboard: () => api.get('/settings/user', { params: { include: 'dashboard' } }),
  getUserSettingsById: (id: string | number) => api.get(`/settings/user/${id}`),
  getUserSettingsBySlug: (slug: string) =>
    api.get(`/settings/user/slug/${encodeURIComponent(slug.trim())}`),
  getSlugAvailability: (slug: string, excludeWorkspaceId?: number) =>
    api.get('/settings/slug-availability', {
      params: {
        slug: slug.trim(),
        ...(excludeWorkspaceId != null ? { excludeWorkspaceId } : {}),
      },
    }),
  createSetting: (data: Partial<Setting>) => api.post('/settings', data),
  updateSetting: (id: string | number, data: Partial<Setting>) => api.put(`/settings/${id}`, data),
  getCurrencies: () => api.get('/workspace/currencies'),
};
