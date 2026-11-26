"use client";

import React, { useState } from "react";
import {
  PiArrowDownBold,
  PiArrowUpBold,
  PiCalendarBlankBold,
  PiDotsSixVerticalBold,
  PiEyeBold,
  PiEyeSlashBold,
} from "react-icons/pi";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";
import { isScheduledOn, todayIn } from "@/components/templates/sections/document";
import type { SectionSchedule, SectionVariant } from "@/components/templates/sections/types";

const SHORT_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const shortDate = (d: string) => SHORT_DATE.format(new Date(`${d}T00:00:00Z`));

/** One-line summary of a date window relative to today, e.g. "Until 31 Dec" or "Ended 31 Dec". */
export function scheduleSummary(schedule: SectionSchedule | undefined, today: string): string | null {
  if (!schedule || (!schedule.from && !schedule.to)) return null;
  if (schedule.to && today > schedule.to) return `Ended ${shortDate(schedule.to)}`;
  if (schedule.from && today < schedule.from) {
    return schedule.to ? `Shows ${shortDate(schedule.from)} – ${shortDate(schedule.to)}` : `Starts ${shortDate(schedule.from)}`;
  }
  return schedule.to ? `Until ${shortDate(schedule.to)}` : `Since ${shortDate(schedule.from!)}`;
}

export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Merge a schedule edit into an item; an empty window removes the schedule. */
export function withSchedule<T extends { schedule?: SectionSchedule }>(item: T, patch: SectionSchedule): T {
  const next: SectionSchedule = { ...item.schedule, ...patch };
  if (!next.from) delete next.from;
  if (!next.to) delete next.to;
  const rest = { ...item };
  delete rest.schedule;
  return next.from || next.to ? { ...rest, schedule: next } : rest;
}

interface OrderableItem {
  id: string;
  label: string;
  description?: string;
  hidden: boolean;
  schedule?: SectionSchedule;
  /** Alternative designs; when given, a picker is shown. The first is the default. */
  variants?: readonly SectionVariant[];
  variant?: string;
  /** Optional visual thumbnail or preview element */
  thumbnail?: React.ReactNode;
}

export interface OrderableListProps {
  items: readonly OrderableItem[];
  ariaLabel: string;
  disabled: boolean;
  /** Set to false to completely hide date scheduling fields. Defaults to true if onSchedule is provided. */
  allowSchedule?: boolean;
  onMove: (from: number, to: number) => void;
  onToggle: (index: number) => void;
  onSchedule?: (index: number, patch: SectionSchedule) => void;
  /** Pick a design; `undefined` means the default (first) variant. */
  onVariant?: (index: number, variant: string | undefined) => void;
}

/**
 * Reorderable rows with visual thumbnails, position numbers, clear drag & drop guides,
 * and optional date scheduling.
 */
