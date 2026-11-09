"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface RailItem {
  id: string;
  label: string;
  /** Show a dot: this part differs from the template's own look. */
  customised?: boolean;
}

/**
 * The studio's frame: a strip across the top, a vertical rail of parts on the left and
 * one panel on the right. Only one panel shows at a time, so nothing is scrolled past.
 */
export function StudioShell({
  formId,
  ariaLabel,
  strip,
  items,
  active,
  onActive,
  children,
}: {
  formId: string;
  ariaLabel: string;
  strip: React.ReactNode;
  items: RailItem[];
  active: string;
  onActive: (id: string) => void;
  children: React.ReactNode;
}) {
  const onKey = (e: React.KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = items[(index + step + items.length) % items.length];
    onActive(next.id);
    document.getElementById(`${formId}-part-${next.id}`)?.focus();
  };

  return (
    <div className="space-y-3">
      {strip}
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="vertical"
          className="flex shrink-0 gap-1 overflow-x-auto md:w-40 md:flex-col md:overflow-visible"
        >
          {items.map((p, i) => {
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
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "flex h-11 shrink-0 items-center justify-between gap-2 rounded-lg px-3 text-left text-body-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:h-8",
                  selected ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="whitespace-nowrap">{p.label}</span>
                {p.customised ? (
                  <>
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="sr-only">(changed from template)</span>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>

        <div
          id={`${formId}-part-panel`}
          role="tabpanel"
          aria-labelledby={`${formId}-part-${active}`}
          className="min-w-0 flex-1 space-y-3"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
