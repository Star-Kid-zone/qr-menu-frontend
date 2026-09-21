"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { staffService, type StaffMember } from "@/services/staff.service";
import type { StaffRole } from "@/constants/permissions";
import { getApiErrorMessage } from "@/utils/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
  PiUsersThreeBold,
  PiUserBold,
  PiShieldCheckBold,
  PiPhoneBold,
  PiLockKeyBold,
  PiMagnifyingGlassBold,
  PiCheckBold,
  PiXBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";

interface FormState {
  id: string | null;
  name: string;
  phone: string;
  password: string;
  role: StaffRole;
  active: boolean;
}

const emptyForm: FormState = { id: null, name: "", phone: "", password: "", role: "staff", active: true };

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "ST";
}

function StaffPageContent() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | StaffRole>("all");
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const {
    data: staffData,
    error: staffError,
    refetch: fetchStaff,
  } = useAsyncData(
    async () => (await staffService.list()).data.staff,
    [],
    "Failed to load staff accounts.",
  );

  const staff = staffData ?? [];

  useEffect(() => {
    if (staffError) toast.error(staffError);
  }, [staffError]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (member: StaffMember) => {
    setForm({
      id: member.id,
      name: member.name,
      phone: member.phone,
      password: "",
      role: member.role,
      active: member.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || (!form.id && form.password.length < 6)) {
      toast.error("Name, phone, and a password (min 6 characters) are required.");
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await staffService.update(form.id, {
          name: form.name.trim(),
          role: form.role,
          active: form.active,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success("Staff account updated successfully.");
      } else {
        await staffService.create({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: form.role,
        });
        toast.success("Staff account created.");
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save staff account."));
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  const totalManagers = staff.filter((s) => s.role === "manager").length;
  const totalStaff = staff.filter((s) => s.role === "staff").length;
  const totalActive = staff.filter((s) => s.active).length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <PageHeader
        title="Staff & Team"
        description="Create phone logins for your staff and manage role permissions."
        actions={
          <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={14} />}>
            Add Team Member
          </Button>
        }
      />

      {/* ─── Stats Bar ─────────────────────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Team</p>
          <p className="mt-1 text-2xl font-bold tabular-figures text-foreground">{staff.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Logins</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <p className="text-2xl font-bold tabular-figures text-foreground">{totalActive}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Managers</p>
          <p className="mt-1 text-2xl font-bold tabular-figures text-primary">{totalManagers}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Floor Staff</p>
          <p className="mt-1 text-2xl font-bold tabular-figures text-foreground">{totalStaff}</p>
        </div>
      </div>

      {/* ─── Filters & Search ───────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-2.5 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <PiMagnifyingGlassBold
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["all", "manager", "staff"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                roleFilter === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Staff Grid ─────────────────────────────────────────────────── */}
      <div className={cn("min-h-0 flex-1", filteredStaff.length === 0 ? "flex flex-col" : "overflow-y-auto pb-4")}>
        {filteredStaff.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiUsersThreeBold size={32} />}
              title="No staff members found"
              description={
                search || roleFilter !== "all"
                  ? "No accounts match your search or filter."
                  : "Add your first team member to give them login access."
              }
              action={
                !search && roleFilter === "all" ? (
                  <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={13} />}>
                    Add Team Member
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStaff.map((member) => {
              const isManager = member.role === "manager";
              return (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Avatar + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-xs",
                            isManager
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border"
                          )}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-foreground">{member.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <PiPhoneBold size={12} className="shrink-0" />
                            <span className="font-mono text-[11px]">{member.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active pill */}
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          member.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {member.active ? "Active" : "Off"}
                      </span>
                    </div>

                    {/* Role & Permissions Note */}
                    <div className="mt-3.5 rounded-lg border border-border/60 bg-muted/40 p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            isManager
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {member.role}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {isManager
                          ? "Full dashboard, menu & analytics access."
                          : "Menu & Website management only."}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[10px] text-muted-foreground">
                      Added {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(member)}
                        aria-label={`Edit ${member.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <PiPencilSimpleBold size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(member)}
                        aria-label={`Delete ${member.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <PiTrashBold size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Add / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {form.id ? "Edit Team Member" : "New Team Member"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {form.id
                    ? "Update credentials and access permissions."
                    : "Create a phone login for your staff."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <PiXBold size={15} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Full Name *</label>
                <div className="relative">
                  <PiUserBold className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="h-10 pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone Number *</label>
                <div className="relative">
                  <PiPhoneBold className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    disabled={!!form.id}
                    className="h-10 pl-9 font-mono text-xs"
                  />
                </div>
                {form.id && (
                  <p className="mt-1 text-[10px] text-muted-foreground">Phone number cannot be modified once registered.</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  {form.id ? "New Password (optional)" : "Login Password *"}
                </label>
                <div className="relative">
                  <PiLockKeyBold className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={form.id ? "Leave empty to keep current password" : "Minimum 6 characters"}
                    className="h-10 pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Access Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "manager" })}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                      form.role === "manager"
                        ? "border-primary bg-primary/8 shadow-xs"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <PiShieldCheckBold className={form.role === "manager" ? "text-primary" : "text-muted-foreground"} size={16} />
                      <span className="text-xs font-bold text-foreground">Manager</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Full access to dashboard, analytics, menu & settings.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "staff" })}
                    className={cn(
                      "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                      form.role === "staff"
                        ? "border-primary bg-primary/8 shadow-xs"
                        : "border-border bg-card hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <PiUserBold className={form.role === "staff" ? "text-primary" : "text-muted-foreground"} size={16} />
                      <span className="text-xs font-bold text-foreground">Staff</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Limited to managing Menu items & Store content.
                    </p>
                  </button>
                </div>
              </div>

              {/* Active Toggle for Edit */}
              {form.id && (
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Account Status</p>
                    <p className="text-[10px] text-muted-foreground">Allow or block login access</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.active}
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                      form.active
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {form.active ? <PiCheckBold size={12} /> : <PiXBold size={12} />}
                    {form.active ? "Active" : "Disabled"}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSubmit} loading={saving}>
                {form.id ? "Save Changes" : "Create Account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Modal ───────────────────────────────────────────────── */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await staffService.remove(deleteTarget.id);
        }}
        onSuccess={fetchStaff}
        entityName="staff account"
        description={`This will permanently revoke ${deleteTarget?.name || "this member"}'s login access.`}
      />
    </div>
  );
}

export default function StaffPage() {
  return (
    <PermissionGuard requireOwner>
      <StaffPageContent />
    </PermissionGuard>
  );
}
