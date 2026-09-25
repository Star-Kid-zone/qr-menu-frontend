"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { shiftService, type Shift, type ShiftStatus } from "@/services/shift.service";
import { staffService, type StaffMember } from "@/services/staff.service";
import { getApiErrorMessage } from "@/utils/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  PiCalendarCheckBold,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
  PiXBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatTime(value: string): string {
  const [h, m] = value.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}

const STATUS_STYLES: Record<ShiftStatus, string> = {
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  missed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

interface FormState {
  id: string | null;
  staffId: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  roleLabel: string;
  status: ShiftStatus;
  notes: string;
}

function emptyForm(defaultDate: string): FormState {
  return { id: null, staffId: "", shiftDate: defaultDate, startTime: "09:00", endTime: "17:00", roleLabel: "", status: "scheduled", notes: "" };
}

function SchedulePageContent() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission("dashboard");

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(() => emptyForm(toIsoDate(new Date())));
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const from = useMemo(() => toIsoDate(weekStart), [weekStart]);
  const to = useMemo(() => toIsoDate(weekEnd), [weekEnd]);

  const {
    data: shiftsData,
    error: shiftsError,
    refetch: fetchShifts,
  } = useAsyncData(
    async () => (await shiftService.list({ from, to })).data.shifts,
    [from, to],
    "Failed to load the shift schedule.",
  );

  const { data: staffData } = useAsyncData(
    async () => (await staffService.list()).data.staff,
    [],
    "Failed to load staff list.",
  );

  const shifts = useMemo(() => shiftsData ?? [], [shiftsData]);
  const staff = staffData ?? [];

  useEffect(() => {
    if (shiftsError) toast.error(shiftsError);
  }, [shiftsError]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const shiftsByDate = useMemo(() => {
    const map = new Map<string, Shift[]>();
    for (const shift of shifts) {
      const list = map.get(shift.shiftDate) ?? [];
      list.push(shift);
      map.set(shift.shiftDate, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  }, [shifts]);

  const openCreate = (date?: string) => {
    setForm(emptyForm(date ?? from));
    setShowModal(true);
  };

  const openEdit = (shift: Shift) => {
    setForm({
      id: shift.id,
      staffId: shift.staffId,
      shiftDate: shift.shiftDate,
      startTime: shift.startTime.slice(0, 5),
      endTime: shift.endTime.slice(0, 5),
      roleLabel: shift.roleLabel ?? "",
      status: shift.status,
      notes: shift.notes ?? "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.staffId || !form.shiftDate || !form.startTime || !form.endTime) {
      toast.error("Staff member, date, and start/end time are required.");
      return;
    }
    if (form.startTime >= form.endTime) {
      toast.error("Start time must be before end time.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        staffId: form.staffId,
        shiftDate: form.shiftDate,
        startTime: form.startTime,
        endTime: form.endTime,
        roleLabel: form.roleLabel.trim() || null,
        notes: form.notes.trim() || null,
      };
      if (form.id) {
        await shiftService.update(form.id, { ...payload, status: form.status });
        toast.success("Shift updated successfully.");
      } else {
        await shiftService.create(payload);
        toast.success("Shift scheduled.");
      }
      setShowModal(false);
      fetchShifts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save shift."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Schedule"
        description={canManage ? "Plan who's working and when." : "Your upcoming shifts."}
        actions={
          canManage ? (
            <Button onClick={() => openCreate()} size="sm" leftIcon={<PiPlusBold size={14} />}>
              Add Shift
            </Button>
          ) : undefined
        }
      />

      <div className="flex shrink-0 items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
          aria-label="Previous week"
        >
          <PiCaretLeftBold size={14} />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-foreground">
            {weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} –{" "}
            {weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="text-[10px] font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            This week
          </button>
        </div>
        <button
          type="button"
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
          aria-label="Next week"
        >
          <PiCaretRightBold size={14} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {shifts.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiCalendarCheckBold size={32} />}
              title="No shifts scheduled this week"
              description={canManage ? "Add a shift to start building the roster." : "Check back once a manager builds the schedule."}
              action={canManage ? <Button onClick={() => openCreate()} size="sm" leftIcon={<PiPlusBold size={13} />}>Add Shift</Button> : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((day, i) => {
              const iso = toIsoDate(day);
              const dayShifts = shiftsByDate.get(iso) ?? [];
              const isToday = iso === toIsoDate(new Date());
              return (
                <div key={iso} className={cn("rounded-xl border bg-card p-3 shadow-sm", isToday ? "border-primary/40" : "border-border")}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{DAY_LABELS[i]}</p>
                      <p className={cn("text-sm font-bold", isToday ? "text-primary" : "text-foreground")}>{day.getDate()}</p>
                    </div>
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => openCreate(iso)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Add shift on ${iso}`}
                      >
                        <PiPlusBold size={12} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {dayShifts.map((shift) => (
                      <div key={shift.id} className="group rounded-lg border border-border/60 bg-muted/30 p-2">
                        <div className="flex items-start justify-between gap-1">
                          <p className="truncate text-xs font-bold text-foreground">{shift.staffName}</p>
                          {canManage && (
                            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button type="button" onClick={() => openEdit(shift)} aria-label="Edit shift" className="text-muted-foreground hover:text-primary">
                                <PiPencilSimpleBold size={11} />
                              </button>
                              <button type="button" onClick={() => setDeleteTarget(shift)} aria-label="Delete shift" className="text-muted-foreground hover:text-destructive">
                                <PiTrashBold size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                        </p>
                        {shift.roleLabel && <p className="text-[10px] text-muted-foreground">{shift.roleLabel}</p>}
                        <span className={cn("mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide", STATUS_STYLES[shift.status])}>
                          {shift.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{form.id ? "Edit Shift" : "New Shift"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <PiXBold size={15} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Staff Member *</label>
                <Select
                  value={form.staffId}
                  onChange={(e) => setForm({ ...form, staffId: e.target.value })}
                  placeholder="Select staff member"
                  options={staff.map((s: StaffMember) => ({ value: s.id, label: s.name }))}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Date *</label>
                <Input type="date" value={form.shiftDate} onChange={(e) => setForm({ ...form, shiftDate: e.target.value })} className="h-10 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Start Time *</label>
                  <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="h-10 text-xs" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">End Time *</label>
                  <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="h-10 text-xs" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Role Label (optional)</label>
                <Input
                  value={form.roleLabel}
                  onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
                  placeholder="e.g. Kitchen, Front of House"
                  className="h-10 text-xs"
                />
              </div>

              {form.id && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Status</label>
                  <Select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ShiftStatus })}
                    options={[
                      { value: "scheduled", label: "Scheduled" },
                      { value: "completed", label: "Completed" },
                      { value: "missed", label: "Missed" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                    className="h-10 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Notes (optional)</label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any handover notes" className="h-10 text-xs" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSubmit} loading={saving}>
                {form.id ? "Save Changes" : "Schedule Shift"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await shiftService.remove(deleteTarget.id);
        }}
        onSuccess={fetchShifts}
        entityName="shift"
        description={`This will remove ${deleteTarget?.staffName || "this"}'s shift from the schedule.`}
      />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <PermissionGuard requiredUnit="operations">
      <SchedulePageContent />
    </PermissionGuard>
  );
}
