'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/skeleton';
import { SubTabPills } from '@/components/ui/SubTabPills';
import { staffService, type StaffMember } from '@/services/staff.service';
import type { StaffRole } from '@/constants/permissions';
import { getApiErrorMessage } from '@/utils/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import {
  PiCaretDownBold,
  PiMagnifyingGlassBold,
  PiPlusBold,
  PiRowsBold,
  PiSquaresFourBold,
  PiUsersThreeBold,
  PiXBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import type { StaffFormState, StaffSort, StaffView, StatusFilter } from '../types';
import { StaffCard } from './StaffCard';
import { StaffModal, ROLE_OPTIONS } from './StaffModal';
import { StaffTable } from './StaffTable';

const emptyForm: StaffFormState = { id: null, name: '', email: '', password: '', role: 'staff', active: true };
const VIEW_KEY = 'staff-view';

const viewListeners = new Set<() => void>();

function readView(): StaffView {
  try {
    return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'cards';
  } catch {
    return 'cards';
  }
}

function subscribeView(cb: () => void) {
  viewListeners.add(cb);
  return () => {
    viewListeners.delete(cb);
  };
}

function StatTile({
  label,
  value,
  hint,
  active,
  onClick,
}: {
  label: string;
  value: number;
  hint?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        active ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/50',
      )}
    >
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 text-h1 leading-none text-foreground tabular-nums">{value}</p>
      {hint ? <p className="mt-2 text-caption text-muted-foreground">{hint}</p> : null}
    </button>
  );
}

