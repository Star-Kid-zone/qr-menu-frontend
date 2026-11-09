import api from './api.service';
import type { StaffRole } from '@/constants/permissions';

export interface StaffMember {
  id: string;
  name: string;
  /** Sign-in identifier. */
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
}

export const staffService = {
  list: () => api.get<{ staff: StaffMember[] }>('/staff'),
  create: (data: { name: string; email: string; password: string; role: StaffRole }) =>
    api.post<{ staff: StaffMember }>('/staff', data),
  update: (
    id: string,
    data: Partial<{ name: string; email: string; role: StaffRole; active: boolean; password: string }>
  ) => api.put<{ staff: StaffMember }>(`/staff/${id}`, data),
  remove: (id: string) => api.delete(`/staff/${id}`),
};
