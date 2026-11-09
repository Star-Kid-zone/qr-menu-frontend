'use client';

import { useState } from 'react';
import { PiEyeBold, PiEyeSlashBold, PiMagicWandBold, PiCheckBold } from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { ToggleCard } from '@/components/ui/ToggleCard';
import { cn } from '@/utils/cn';
import type { StaffRole } from '@/constants/permissions';
import type { StaffModalProps } from '../types';

export const ROLE_OPTIONS: { value: StaffRole; label: string; description: string; can: string[] }[] = [
  {
    value: 'manager',
    label: 'Manager',
    description: 'Runs the restaurant day to day.',
    can: ['Dashboard & analytics', 'Menu', 'Payments & reviews', 'Marketing & QR assets', 'Shifts & checklists', 'Website settings'],
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'Works the floor and the menu.',
    can: ['Menu', 'Shifts & checklists', 'View website settings (read only)'],
  },
];

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

export function StaffModal({ isOpen, form, setForm, saving, onClose, onSubmit, passwordFocus }: StaffModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!form.id;
  const selectedRole = ROLE_OPTIONS.find((r) => r.value === form.role) ?? ROLE_OPTIONS[1];

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" onClick={onSubmit} loading={saving}>
        {isEdit ? 'Save changes' : 'Create account'}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={passwordFocus ? 'Reset password' : isEdit ? 'Edit team member' : 'New team member'}
      maxWidth="max-w-lg"
      footer={footer}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <p className="text-body text-muted-foreground">
          {passwordFocus
            ? `Set a new password for ${form.name}. Share it with them privately; they can sign in with it right away.`
            : isEdit
              ? 'Update their login details and access.'
              : 'Create an email login for your team member.'}
        </p>

        <FormField label="Full name" htmlFor="staff-name" required>
          <Input
            id="staff-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Alex Johnson"
            autoComplete="off"
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="staff-email"
          required
          hint={isEdit ? 'They sign in with this email. Changing it changes how they sign in.' : 'They sign in with this email.'}
        >
          <Input
            id="staff-email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. alex@restaurant.com"
            autoComplete="off"
          />
        </FormField>

        <FormField
          label={isEdit ? 'New password' : 'Login password'}
          htmlFor="staff-password"
          required={!isEdit}
          hint={isEdit ? 'Optional. Leave empty to keep the current password.' : 'At least 8 characters.'}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="staff-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
                autoFocus={passwordFocus}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                {showPassword ? <PiEyeSlashBold size={16} /> : <PiEyeBold size={16} />}
              </button>
            </div>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<PiMagicWandBold size={15} />}
              onClick={() => {
                setForm({ ...form, password: generatePassword() });
                setShowPassword(true);
              }}
            >
              Generate
            </Button>
          </div>
        </FormField>

        <fieldset className="space-y-2">
          <legend className="flex items-baseline gap-1 text-body-medium text-foreground">
            Access role
            <span aria-hidden className="text-destructive">*</span>
            <span className="sr-only">(required)</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const selected = form.role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setForm({ ...form, role: option.value })}
                  className={cn(
                    'flex flex-col items-start rounded-md border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted',
                  )}
                >
                  <span className="flex w-full items-center justify-between text-body-medium text-foreground">
                    {option.label}
                    {selected && <PiCheckBold size={14} className="text-primary" aria-hidden />}
                  </span>
                  <span className="mt-1 text-caption text-muted-foreground">{option.description}</span>
                </button>
              );
            })}
          </div>
          <ul className="grid gap-x-4 gap-y-1 rounded-md bg-muted/50 p-3 text-caption text-muted-foreground sm:grid-cols-2" aria-label={`${selectedRole.label} can access`}>
            {selectedRole.can.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <PiCheckBold size={12} className="shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </fieldset>

        {isEdit && !passwordFocus && (
          <ToggleCard
            checked={form.active}
            onChange={(active) => setForm({ ...form, active })}
            label="Account active"
            description="Turn off to block this person from logging in."
          />
        )}

        <button type="submit" className="sr-only" tabIndex={-1} aria-hidden>
          Submit
        </button>
      </form>
    </Modal>
  );
}
