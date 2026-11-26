import type { Industry, IndustryCategory, IndustryType } from '@/types';
import api from './api.service';

export const industryService = {
  getIndustries: () => api.get<Industry[]>('/industries'),
  getIndustry: (id: string) => api.get<Industry>(`/industries/${id}`),
  createIndustry: (data: Partial<Industry> | FormData) => api.post<Industry>('/industries', data),

  getCategories: (industryId: string) => api.get<IndustryCategory[]>(`/industries/${industryId}/categories`),
  getCategory: (id: string) => api.get<IndustryCategory>(`/industries/categories/${id}`),
  createCategory: (data: Partial<IndustryCategory> | FormData) =>
    api.post<IndustryCategory>('/industries/categories', data),
  updateCategory: (id: string, data: Partial<IndustryCategory> | FormData) =>
    api.post<IndustryCategory>(`/industries/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete<unknown>(`/industries/categories/${id}`),

  getTypes: (industryId: string) => api.get<IndustryType[]>(`/industries/${industryId}/types`),
  getType: (id: string) => api.get<IndustryType>(`/industries/types/${id}`),
  createType: (data: Partial<IndustryType> | FormData) => api.post<IndustryType>('/industries/types', data),
  updateType: (id: string, data: Partial<IndustryType> | FormData) =>
    api.post<IndustryType>(`/industries/types/${id}`, data),
  deleteType: (id: string) => api.delete<unknown>(`/industries/types/${id}`),
};

export default industryService;
