'use client';

import {
  PiPencilSimpleBold,
  PiPhoneBold,
  PiTrashBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import type { StaffCardProps } from '../types';

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'ST';
}

export function StaffCard({ member, onEdit, onDelete }: StaffCardProps) {
  const isManager = member.role === 'manager';

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        {/* Top Row: Avatar + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-xs',
                isManager
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border'
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
              'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              member.active
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {member.active ? 'Active' : 'Off'}
          </span>
        </div>

        {/* Role & Permissions Note */}
        <div className="mt-3.5 rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</span>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                isManager
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-foreground'
              )}
            >
              {member.role}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {isManager
              ? 'Full dashboard, menu & analytics access.'
              : 'Menu & Website management only.'}
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
            onClick={() => onEdit(member)}
            aria-label={`Edit ${member.name}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PiPencilSimpleBold size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(member)}
            aria-label={`Delete ${member.name}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PiTrashBold size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
