"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PiCaretUpDown, PiMoon, PiSignOut, PiSun } from "react-icons/pi";
import { useThemeContext } from "@/contexts/useThemeContext";
import { logoutSession } from "@/utils/authSession";
import { cn } from "@/utils/cn";
import type { ShellIdentity } from "@/hooks/useShellIdentity";

interface AccountMenuProps {
  identity: ShellIdentity | null;
  /** Icon-only trigger for the collapsed sidebar. */
  compact?: boolean;
}

/** Who is signed in, with theme and sign out. Opens upward from the sidebar footer. */
export function AccountMenu({ identity, compact = false }: AccountMenuProps) {
  const { mode, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = identity?.name ?? "";
  const role = identity?.roleLabel ?? "";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={compact ? `Account: ${name} (${role})` : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          compact && "justify-center"
        )}
      >
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-caption text-accent-foreground"
        >
          {identity?.initials ?? ""}
        </span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-medium text-foreground">{name || " "}</span>
              <span className="block truncate text-caption text-muted-foreground">{role || " "}</span>
            </span>
            <PiCaretUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute bottom-full z-50 mb-2 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg",
            compact ? "left-0" : "inset-x-0 w-auto"
          )}
        >
          <button
            ref={firstItemRef}
            type="button"
            role="menuitem"
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-body text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
          >
            {mode === "light" ? <PiMoon aria-hidden className="size-4" /> : <PiSun aria-hidden className="size-4" />}
            {mode === "light" ? "Dark mode" : "Light mode"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => logoutSession()}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-body text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
          >
            <PiSignOut aria-hidden className="size-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
