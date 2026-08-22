import { Business } from '@/types';
import api from './api.service';

export const businessService = {
  getBusinesses: () => api.get('/business'),
  getUserBusinesses: () => api.get('/business/user'),
  getBusiness: (id: string | number) => api.get(`/business/${id}`),
  createBusiness: (data: Partial<Business> | FormData) => api.post('/business', data),
  updateBusiness: (id: string | number, data: Partial<Business> | FormData) =>
    api.put(`/business/${id}`, data),
  deleteBusiness: (id: string | number) => api.delete(`/business/${id}`),
  getIndustryFeatures: (industryId: string | number) =>
    api.get(`/industries/${industryId}/features`),
};
