'use client';

import { useEffect, useState, useMemo } from 'react';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { staffService, type StaffMember } from '@/services/staff.service';
import type { StaffRole } from '@/constants/permissions';
import { getApiErrorMessage } from '@/utils/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import {
  PiPlusBold,
  PiUsersThreeBold,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import type { StaffFormState } from '../types';
import { StaffCard } from './StaffCard';
import { StaffModal } from './StaffModal';

const emptyForm: StaffFormState = { id: null, name: '', phone: '', password: '', role: 'staff', active: true };

function StaffPageContent() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StaffFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  const {
    data: staffData,
    error: staffError,
    refetch: fetchStaff,
  } = useAsyncData(
    async () => (await staffService.list()).data.staff,
    [],
    'Failed to load staff accounts.',
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
      password: '',
      role: member.role,
      active: member.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || (!form.id && form.password.length < 6)) {
      toast.error('Name, phone, and a password (min 6 characters) are required.');
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
        toast.success('Staff account updated successfully.');
      } else {
        await staffService.create({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: form.role,
        });
        toast.success('Staff account created.');
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save staff account.'));
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  const totalManagers = staff.filter((s) => s.role === 'manager').length;
  const totalStaff = staff.filter((s) => s.role === 'staff').length;
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
          {(['all', 'manager', 'staff'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                roleFilter === r
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Staff Grid ─────────────────────────────────────────────────── */}
      <div className={cn('min-h-0 flex-1', filteredStaff.length === 0 ? 'flex flex-col' : 'overflow-y-auto pb-4')}>
        {filteredStaff.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiUsersThreeBold size={32} />}
              title="No staff members found"
              description={
                search || roleFilter !== 'all'
                  ? 'No accounts match your search or filter.'
                  : 'Add your first team member to give them login access.'
              }
              action={
                !search && roleFilter === 'all' ? (
                  <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={13} />}>
                    Add Team Member
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Add / Edit Modal ───────────────────────────────────────────── */}
      <StaffModal
        isOpen={showModal}
        form={form}
        setForm={setForm}
        saving={saving}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* ─── Delete Modal ───────────────────────────────────────────────── */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await staffService.remove(deleteTarget.id);
        }}
        onSuccess={fetchStaff}
        entityName="staff account"
        description={`This will permanently revoke ${deleteTarget?.name || 'this member'}'s login access.`}
      />
    </div>
  );
}

export function StaffPage() {
  return (
    <PermissionGuard requireOwner>
      <StaffPageContent />
    </PermissionGuard>
  );
}
