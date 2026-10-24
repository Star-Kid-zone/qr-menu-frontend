import { type ShiftStatus } from "@/services/shift.service";

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatTime(value: string): string {
  const [h, m] = value.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}

export const STATUS_STYLES: Record<ShiftStatus, string> = {
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  missed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

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

export function emptyForm(defaultDate: string): FormState {
  return {
    id: null,
    staffId: "",
    shiftDate: defaultDate,
    startTime: "09:00",
    endTime: "17:00",
    roleLabel: "",
    status: "scheduled",
    notes: "",
  };
}
