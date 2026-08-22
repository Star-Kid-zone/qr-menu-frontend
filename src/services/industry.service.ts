import { Industry, IndustryCategory, IndustryType } from '@/types';
import api from './api.service';

export const industryService = {
  getIndustries: () => api.get('/industries'),
  getIndustry: (id: number | string) => api.get(`/industries/${id}`),
  createIndustry: (data: Partial<Industry> | FormData) => api.post('/industries', data),

  getCategories: (industryId: number | string) => api.get(`/industries/${industryId}/categories`),
  getCategory: (id: number | string) => api.get(`/industries/categories/${id}`),
  createCategory: (data: Partial<IndustryCategory> | FormData) =>
    api.post('/industries/categories', data),
  updateCategory: (id: number | string, data: Partial<IndustryCategory> | FormData) =>
    api.post(`/industries/categories/${id}`, data),
  deleteCategory: (id: number | string) => api.delete(`/industries/categories/${id}`),

  getTypes: (industryId: number | string) => api.get(`/industries/${industryId}/types`),
  getType: (id: number | string) => api.get(`/industries/types/${id}`),
  createType: (data: Partial<IndustryType> | FormData) => api.post('/industries/types', data),
  updateType: (id: number | string, data: Partial<IndustryType> | FormData) =>
    api.post(`/industries/types/${id}`, data),
  deleteType: (id: number | string) => api.delete(`/industries/types/${id}`),
};

export default industryService;
