"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PiCaretDown } from "react-icons/pi";
import { buttonVariants } from "./button";
import { Tooltip } from "./Tooltip";
import { cn } from "@/utils/cn";
import type { ActionMenuItem, ActionMenuProps } from "@/types/ui/ActionMenu.types";

export type { ActionMenuItem, ActionMenuProps };

/**
 * A "More" button that groups secondary page actions, so a page header keeps
 * one primary action. Arrow keys move between items, Escape closes.
 */
export function ActionMenu({ label = "More", items, align = "end", tooltip }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();
    const onPointer = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const list = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <Tooltip content={tooltip} align={align} disabled={open || !tooltip}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          className={buttonVariants({ variant: "secondary" })}
        >
          {label}
          <PiCaretDown aria-hidden className="size-4" />
        </button>
      </Tooltip>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-40 mt-2 w-64 rounded-lg border border-border bg-popover p-1 shadow-lg",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
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
              className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            >
              {item.icon ? <span aria-hidden className="mt-0.5 text-muted-foreground">{item.icon}</span> : null}
              <span>
                <span className="block text-body text-foreground">{item.label}</span>
                {item.description ? <span className="block text-caption text-muted-foreground">{item.description}</span> : null}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
