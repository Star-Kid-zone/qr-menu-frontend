"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { shiftService, type Shift } from "@/services/shift.service";
import { staffService } from "@/services/staff.service";
import { getApiErrorMessage } from "@/utils/errors";
import { formatDate } from "@/utils/date";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  PiCalendarCheckBold,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiPlusBold,
} from "react-icons/pi";
import {
  addDays,
  emptyForm,
  startOfWeek,
  toIsoDate,
  type FormState,
} from "../types";
import { DayColumn } from "./DayColumn";
import { ShiftModal } from "./ShiftModal";

function SchedulePageContent() {
  const { ready, hasPermission, isStaff } = usePermissions();
  // Owners and managers build the roster; floor staff only see their shifts.
  const canManage = ready && hasPermission("dashboard");

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
    "Failed to load the shift schedule."
  );

  // Only roster builders need the team list (floor staff can't read it).
  const {
    data: staffData,
    error: staffError,
    loading: staffLoading,
    refetch: refetchStaff,
  } = useAsyncData(
    async () => (canManage ? (await staffService.list()).data.staff : []),
    [canManage],
    "Check your connection and try again."
  );

  const shifts = useMemo(() => shiftsData ?? [], [shiftsData]);
  const staff = staffData ?? [];

  useEffect(() => {
    if (shiftsError) toast.error(shiftsError);
  }, [shiftsError]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const shiftsByDate = useMemo(() => {
    const map = new Map<string, Shift[]>();
    for (const shift of shifts) {
      const list = map.get(shift.shiftDate) ?? [];
      list.push(shift);
      map.set(shift.shiftDate, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
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
        title="Shifts"
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
            {formatDate(weekStart, { month: "short", day: "numeric" })} –{" "}
            {formatDate(weekEnd)}
          </p>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="text-caption font-semibold text-primary hover:underline"
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

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {shifts.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiCalendarCheckBold size={32} />}
              title="No shifts scheduled this week"
              description={
                canManage
                  ? "Add a shift to start building the roster."
                  : "Check back once a manager builds the schedule."
              }
              action={
                canManage ? (
                  <Button onClick={() => openCreate()} size="sm" leftIcon={<PiPlusBold size={13} />}>
                    Add Shift
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((day, i) => {
              const iso = toIsoDate(day);
              const dayShifts = shiftsByDate.get(iso) ?? [];
              return (
                <DayColumn
                  key={iso}
                  day={day}
                  dayIndex={i}
                  shifts={dayShifts}
                  canManage={canManage}
                  onAddShift={openCreate}
                  onEditShift={openEdit}
                  onDeleteShift={setDeleteTarget}
                />
              );
            })}
          </div>
        )}
      </div>

      <ShiftModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        staff={staff}
        staffError={staffError}
        staffLoading={staffLoading}
        onRetryStaff={refetchStaff}
        canAddTeamMembers={!isStaff}
        onSubmit={handleSubmit}
        saving={saving}
      />

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

export function SchedulePage() {
  return (
    <PermissionGuard requiredUnit="operations">
      <SchedulePageContent />
    </PermissionGuard>
  );
}
