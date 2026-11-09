'use client';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StaffMember } from '@/services/staff.service';
import type { StaffActions } from '../types';
import { Avatar, ROLE_COPY } from './StaffCard';
import { StaffRowMenu } from './StaffRowMenu';
import { StaffSwitch } from './StaffSwitch';

interface StaffTableProps extends StaffActions {
  members: StaffMember[];
  selectedIds: Set<string>;
  busyIds: Set<string>;
  onSelect: (member: StaffMember, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function StaffTable({ members, selectedIds, busyIds, onSelect, onSelectAll, ...actions }: StaffTableProps) {
  const allSelected = members.length > 0 && members.every((m) => selectedIds.has(m.id));
  const someSelected = !allSelected && members.some((m) => selectedIds.has(m.id));

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 pr-0">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label="Select all shown team members"
                className="size-4 rounded border-border accent-[hsl(var(--primary))]"
              />
            </TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Can sign in</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => {
            const manager = m.role === 'manager';
            return (
              <TableRow
                key={m.id}
                data-state={selectedIds.has(m.id) ? 'selected' : undefined}
                className={cn(busyIds.has(m.id) && 'pointer-events-none opacity-60')}
              >
                <TableCell className="pr-0">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(m.id)}
                    onChange={(e) => onSelect(m, e.target.checked)}
                    aria-label={`Select ${m.name}`}
                    className="size-4 rounded border-border accent-[hsl(var(--primary))]"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={m.name} manager={manager} dim={!m.active} />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => actions.onEdit(m)}
                        className="block max-w-[16rem] truncate text-left text-body-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {m.name}
                      </button>
                      <p className="max-w-[16rem] truncate text-caption text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge tone={manager ? 'primary' : 'neutral'}>{ROLE_COPY[manager ? 'manager' : 'staff'].label}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <StaffSwitch
                    checked={m.active}
                    onChange={() => actions.onToggleActive(m)}
                    label={`${m.active ? 'Switch off' : 'Switch on'} sign in for ${m.name}`}
                  />
                </TableCell>
                <TableCell className="pl-0">
                  <StaffRowMenu member={m} actions={actions} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
