"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
import { Select } from "@/components/ui/Select";
import { routes } from "@/config/routes";
import { type ShiftStatus } from "@/services/shift.service";
import { type StaffMember } from "@/services/staff.service";
import { type FormState } from "../types";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  staff: StaffMember[];
  /** Set when the team list couldn't be loaded. */
  staffError?: string | null;
  staffLoading?: boolean;
  onRetryStaff?: () => void;
  /** Owners can add team members; managers are told to ask the owner. */
  canAddTeamMembers?: boolean;
  onSubmit: () => void;
  saving: boolean;
}

export function ShiftModal({
  isOpen,
  onClose,
  form,
  setForm,
  staff,
  staffError,
  staffLoading = false,
  onRetryStaff,
  canAddTeamMembers = false,
  onSubmit,
  saving,
}: ShiftModalProps) {
  const noTeam = !staffLoading && !staffError && staff.length === 0;

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" onClick={onSubmit} loading={saving} disabled={Boolean(staffError) || noTeam}>
        {form.id ? "Save changes" : "Add shift"}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={form.id ? "Edit shift" : "Add shift"} maxWidth="max-w-md" footer={footer}>
      <div className="space-y-4">
        {staffError ? (
          <Notice
            tone="error"
            title="We couldn't load your team"
            action={
              onRetryStaff ? (
                <Button size="sm" variant="secondary" onClick={onRetryStaff} loading={staffLoading}>
                  Try again
                </Button>
              ) : undefined
            }
          >
            {staffError}
          </Notice>
        ) : noTeam ? (
          <Notice tone="info" title="No team members yet">
            {canAddTeamMembers ? (
              <>
                Shifts are assigned to team members.{" "}
                <Link href={routes.admin.staff} className="font-medium text-primary hover:underline">
                  Add a team member
                </Link>{" "}
                first.
              </>
            ) : (
              "Shifts are assigned to team members. Ask the owner to add your team first."
            )}
          </Notice>
        ) : null}

        <FormField label="Team member" htmlFor="shift-staff" required>
          <Select
            id="shift-staff"
            value={form.staffId}
            onChange={(e) => setForm({ ...form, staffId: e.target.value })}
            placeholder={staffLoading ? "Loading team…" : "Choose a team member"}
            options={staff.map((s) => ({ value: s.id, label: s.name }))}
            disabled={staffLoading || Boolean(staffError) || noTeam}
          />
        </FormField>

        <FormField label="Date" htmlFor="shift-date" required>
          <Input
            id="shift-date"
            type="date"
            value={form.shiftDate}
            onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Starts" htmlFor="shift-start" required>
            <Input
              id="shift-start"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </FormField>
          <FormField label="Ends" htmlFor="shift-end" required>
            <Input
              id="shift-end"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Station" htmlFor="shift-role" hint="Optional, e.g. Kitchen or Front of house">
          <Input
            id="shift-role"
            value={form.roleLabel}
            onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
          />
        </FormField>

        {form.id && (
          <FormField label="Status" htmlFor="shift-status">
            <Select
              id="shift-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ShiftStatus })}
              options={[
                { value: "scheduled", label: "Scheduled" },
                { value: "completed", label: "Completed" },
                { value: "missed", label: "Missed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </FormField>
        )}

        <FormField label="Notes" htmlFor="shift-notes" hint="Optional handover notes">
          <Input
            id="shift-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </FormField>
      </div>
    </Modal>
  );
}
