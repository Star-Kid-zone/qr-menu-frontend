"use client";

import React, { useState } from "react";
import {
  PiCaretDownBold,
  PiSparkleBold,
  PiArticleBold,
  PiFadersBold,
  PiFolderBold,
} from "react-icons/pi";
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
  /** Optional badge tag */
  tag?: string;
  /** Custom icon override */
  icon?: React.ComponentType<{ className?: string }>;
}

interface GroupVisual {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  borderActive: string;
  borderInactive: string;
}

const DEFAULT_GROUP_VISUALS: Record<string, GroupVisual> = {
  setup: {
    icon: PiSparkleBold,
    iconBg: "bg-primary/10 dark:bg-primary/25",
    iconColor: "text-primary dark:text-primary",
    badgeBg: "bg-primary/10 text-primary dark:bg-primary/25",
    badgeText: "1",
    borderActive: "border-primary",
    borderInactive: "border-primary/25",
  },
  content: {
    icon: PiArticleBold,
    iconBg: "bg-sky-500/10 dark:bg-sky-500/25",
    iconColor: "text-sky-600 dark:text-sky-400",
    badgeBg: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/25 dark:text-sky-400",
    badgeText: "2",
    borderActive: "border-sky-500",
    borderInactive: "border-sky-500/25",
  },
  tune: {
    icon: PiFadersBold,
    iconBg: "bg-violet-500/10 dark:bg-violet-500/25",
    iconColor: "text-violet-600 dark:text-violet-400",
    badgeBg: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/25 dark:text-violet-400",
    badgeText: "3",
    borderActive: "border-violet-500",
    borderInactive: "border-violet-500/25",
  },
};

const FALLBACK_GROUP_VISUAL: GroupVisual = {
  icon: PiFolderBold,
  iconBg: "bg-muted",
  iconColor: "text-muted-foreground",
  badgeBg: "bg-muted text-muted-foreground",
  badgeText: "•",
  borderActive: "border-border",
  borderInactive: "border-border/40",
};

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
          "flex h-10 shrink-0 items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:h-8",
          selected
            ? "bg-accent font-medium text-accent-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <span className="truncate">{p.label}</span>
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
        className="flex shrink-0 gap-1 overflow-x-auto pb-1 no-scrollbar md:sticky md:top-2 md:w-48 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0"
      >
        {ungrouped.map(tab)}
        {(groups ?? []).map((g, i) => {
          const members = items.filter((item) => item.group === g.id);
          if (members.length === 0) return null;
          const open = !g.collapsible || openGroups[g.id] || activeItem?.group === g.id;
          const visual = DEFAULT_GROUP_VISUALS[g.id] ?? FALLBACK_GROUP_VISUAL;
          const Icon = g.icon ?? visual.icon;
          const isGroupActive = activeItem?.group === g.id;

          return (
            <div
              key={g.id}
              role="presentation"
              className={cn(
                "flex shrink-0 gap-1 md:flex-col md:gap-1",
                i > 0 && "md:mt-3 md:border-t md:border-border/70 md:pt-3"
              )}
            >
              {/* Group Header (Desktop) */}
              <div className="hidden md:block">
                {g.collapsible ? (
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenGroups((o) => ({ ...o, [g.id]: !open }))}
                    className="flex h-7 w-full shrink-0 items-center justify-between rounded-md px-2 text-left transition-colors hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded",
                          visual.iconBg,
                          visual.iconColor
                        )}
                      >
                        <Icon className="size-2.5" />
                      </span>
                      <span
                        className={cn(
                          "truncate text-[11px] font-bold uppercase tracking-wider",
                          isGroupActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {g.label}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span
                        className={cn(
                          "rounded px-1 py-0.5 text-[9px] font-bold leading-none",
                          visual.badgeBg
                        )}
                      >
                        {g.tag ?? visual.badgeText}
                      </span>
                      <PiCaretDownBold
                        aria-hidden
                        className={cn(
                          "size-2.5 text-muted-foreground transition-transform duration-200",
                          open ? "" : "-rotate-90"
                        )}
                      />
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center justify-between px-2 pb-0.5 text-left">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded",
                          visual.iconBg,
                          visual.iconColor
                        )}
                      >
                        <Icon className="size-2.5" />
                      </span>
                      <span
                        className={cn(
                          "truncate text-[11px] font-bold uppercase tracking-wider",
                          isGroupActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {g.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded px-1 py-0.5 text-[9px] font-bold leading-none",
                        visual.badgeBg
                      )}
                    >
                      {g.tag ?? visual.badgeText}
                    </span>
                  </div>
                )}
              </div>

              {/* Group Heading (Mobile Horizontal Scroller) */}
              <div className="flex md:hidden items-center gap-1 shrink-0 px-1 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded",
                    visual.iconBg,
                    visual.iconColor
                  )}
                >
                  <Icon className="size-2.5" />
                </span>
                <span className="whitespace-nowrap">{g.label}</span>
              </div>

              {/* Child Nav Items with Left Accent Line */}
              {open ? (
                <div
                  className={cn(
                    "flex shrink-0 gap-1 md:flex-col md:gap-0.5 md:ml-1 md:pl-2 md:border-l-2 transition-colors",
                    isGroupActive ? visual.borderActive : visual.borderInactive
                  )}
                >
                  {members.map(tab)}
                </div>
              ) : null}
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
