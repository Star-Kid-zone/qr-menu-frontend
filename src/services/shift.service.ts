import api from './api.service';
import type { ShiftStatus, Shift, CreateShiftInput } from '@/types/admin/staff/shift.types';

export type { ShiftStatus, Shift, CreateShiftInput };

export const shiftService = {
  list: (params?: { from?: string; to?: string; staffId?: string }) =>
    api.get<{ shifts: Shift[] }>('/shifts', { params }),
  create: (data: CreateShiftInput) => api.post<{ shift: Shift }>('/shifts', data),
  update: (id: string, data: Partial<CreateShiftInput & { status: ShiftStatus }>) =>
    api.put<{ shift: Shift }>(`/shifts/${id}`, data),
  remove: (id: string) => api.delete(`/shifts/${id}`),
};