export function OrderableList({
  items,
  ariaLabel,
  disabled,
  allowSchedule,
  onMove,
  onToggle,
  onSchedule,
  onVariant,
}: OrderableListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: "before" | "after" } | null>(null);
  const [scheduling, setScheduling] = useState<string | null>(null);
  const [recentlyMovedId, setRecentlyMovedId] = useState<string | null>(null);
  const today = todayIn(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const canSchedule = (allowSchedule ?? Boolean(onSchedule)) && Boolean(onSchedule);

  const endDrag = () => {
    setDragIndex(null);
    setDropIndicator(null);
  };

  const handleArrowMove = (from: number, to: number, id: string) => {
    onMove(from, to);
    setRecentlyMovedId(id);
    setTimeout(() => setRecentlyMovedId((cur) => (cur === id ? null : cur)), 600);
  };

  return (
    <ol aria-label={ariaLabel} className="space-y-2">
      {items.map((item, index) => {
        const { label, hidden } = item;
        const scheduleOpen = canSchedule && scheduling === item.id;
        const summary = canSchedule ? scheduleSummary(item.schedule, today) : null;
        const live = canSchedule ? isScheduledOn(item, today) : true;
        const isDraggingThis = dragIndex === index;
        const showBeforeIndicator = dropIndicator?.index === index && dropIndicator.position === "before" && dragIndex !== index;
        const showAfterIndicator = dropIndicator?.index === index && dropIndicator.position === "after" && dragIndex !== index;

        return (
          <li
            key={item.id}
            draggable={!disabled && !scheduleOpen}
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(index));
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              const rect = e.currentTarget.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              const position = e.clientY < midY ? "before" : "after";
              setDropIndicator({ index, position });
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDropIndicator((prev) => (prev?.index === index ? null : prev));
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) {
                const rect = e.currentTarget.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                const pos = e.clientY < midY ? "before" : "after";
                let target = pos === "before" ? index : index + 1;
                if (dragIndex < target) target -= 1;
                if (dragIndex !== target && target >= 0 && target < items.length) {
                  onMove(dragIndex, target);
                  setRecentlyMovedId(item.id);
                  setTimeout(() => setRecentlyMovedId((cur) => (cur === item.id ? null : cur)), 600);
                }
              }
              endDrag();
            }}
            onDragEnd={endDrag}
            className={cn(
              "group relative rounded-xl border bg-card p-2.5 transition-all duration-150",
              isDraggingThis
                ? "opacity-35 scale-[0.99] border-dashed border-primary/60 bg-primary/5"
                : "border-border hover:border-border/90 hover:shadow-2xs",
              hidden && "bg-muted/30 border-dashed border-border/70",
              recentlyMovedId === item.id && "ring-2 ring-primary/40 bg-primary/5 shadow-xs"
            )}
          >
            {/* Insertion Guides */}
            {showBeforeIndicator ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1.5 left-2 right-2 z-30 flex h-1 items-center justify-between rounded-full bg-primary shadow-xs"
              >
                <span className="size-2.5 -ml-1 rounded-full bg-primary ring-2 ring-background" />
                <span className="size-2.5 -mr-1 rounded-full bg-primary ring-2 ring-background" />
              </div>
            ) : null}

            {showAfterIndicator ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1.5 left-2 right-2 z-30 flex h-1 items-center justify-between rounded-full bg-primary shadow-xs"
              >
                <span className="size-2.5 -ml-1 rounded-full bg-primary ring-2 ring-background" />
                <span className="size-2.5 -mr-1 rounded-full bg-primary ring-2 ring-background" />
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div
                aria-label="Drag handle"
                title="Drag to reorder"
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground/80 transition-colors",
                  disabled ? "opacity-30" : "cursor-grab active:cursor-grabbing hover:bg-muted hover:text-foreground"
                )}
              >
                <PiDotsSixVerticalBold className="size-5" />
              </div>

              {/* Numerical Rank Badge */}
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 select-none items-center justify-center rounded-md text-caption font-semibold tabular-nums transition-colors",
                  hidden ? "bg-muted text-muted-foreground/50" : "bg-primary/10 text-primary font-bold"
                )}
                title={`Position ${index + 1} of ${items.length}`}
              >
                {index + 1}
              </span>

              {/* Visual Thumbnail */}
              {item.thumbnail ? (
                <div className="shrink-0">{item.thumbnail}</div>
              ) : null}

              {/* Section Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn("text-body-medium font-medium truncate", hidden ? "text-muted-foreground line-through" : "text-foreground")}>
                    {label}
                  </p>
                  {hidden ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <PiEyeSlashBold className="size-3" /> Hidden
                    </span>
                  ) : null}
                </div>

                {item.description ? (
                  <p className="mt-0.5 truncate text-caption text-muted-foreground">{item.description}</p>
                ) : null}

                {item.variants && item.variants.length > 1 && onVariant ? (
                  <div
                    className="mt-1.5 flex items-center gap-2 text-caption text-muted-foreground"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <span>Design</span>
                    <select
                      aria-label={`${label} design`}
                      value={item.variant ?? item.variants[0].value}
                      disabled={disabled}
                      onChange={(e) => onVariant(index, e.target.value === item.variants![0].value ? undefined : e.target.value)}
                      className="h-7 rounded-md border border-border bg-background px-2 text-caption text-foreground shadow-2xs transition-colors hover:border-primary/40 focus:border-primary focus:outline-hidden"
                    >
                      {item.variants.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {canSchedule && summary ? (
                  <p className={cn("mt-1 text-caption", live ? "text-primary" : "text-warning-foreground")}>
                    <span className="sr-only">Schedule: </span>
                    {summary}
                    {live ? "" : " · not showing now"}
                  </p>
                ) : null}
              </div>

              {/* Actions */}
              <div
                className="flex shrink-0 items-center gap-1"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {canSchedule ? (
                  <button
                    type="button"
                    aria-label={`Schedule ${label}`}
                    aria-expanded={scheduleOpen}
                    aria-controls={`schedule-${item.id}`}
                    disabled={disabled}
                    onClick={() => setScheduling(scheduleOpen ? null : item.id)}
                    className={cn(
                      "rounded-md p-1.5 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30",
                      item.schedule ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Schedule active dates"
                  >
                    <PiCalendarBlankBold className="size-4" />
                  </button>
                ) : null}

                <button
                  type="button"
                  aria-label={`Move ${label} up`}
                  title={`Move up (to position ${index})`}
                  disabled={disabled || index === 0}
                  onClick={() => handleArrowMove(index, index - 1, item.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
                >
                  <PiArrowUpBold className="size-4" />
                </button>

                <button
                  type="button"
                  aria-label={`Move ${label} down`}
                  title={`Move down (to position ${index + 2})`}
                  disabled={disabled || index === items.length - 1}
                  onClick={() => handleArrowMove(index, index + 1, item.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
                >
                  <PiArrowDownBold className="size-4" />
                </button>

                <button
                  type="button"
                  aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
                  title={hidden ? "Show on website" : "Hide from website"}
                  aria-pressed={hidden}
                  disabled={disabled}
                  onClick={() => onToggle(index)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-25",
                    hidden ? "text-muted-foreground hover:text-foreground" : "text-foreground hover:text-primary"
                  )}
                >
                  {hidden ? <PiEyeSlashBold className="size-4" /> : <PiEyeBold className="size-4" />}
                </button>
              </div>
            </div>

            {/* Schedule drawer if scheduling is enabled and open */}
            {canSchedule && scheduleOpen && onSchedule ? (
              <div id={`schedule-${item.id}`} className="mt-2 grid gap-2 border-t border-border pt-2 pl-9 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <label className="text-caption text-muted-foreground">
                  Show from
                  <input
                    type="date"
                    aria-label={`${label}: show from`}
                    value={item.schedule?.from ?? ""}
                    max={item.schedule?.to}
                    disabled={disabled}
                    onChange={(e) => onSchedule(index, { from: e.target.value || undefined })}
                    className="mt-1 block h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
                  />
                </label>
                <label className="text-caption text-muted-foreground">
                  Until
                  <input
                    type="date"
                    aria-label={`${label}: until`}
                    value={item.schedule?.to ?? ""}
                    min={item.schedule?.from}
                    disabled={disabled}
                    onChange={(e) => onSchedule(index, { to: e.target.value || undefined })}
                    className="mt-1 block h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
                  />
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabled || !item.schedule}
                  onClick={() => onSchedule(index, { from: undefined, to: undefined })}
                >
                  Always show
                </Button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
