import type { ShiftStatus } from '@/types/admin/staff/shift.types';

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const STATUS_STYLES: Record<ShiftStatus, string> = {
  scheduled: 'bg-primary/10 text-primary',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  missed: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

export const CHECKLIST_TABS = [
  { id: 'today', label: 'Today' },
  { id: 'templates', label: 'Edit checklists' },
] as const;

export const DAY_TO_SCHEMA_CODE: Record<string, string> = {
  monday: 'Mo',
  tuesday: 'Tu',
  wednesday: 'We',
  thursday: 'Th',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'Su',
  mon: 'Mo',
  tue: 'Tu',
  wed: 'We',
  thu: 'Th',
  fri: 'Fr',
  sat: 'Sa',
  sun: 'Su',
};
