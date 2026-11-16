"use client";

import React, { useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import { cn } from "@/utils/cn";

export interface RailItem {
  id: string;
  label: string;
  /** One line under the panel title: what this panel changes. */
  hint?: string;
  /** Rail group heading this item sits under. */
  group?: string;
  /** Show a dot: the owner changed this part. */
  customised?: boolean;
}

export interface RailGroup {
  id: string;
  label: string;
  /** Starts folded away (opens itself when one of its items is active). */
  collapsible?: boolean;
}

/**
 * The studio's frame: a rail of parts on the left, grouped into a few plain
 * jobs ("Set up", "Content", "Fine-tune"), and one panel on the right with a
 * title and a one-line explanation. Only one panel shows at a time.
 */
export function StudioShell({
  formId,
  ariaLabel,
  strip,
  items,
  groups,
  active,
  onActive,
  children,
}: {
  formId: string;
  ariaLabel: string;
  /** Optional content above the panel (shown only where it belongs). */
  strip?: React.ReactNode;
  items: RailItem[];
  groups?: RailGroup[];
  active: string;
  onActive: (id: string) => void;
  children: React.ReactNode;
}) {
  const activeItem = items.find((i) => i.id === active);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const visibleOrder = items.filter((i) => {
    const g = groups?.find((x) => x.id === i.group);
    return !g?.collapsible || openGroups[g.id] || activeItem?.group === g.id;
  });

  const onKey = (e: React.KeyboardEvent, id: string) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const index = visibleOrder.findIndex((i) => i.id === id);
    const next = visibleOrder[(index + step + visibleOrder.length) % visibleOrder.length];
    onActive(next.id);
    document.getElementById(`${formId}-part-${next.id}`)?.focus();
  };

  const tab = (p: RailItem) => {
    const selected = p.id === active;
    return (
      <button
        key={p.id}
        id={`${formId}-part-${p.id}`}
        type="button"
        role="tab"
        aria-selected={selected}
        aria-controls={`${formId}-part-panel`}
        tabIndex={selected ? 0 : -1}
        onClick={() => onActive(p.id)}
        onKeyDown={(e) => onKey(e, p.id)}
        className={cn(
          "flex h-10 shrink-0 items-center justify-between gap-2 rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:h-8",
          selected ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <span className="whitespace-nowrap">{p.label}</span>
        {p.customised ? (
          <>
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
            <span className="sr-only">(changed)</span>
          </>
        ) : null}
      </button>
    );
  };

  const ungrouped = items.filter((i) => !i.group);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        className="flex shrink-0 gap-1 overflow-x-auto pb-1 md:sticky md:top-2 md:w-44 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0"
      >
        {ungrouped.map(tab)}
        {(groups ?? []).map((g) => {
          const members = items.filter((i) => i.group === g.id);
          if (members.length === 0) return null;
          const open = !g.collapsible || openGroups[g.id] || activeItem?.group === g.id;
          return (
            <div key={g.id} role="presentation" className="flex shrink-0 gap-1 md:mt-3 md:flex-col md:gap-0.5 md:first:mt-0">
              {g.collapsible ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenGroups((o) => ({ ...o, [g.id]: !open }))}
                  className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary md:h-7"
                >
                  {g.label}
                  <PiCaretDownBold aria-hidden className={cn("size-3 transition-transform", open ? "" : "-rotate-90")} />
                </button>
              ) : (
                <p className="hidden px-3 pb-1 text-xs font-medium text-muted-foreground md:block">{g.label}</p>
              )}
              {open ? members.map(tab) : null}
            </div>
          );
        })}
      </div>

      <div
        id={`${formId}-part-panel`}
        role="tabpanel"
        aria-labelledby={`${formId}-part-${active}`}
        className="min-w-0 flex-1 space-y-4"
      >
        {activeItem ? (
          <header className="space-y-1 border-b pb-3">
            <h3 className="text-base font-semibold text-foreground">{activeItem.label}</h3>
            {activeItem.hint ? <p className="max-w-prose text-sm text-muted-foreground">{activeItem.hint}</p> : null}
          </header>
        ) : null}
        {strip}
        {children}
      </div>
    </div>
  );
}
