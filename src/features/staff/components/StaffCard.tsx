'use client';

import { PiEnvelopeSimpleBold } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';
import type { StaffItemProps } from '../types';
import { StaffRowMenu } from './StaffRowMenu';
import { StaffSwitch } from './StaffSwitch';

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'ST';
}

export const ROLE_COPY = {
  manager: { label: 'Manager', access: 'Everything except managing team members.' },
  staff: { label: 'Staff', access: 'Menu, shifts and checklists. Can view the website settings but not change them.' },
} as const;

export function Avatar({ name, manager, dim }: { name: string; manager: boolean; dim?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full text-body-medium',
        manager ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-foreground',
        dim && 'opacity-50',
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export function StaffCard({ member, selected, busy, onSelect, ...actions }: StaffItemProps) {
  const isManager = member.role === 'manager';
  const role = ROLE_COPY[isManager ? 'manager' : 'staff'];

  return (
    <article
      className={cn(
        'relative flex flex-col rounded-xl border bg-card p-4 transition-colors',
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20',
        busy && 'pointer-events-none opacity-60',
      )}
      aria-busy={busy}
    >
      <div className="flex items-start gap-3">
        <label className="flex size-6 shrink-0 cursor-pointer items-center justify-center self-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(member, e.target.checked)}
            aria-label={`Select ${member.name}`}
            className="size-4 rounded border-border accent-[hsl(var(--primary))]"
          />
        </label>
        <Avatar name={member.name} manager={isManager} dim={!member.active} />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => actions.onEdit(member)}
            className="block max-w-full truncate text-left text-body-medium text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {member.name}
          </button>
          <p className="flex items-center gap-1 text-caption text-muted-foreground">
            <PiEnvelopeSimpleBold size={12} className="shrink-0" aria-hidden />
            <span className="truncate">{member.email}</span>
          </p>
        </div>
        <StaffRowMenu member={member} actions={actions} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={isManager ? 'primary' : 'neutral'}>{role.label}</Badge>
        <Badge tone={member.active ? 'success' : 'neutral'}>{member.active ? 'Active' : 'Switched off'}</Badge>
      </div>
      <p className="mt-2 text-caption text-muted-foreground">{role.access}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-caption text-muted-foreground">Added {formatDate(member.createdAt)}</span>
        <div className="flex items-center gap-1">
          <span className="text-caption text-muted-foreground" aria-hidden>
            {member.active ? 'Can sign in' : 'Blocked'}
          </span>
          <StaffSwitch
            checked={member.active}
            onChange={() => actions.onToggleActive(member)}
            label={`${member.active ? 'Switch off' : 'Switch on'} sign in for ${member.name}`}
          />
        </div>
      </div>
    </article>
  );
}
