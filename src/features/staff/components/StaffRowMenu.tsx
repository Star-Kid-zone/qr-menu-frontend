'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  PiCopySimpleBold,
  PiDotsThreeVerticalBold,
  PiKeyBold,
  PiPencilSimpleBold,
  PiPowerBold,
  PiTrashBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import type { StaffMember } from '@/services/staff.service';
import type { StaffActions } from '../types';

interface Item {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  tone?: 'danger';
  hidden?: boolean;
}

/** Per-member overflow menu: every control for one person in one place. */
export function StaffRowMenu({ member, actions }: { member: StaffMember; actions: StaffActions }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items: Item[] = [
    { label: 'Edit details', icon: <PiPencilSimpleBold />, onSelect: () => actions.onEdit(member) },
    { label: 'Reset password', icon: <PiKeyBold />, onSelect: () => actions.onResetPassword(member) },
    { label: 'Copy email', icon: <PiCopySimpleBold />, onSelect: () => actions.onCopyEmail(member), hidden: !member.email },
    {
      label: member.active ? 'Switch off sign in' : 'Switch on sign in',
      icon: <PiPowerBold />,
      onSelect: () => actions.onToggleActive(member),
    },
    { label: 'Delete account', icon: <PiTrashBold />, onSelect: () => actions.onDelete(member), tone: 'danger' },
  ];
  const visible = items.filter((i) => !i.hidden);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();
    const onPointer = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const list = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`More actions for ${member.name}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary sm:size-9"
      >
        <PiDotsThreeVerticalBold size={18} aria-hidden />
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className="absolute right-0 top-full z-40 mt-1 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {visible.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-body focus-visible:outline-none',
                item.tone === 'danger'
                  ? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10'
                  : 'text-foreground hover:bg-muted focus-visible:bg-muted',
                item.tone === 'danger' && i > 0 && 'mt-1 border-t border-border',
              )}
            >
              <span aria-hidden className={item.tone === 'danger' ? '' : 'text-muted-foreground'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
