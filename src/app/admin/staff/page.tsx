"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { staffService, type StaffMember } from "@/services/staff.service";
import type { StaffRole } from "@/constants/permissions";
import { getApiErrorMessage } from "@/utils/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
  PiUsersThreeBold,
} from "react-icons/pi";
import { fadeInUp, staggerContainer, springDefault } from "@/lib/motion";

const ROLE_LABEL: Record<StaffRole, string> = {
  manager: "Manager — full access except staff management",
  staff: "Staff — Menu & Workspace content only",
};

interface FormState {
  id: string | null;
  name: string;
  phone: string;
  password: string;
  role: StaffRole;
  active: boolean;
}

const emptyForm: FormState = { id: null, name: "", phone: "", password: "", role: "staff", active: true };

export default function StaffPage() {
  const prefersReducedMotion = useReducedMotion();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const {
    data: staff,
    error: staffError,
    refetch: fetchStaff,
  } = useAsyncData(
    async () => (await staffService.list()).data.staff,
    [],
    "Failed to load staff accounts.",
  );

  useEffect(() => {
    if (staffError) toast.error(staffError);
  }, [staffError]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (member: StaffMember) => {
    setForm({ id: member.id, name: member.name, phone: member.phone, password: "", role: member.role, active: member.active });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || (!form.id && form.password.length < 6)) {
      toast.error("Name, phone, and a password of at least 6 characters are required.");
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await staffService.update(form.id, {
          name: form.name,
          role: form.role,
          active: form.active,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success("Staff account updated.");
      } else {
        await staffService.create({ name: form.name, phone: form.phone, password: form.password, role: form.role });
        toast.success("Staff account created.");
      }
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save staff account."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 text-foreground">Staff Accounts</h1>
          <p className="text-body text-muted-foreground">
            Create phone + password logins for your team with fixed access levels.
          </p>
        </div>
        <Button onClick={openCreate} className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
          <PiPlusBold size={16} />
          Add Staff
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            key="staff-form"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={springDefault}
            className="shrink-0 overflow-hidden"
          >
            <Card>
              <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <FormField label="Name">
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                </FormField>
                <FormField label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    disabled={!!form.id}
                  />
                </FormField>
                <FormField label={form.id ? "New password (leave blank to keep current)" : "Password"}>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </FormField>
                <FormField label="Role" hint={ROLE_LABEL[form.role]}>
                  <Select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}
                  >
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </Select>
                </FormField>
                {form.id && (
                  <div className="flex items-center sm:col-span-2">
                    <Checkbox
                      id="active"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      label="Active"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 xs:flex-row sm:col-span-2">
                  <Button onClick={handleSubmit} disabled={saving} className="w-full xs:w-auto">
                    {saving ? "Saving…" : form.id ? "Save changes" : "Create staff account"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)} className="w-full xs:w-auto">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {(staff ?? []).length === 0 ? (
          <EmptyState
            icon={<PiUsersThreeBold size={28} />}
            title="No staff accounts yet"
            description="Add one to share admin access with your team."
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            variants={staggerContainer(0.05)}
          >
            {(staff ?? []).map((member) => (
              <motion.div key={member.id} variants={fadeInUp}>
                <Card>
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-h3 text-foreground break-words">{member.name}</h3>
                      <Badge tone={member.active ? "success" : "neutral"}>{member.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <span className="font-mono text-caption text-muted-foreground break-all">{member.phone}</span>
                    <span className="text-caption uppercase tracking-wide text-primary">{member.role}</span>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(member)}
                        aria-label={`Edit ${member.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-8 sm:w-8"
                      >
                        <PiPencilSimpleBold size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(member)}
                        aria-label={`Delete ${member.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-8 sm:w-8"
                      >
                        <PiTrashBold size={14} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await staffService.remove(deleteTarget.id);
        }}
        onSuccess={fetchStaff}
        entityName="staff account"
        description={`This will permanently remove ${deleteTarget?.name || "this staff member"}'s login access.`}
      />
    </div>
  );
}
