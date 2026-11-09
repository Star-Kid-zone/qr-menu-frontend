"use client";

import { PiEyeSlash, PiEye, PiTrash, PiX } from "react-icons/pi";
import { buttonVariants, Select, Tooltip } from "@/components/ui";
import { cn } from "@/utils/cn";

interface MenuBulkBarProps {
  selectedCount: number;
  shownCount: number;
  categories: string[];
  busy: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onPutOnMenu: () => void;
  onMarkSoldOut: () => void;
  onMoveCategory: (category: string) => void;
  onDelete: () => void;
}

const btn = buttonVariants({ variant: "secondary", size: "sm", className: "gap-1.5" });

/**
 * Floating bar shown while dishes are selected. It sits over the bottom of the
 * list (nothing shifts when it appears, and it stays in reach while scrolling).
 * Parent must be `relative`.
 */
export function MenuBulkBar({
  selectedCount,
  shownCount,
  categories,
  busy,
  onSelectAll,
  onClear,
  onPutOnMenu,
  onMarkSoldOut,
  onMoveCategory,
  onDelete,
}: MenuBulkBarProps) {
  const canSelectMore = shownCount > selectedCount;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-2">
      <div
        role="region"
        aria-label="Actions for selected dishes"
        className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-border bg-popover px-3 py-2 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <Tooltip content="Clear selection" side="top" decorative>
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear selection"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PiX aria-hidden className="size-4" />
            </button>
          </Tooltip>
          <span aria-live="polite" className="whitespace-nowrap text-body-medium text-foreground">
            {selectedCount} selected
          </span>
          {canSelectMore ? (
            <button type="button" onClick={onSelectAll} className="whitespace-nowrap text-caption font-medium text-primary hover:underline">
              Select all {shownCount}
            </button>
          ) : null}
        </div>

        <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" disabled={busy} onClick={onPutOnMenu} className={btn}>
            <PiEye aria-hidden className="size-4" />
            Put on menu
          </button>
          <button type="button" disabled={busy} onClick={onMarkSoldOut} className={btn}>
            <PiEyeSlash aria-hidden className="size-4" />
            Sold out
          </button>
          <div className="w-44">
            <Select
              aria-label="Move selected dishes to a category"
              value=""
              disabled={busy || categories.length === 0}
              onChange={(e) => e.target.value && onMoveCategory(e.target.value)}
              className="h-8"
            >
              <option value="">Move to…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className={cn(buttonVariants({ variant: "danger", size: "sm" }), "gap-1.5")}
          >
            <PiTrash aria-hidden className="size-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