function StaffPageContent() {
  const view = useSyncExternalStore(subscribeView, readView, () => 'cards' as StaffView);
  const [showModal, setShowModal] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [form, setForm] = useState<StaffFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<StaffSort>('name');
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [showAccess, setShowAccess] = useState(false);
  const { confirm, confirmDialog } = useConfirmDialog();

  const changeView = (next: StaffView) => {
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* preference only */
    }
    viewListeners.forEach((cb) => cb());
  };

  const {
    data: staffData,
    loading,
    error: staffError,
    refetch: fetchStaff,
  } = useAsyncData(async () => (await staffService.list()).data.staff, [], 'Failed to load staff accounts.');

  const staff = useMemo(() => staffData ?? [], [staffData]);

  useEffect(() => {
    if (staffError) toast.error(staffError);
  }, [staffError]);

  const counts = useMemo(
    () => ({
      total: staff.length,
      active: staff.filter((s) => s.active).length,
      inactive: staff.filter((s) => !s.active).length,
      managers: staff.filter((s) => s.role === 'manager').length,
      staff: staff.filter((s) => s.role === 'staff').length,
    }),
    [staff],
  );

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = staff.filter((m) => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && m.active) ||
        (statusFilter === 'inactive' && !m.active);
      return matchesSearch && matchesRole && matchesStatus;
    });
    const by: Record<StaffSort, (a: StaffMember, b: StaffMember) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      oldest: (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      role: (a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name),
    };
    return [...list].sort(by[sort]);
  }, [staff, search, roleFilter, statusFilter, sort]);

  const filtersActive = !!search || roleFilter !== 'all' || statusFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  // Derived from the live list, so people deleted elsewhere drop out of the selection.
  const selectedMembers = useMemo(() => staff.filter((s) => selectedIds.has(s.id)), [staff, selectedIds]);

  // ─── Single-member actions ───────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    setPasswordFocus(false);
    setShowModal(true);
  };

  const openEdit = useCallback((member: StaffMember, focusPassword = false) => {
    setForm({
      id: member.id,
      name: member.name,
      email: member.email,
      password: '',
      role: member.role,
      active: member.active,
    });
    setPasswordFocus(focusPassword);
    setShowModal(true);
  }, []);

  const withBusy = async (ids: string[], fn: () => Promise<void>) => {
    setBusyIds((p) => new Set([...p, ...ids]));
    try {
      await fn();
    } finally {
      setBusyIds((p) => {
        const next = new Set(p);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const toggleActive = async (member: StaffMember) => {
    const next = !member.active;
    if (!next) {
      const ok = await confirm({
        title: `Switch off ${member.name}?`,
        description: 'They will be signed out and blocked from logging in until you switch them back on.',
        confirmLabel: 'Switch off',
        tone: 'destructive',
      });
      if (!ok) return;
    }
    await withBusy([member.id], async () => {
      try {
        await staffService.update(member.id, { active: next });
        toast.success(next ? `${member.name} can sign in again.` : `${member.name} is switched off.`);
        await fetchStaff();
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Failed to update access.'));
      }
    });
  };

  const copyEmail = async (member: StaffMember) => {
    if (!member.email) return;
    try {
      await navigator.clipboard.writeText(member.email);
      toast.success('Email copied.');
    } catch {
      toast.error('Could not copy. Select the email and copy it manually.');
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || (!form.id && form.password.length < 8)) {
      toast.error('Name, email, and a password (min 8 characters) are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error('Enter a valid email address.');
      return;
    }
    if (form.password && form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (passwordFocus && !form.password) {
      toast.error('Enter or generate a new password.');
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await staffService.update(form.id, {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          active: form.active,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success(passwordFocus ? 'Password updated.' : 'Staff account updated successfully.');
      } else {
        await staffService.create({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
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

  // ─── Selection + bulk actions ────────────────────────────────────────
  const onSelect = (member: StaffMember, on: boolean) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(member.id);
      else next.delete(member.id);
      return next;
    });

  const onSelectAll = (on: boolean) => setSelectedIds(on ? new Set(filteredStaff.map((s) => s.id)) : new Set());

  const bulkRun = async (
    targets: StaffMember[],
    run: (m: StaffMember) => Promise<unknown>,
    messages: { ok: (n: number) => string; fail: (n: number) => string },
  ) => {
    await withBusy(
      targets.map((t) => t.id),
      async () => {
        const results = await Promise.allSettled(targets.map(run));
        const failed = results.filter((r) => r.status === 'rejected').length;
        const done = targets.length - failed;
        if (done > 0) toast.success(messages.ok(done));
        if (failed > 0) toast.error(messages.fail(failed));
        // Keep failed ones selected so the owner can retry.
        setSelectedIds(new Set(targets.filter((_, i) => results[i].status === 'rejected').map((t) => t.id)));
        await fetchStaff();
      },
    );
  };

  const bulkSetActive = async (active: boolean) => {
    const targets = selectedMembers.filter((m) => m.active !== active);
    if (targets.length === 0) {
      toast.info(active ? 'Everyone selected can already sign in.' : 'Everyone selected is already switched off.');
      return;
    }
    if (!active) {
      const ok = await confirm({
        title: `Switch off ${targets.length} ${targets.length === 1 ? 'person' : 'people'}?`,
        description: 'They will be blocked from logging in until you switch them back on.',
        confirmLabel: 'Switch off',
        tone: 'destructive',
      });
      if (!ok) return;
    }
    await bulkRun(targets, (m) => staffService.update(m.id, { active }), {
      ok: (n) => `${n} ${n === 1 ? 'account' : 'accounts'} ${active ? 'switched on' : 'switched off'}.`,
      fail: (n) => `${n} could not be updated.`,
    });
  };

  const bulkSetRole = async (role: StaffRole) => {
    const targets = selectedMembers.filter((m) => m.role !== role);
    if (targets.length === 0) return;
    const ok = await confirm({
      title: `Change ${targets.length} ${targets.length === 1 ? 'role' : 'roles'} to ${role}?`,
      description: ROLE_OPTIONS.find((r) => r.value === role)?.description ?? '',
      confirmLabel: 'Change role',
    });
    if (!ok) return;
    await bulkRun(targets, (m) => staffService.update(m.id, { role }), {
      ok: (n) => `${n} ${n === 1 ? 'role' : 'roles'} updated.`,
      fail: (n) => `${n} could not be updated.`,
    });
  };

  const bulkDelete = async () => {
    const targets = selectedMembers;
    const ok = await confirm({
      title: `Delete ${targets.length} ${targets.length === 1 ? 'account' : 'accounts'}?`,
      description: `This permanently revokes login access for ${targets.map((t) => t.name).slice(0, 3).join(', ')}${targets.length > 3 ? ` and ${targets.length - 3} more` : ''}. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'destructive',
    });
    if (!ok) return;
    await bulkRun(targets, (m) => staffService.remove(m.id), {
      ok: (n) => `${n} ${n === 1 ? 'account' : 'accounts'} deleted.`,
      fail: (n) => `${n} could not be deleted.`,
    });
  };

  const actions = {
    onEdit: (m: StaffMember) => openEdit(m),
    onDelete: setDeleteTarget,
    onToggleActive: toggleActive,
    onResetPassword: (m: StaffMember) => openEdit(m, true),
    onCopyEmail: copyEmail,
  };

  const statusTile = (s: StatusFilter) => () => {
    setRoleFilter('all');
    setStatusFilter((cur) => (cur === s ? 'all' : s));
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Team members"
        description="People who can sign in to help run your restaurant."
        actions={
          <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={14} />}>
            Add team member
          </Button>
        }
      />

      {/* ─── Overview tiles (click to filter) ───────────────────────────── */}
      {staff.length > 0 && (
        <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-3">
          <StatTile label="Total team" value={counts.total} hint={`${counts.managers} managers · ${counts.staff} staff`} active={statusFilter === 'all' && roleFilter === 'all'} onClick={clearFilters} />
          <StatTile label="Can sign in" value={counts.active} hint="Active accounts" active={statusFilter === 'active'} onClick={statusTile('active')} />
          <StatTile label="Switched off" value={counts.inactive} hint="Blocked from logging in" active={statusFilter === 'inactive'} onClick={statusTile('inactive')} />
        </div>
      )}

      {/* ─── Toolbar ────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <PiMagnifyingGlassBold
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            aria-label="Search team members"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SubTabPills
            options={[
              { id: 'all', label: `All (${counts.total})` },
              { id: 'manager', label: `Managers (${counts.managers})` },
              { id: 'staff', label: `Staff (${counts.staff})` },
            ]}
            active={roleFilter}
            onChange={setRoleFilter}
          />
          <div className="w-40">
            <Select
              aria-label="Sort team members"
              value={sort}
              onChange={(e) => setSort(e.target.value as StaffSort)}
              options={[
                { value: 'name', label: 'Sort: Name A–Z' },
                { value: 'newest', label: 'Sort: Newest' },
                { value: 'oldest', label: 'Sort: Oldest' },
                { value: 'role', label: 'Sort: Role' },
              ]}
            />
          </div>
          <div className="inline-flex rounded-md border border-input bg-card p-0.5" role="group" aria-label="Layout">
            {([
              ['cards', 'Card view', PiSquaresFourBold],
              ['table', 'Table view', PiRowsBold],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                aria-label={label}
                title={label}
                onClick={() => changeView(id)}
                className={cn(
                  'flex size-10 items-center justify-center rounded transition-colors sm:size-9 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
                  view === id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon size={16} aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bulk action bar ────────────────────────────────────────────── */}
      {selectedMembers.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          className="flex shrink-0 flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
        >
          <span className="px-1 text-body-medium text-foreground">{selectedMembers.length} selected</span>
          <Button size="sm" variant="secondary" onClick={() => bulkSetActive(true)}>
            Switch on
          </Button>
          <Button size="sm" variant="secondary" onClick={() => bulkSetActive(false)}>
            Switch off
          </Button>
          <Button size="sm" variant="secondary" onClick={() => bulkSetRole('manager')}>
            Make manager
          </Button>
          <Button size="sm" variant="secondary" onClick={() => bulkSetRole('staff')}>
            Make staff
          </Button>
          <Button size="sm" variant="danger" onClick={bulkDelete}>
            Delete
          </Button>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            aria-label="Clear selection"
            className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <PiXBold size={14} aria-hidden />
          </button>
        </div>
      )}

      {/* ─── Results ────────────────────────────────────────────────────── */}
      <div className={cn('min-h-0 flex-1', filteredStaff.length === 0 && !loading ? 'flex flex-col' : 'overflow-y-auto pb-6')}>
        {loading && !staffData ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy>
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6">
            <EmptyState
              icon={<PiUsersThreeBold size={32} />}
              title={filtersActive ? 'No one matches' : 'No team members yet'}
              description={
                filtersActive
                  ? 'Try another name or email, or clear the filters.'
                  : 'Add a manager or staff member so they can sign in with their email.'
              }
              action={
                filtersActive ? (
                  <Button onClick={clearFilters} size="sm" variant="secondary">
                    Clear filters
                  </Button>
                ) : (
                  <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={13} />}>
                    Add team member
                  </Button>
                )
              }
            />
          </div>
        ) : view === 'table' ? (
          <StaffTable
            members={filteredStaff}
            selectedIds={selectedIds}
            busyIds={busyIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            {...actions}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                selected={selectedIds.has(member.id)}
                busy={busyIds.has(member.id)}
                onSelect={onSelect}
                {...actions}
              />
            ))}
          </div>
        )}

        {staff.length > 0 && (
          <p className="mt-3 text-caption text-muted-foreground" aria-live="polite">
            Showing {filteredStaff.length} of {staff.length}
          </p>
        )}

        {/* ─── What each role can do ───────────────────────────────────── */}
        {staff.length > 0 && (
          <section className="mt-4 rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setShowAccess((v) => !v)}
              aria-expanded={showAccess}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>
                <span className="block text-body-medium text-foreground">What can each role do?</span>
                <span className="block text-caption text-muted-foreground">Owners always keep full control, including this page.</span>
              </span>
              <PiCaretDownBold aria-hidden className={cn('shrink-0 text-muted-foreground transition-transform', showAccess && 'rotate-180')} />
            </button>
            {showAccess && (
              <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
                {ROLE_OPTIONS.map((r) => (
                  <div key={r.value}>
                    <p className="text-body-medium text-foreground">
                      {r.label} <span className="text-caption text-muted-foreground">· {counts[r.value === 'manager' ? 'managers' : 'staff']} people</span>
                    </p>
                    <ul className="mt-1 space-y-0.5 text-caption text-muted-foreground">
                      {r.can.map((c) => (
                        <li key={c}>· {c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <StaffModal
        isOpen={showModal}
        form={form}
        setForm={setForm}
        saving={saving}
        passwordFocus={passwordFocus}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

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
      {confirmDialog}
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
