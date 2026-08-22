import { Menu } from '@/types';
import api from './api.service';

export interface MenuStats {
  total: number;
  byCategory: Array<{ category: string; count: number }>;
  available: number;
  unavailable: number;
  popular: number;
}

export const menuService = {
  getMenus: () => api.get('/menu'),
  getStats: () => api.get<MenuStats>('/menu/stats'),
  getMyMenus: () => api.get('/menu/user'),
  getUserMenus: (id: string | number) => api.get(`/menu/user/${id}`),
  getMenu: (id: string | number) => api.get(`/menu/${id}`),
  createMenu: (data: Partial<Menu> | FormData) =>
    api.post('/menu', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMenu: (id: string | number, data: Partial<Menu> | FormData) =>
    api.patch(`/menu/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMenu: (id: string | number) => api.delete(`/menu/${id}`),
  deleteMenuImage: (id: string | number, data: Record<string, unknown>) =>
    api.delete(`/menu/${id}/image`, { data }),
  deleteMenuVideo: (id: string | number, data: Record<string, unknown>) =>
    api.delete(`/menu/${id}/video`, { data }),
};
