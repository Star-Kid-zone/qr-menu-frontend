import api from './api.service';
import type { StaffRole } from '@/constants/permissions';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
}

export const staffService = {
  list: () => api.get<{ staff: StaffMember[] }>('/staff'),
  create: (data: { name: string; phone: string; password: string; role: StaffRole }) =>
    api.post<{ staff: StaffMember }>('/staff', data),
  update: (
    id: string,
    data: Partial<{ name: string; role: StaffRole; active: boolean; password: string }>
  ) => api.put<{ staff: StaffMember }>(`/staff/${id}`, data),
  remove: (id: string) => api.delete(`/staff/${id}`),
};
