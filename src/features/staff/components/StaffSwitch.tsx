'use client';

import { cn } from '@/utils/cn';

/** Compact on/off switch for "can this person sign in". */
export function StaffSwitch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex size-10 items-center justify-center focus-visible:outline-none disabled:opacity-50 sm:h-9 sm:w-11"
    >
      <span
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-primary',
          checked ? 'bg-success' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </span>
    </button>
  );
}
