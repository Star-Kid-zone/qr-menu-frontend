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
export { DAY_LABELS, STATUS_STYLES } from '@/constants/schedule.constants';
export {
  toIsoDate,
  startOfWeek,
  addDays,
  formatTime,
  emptyForm,
} from './schedule.utils';
