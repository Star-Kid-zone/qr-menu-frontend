import type { Menu, MenuStats, MenuImportRow, MenuImportPreviewResult, MenuItemDetail } from '@/types/admin/menu/menu.types';
import api from './api.service';

export type { MenuStats, MenuImportRow, MenuImportPreviewResult };

export const menuService = {
  getMenus: () => api.get('/menu'),
  getStats: () => api.get<MenuStats>('/menu/stats'),
  getMyMenus: () => api.get<Menu[]>('/menu/user'),
  getUserMenus: (id: string) => api.get<Menu[]>(`/menu/user/${id}`),
  getMenu: (id: string) => api.get<MenuItemDetail>(`/menu/${id}`),
  createMenu: (data: Partial<Menu> | FormData) =>
    api.post<Menu>('/menu', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMenu: (id: string, data: Partial<Menu> | FormData) =>
    api.patch<Menu>(`/menu/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMenu: (id: string) => api.delete<unknown>(`/menu/${id}`),
  deleteMenuImage: (id: string, data: Record<string, unknown>) =>
    api.delete<unknown>(`/menu/${id}/image`, { data }),
  deleteMenuVideo: (id: string, data: Record<string, unknown>) =>
    api.delete<unknown>(`/menu/${id}/video`, { data }),

  /** 1-tap sold-out toggle — flips availability; the backend auto-schedules revival at end of business day when marking sold out. */
  toggleAvailability: (id: string) => api.patch<Menu>(`/menu/${id}/toggle-availability`),

  /** One request, scoped to the caller's own dishes. Note: `availability` here does not set the sold-out revival schedule, so use toggleAvailability for that. */
  bulkUpdate: (itemIds: (string | number)[], update: { category?: string; popular?: boolean }) =>
    api.patch<{ count: number }>('/menu/bulk', { itemIds, update }),

  /** Deletes many dishes (and their media) in one request, scoped to the caller's own dishes. Max 200 ids per call. */
  bulkDelete: (itemIds: (string | number)[]) =>
    api.delete<{ count: number }>('/menu/bulk', { data: { itemIds } }),

  bulkPriceAdjust: (payload: { itemIds?: (string | number)[]; category?: string; percent?: number; delta?: number; roundTo?: number }) =>
    api.patch<{ message: string; count: number }>('/menu/bulk-price-adjust', payload),

  /** Uploads a CSV for review — no DB write happens until importCommit is called with the reviewed rows. */
  importPreview: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<MenuImportPreviewResult>('/menu/import/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  importCommit: (items: MenuImportRow[]) =>
    api.post<{ message: string; count: number }>('/menu/import/commit', { items }),
};
