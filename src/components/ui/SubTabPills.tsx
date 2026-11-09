"use client";

import { ScrollableTabRow } from "./ScrollableTabRow";
import { cn } from "@/utils/cn";

/**
 * Secondary switch inside a section (e.g. Content: Announcement bar / Our story / …).
 * A segmented control: 36px tall on desktop, 44px on touch screens.
 */
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
    <div className="inline-flex max-w-full shrink-0 items-center rounded-md border border-input bg-card p-0.5" role="tablist">
      <ScrollableTabRow activeKey={active} scrollContainerClassName="gap-0.5">
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
                "flex h-11 shrink-0 snap-start items-center whitespace-nowrap rounded px-4 text-body-medium transition-colors sm:h-9 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                selected ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </ScrollableTabRow>
    </div>
  );
}
