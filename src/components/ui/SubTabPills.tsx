"use client";

import { ScrollableTabRow } from "./ScrollableTabRow";
import { cn } from "@/utils/cn";

export function SubTabPills<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex max-w-full items-center rounded-full border border-border bg-card p-1.5 shrink-0" role="tablist">
      <ScrollableTabRow activeKey={active} scrollContainerClassName="gap-1">
        {options.map((opt) => {
          const selected = opt.id === active;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-tab-active={selected || undefined}
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex shrink-0 snap-start items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-2 text-caption font-semibold transition-colors duration-200",
                selected
                  ? "bg-accent text-accent-foreground shadow-neu-inset-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  selected ? "text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </ScrollableTabRow>
    </div>
  );
}
