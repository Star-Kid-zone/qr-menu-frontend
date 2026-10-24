'use client';

import {
  PiLockKeyBold,
  PiPhoneBold,
  PiShieldCheckBold,
  PiUserBold,
  PiXBold,
  PiCheckBold,
} from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import type { StaffModalProps } from '../types';

export function StaffModal({
  isOpen,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: StaffModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {form.id ? 'Edit Team Member' : 'New Team Member'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {form.id
                ? 'Update credentials and access permissions.'
                : 'Create a phone login for your staff.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              {form.id ? 'New Password (optional)' : 'Login Password *'}
            </label>
            <div className="relative">
              <PiLockKeyBold className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={form.id ? 'Leave empty to keep current password' : 'Minimum 6 characters'}
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
                onClick={() => setForm({ ...form, role: 'manager' })}
                className={cn(
                  'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                  form.role === 'manager'
                    ? 'border-primary bg-primary/8 shadow-xs'
                    : 'border-border bg-card hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <PiShieldCheckBold className={form.role === 'manager' ? 'text-primary' : 'text-muted-foreground'} size={16} />
                  <span className="text-xs font-bold text-foreground">Manager</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Full access to dashboard, analytics, menu & settings.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'staff' })}
                className={cn(
                  'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                  form.role === 'staff'
                    ? 'border-primary bg-primary/8 shadow-xs'
                    : 'border-border bg-card hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <PiUserBold className={form.role === 'staff' ? 'text-primary' : 'text-muted-foreground'} size={16} />
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
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors',
                  form.active
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {form.active ? <PiCheckBold size={12} /> : <PiXBold size={12} />}
                {form.active ? 'Active' : 'Disabled'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onSubmit} loading={saving}>
            {form.id ? 'Save Changes' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}
