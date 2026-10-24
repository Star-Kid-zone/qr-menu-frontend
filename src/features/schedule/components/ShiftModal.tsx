"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { type ShiftStatus } from "@/services/shift.service";
import { type StaffMember } from "@/services/staff.service";
import { PiXBold } from "react-icons/pi";
import { type FormState } from "../types";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  staff: StaffMember[];
  onSubmit: () => void;
  saving: boolean;
}

export function ShiftModal({
  isOpen,
  onClose,
  form,
  setForm,
  staff,
  onSubmit,
  saving,
}: ShiftModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            {form.id ? "Edit Shift" : "New Shift"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <PiXBold size={15} />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Staff Member *
            </label>
            <Select
              value={form.staffId}
              onChange={(e) => setForm({ ...form, staffId: e.target.value })}
              placeholder="Select staff member"
              options={staff.map((s) => ({ value: s.id, label: s.name }))}
              className="h-10 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Date *
            </label>
            <Input
              type="date"
              value={form.shiftDate}
              onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
              className="h-10 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Start Time *
              </label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="h-10 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                End Time *
              </label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="h-10 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Role Label (optional)
            </label>
            <Input
              value={form.roleLabel}
              onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
              placeholder="e.g. Kitchen, Front of House"
              className="h-10 text-xs"
            />
          </div>

          {form.id && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Status
              </label>
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
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Notes (optional)
            </label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any handover notes"
              className="h-10 text-xs"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onSubmit} loading={saving}>
            {form.id ? "Save Changes" : "Schedule Shift"}
          </Button>
        </div>
      </div>
    </div>
  );
}
