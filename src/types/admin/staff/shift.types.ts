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
