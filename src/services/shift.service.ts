import api from './api.service';

export type ShiftStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  roleLabel: string | null;
  status: ShiftStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftInput {
  staffId: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  roleLabel?: string | null;
  notes?: string | null;
}

export const shiftService = {
  list: (params?: { from?: string; to?: string; staffId?: string }) =>
    api.get<{ shifts: Shift[] }>('/shifts', { params }),
  create: (data: CreateShiftInput) => api.post<{ shift: Shift }>('/shifts', data),
  update: (id: string, data: Partial<CreateShiftInput & { status: ShiftStatus }>) =>
    api.put<{ shift: Shift }>(`/shifts/${id}`, data),
  remove: (id: string) => api.delete(`/shifts/${id}`),
};
