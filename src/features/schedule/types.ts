import type { ShiftStatus } from '@/types';

export interface FormState {
  id: string | null;
  staffId: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  roleLabel: string;
  status: ShiftStatus;
  notes: string;
}

// Re-exports for backwards compatibility
