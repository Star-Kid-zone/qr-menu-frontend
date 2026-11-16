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

export interface OrderableItem {
  id: string;
  label: string;
  description?: string;
  hidden: boolean;
  schedule?: SectionSchedule;
  /** Alternative designs; when given, a picker is shown. The first is the default. */
  variants?: readonly SectionVariant[];
  variant?: string;
}

export interface OrderableListProps {
  items: readonly OrderableItem[];
  ariaLabel: string;
  disabled: boolean;
  onMove: (from: number, to: number) => void;
  onToggle: (index: number) => void;
  onSchedule: (index: number, patch: SectionSchedule) => void;
  /** Pick a design; `undefined` means the default (first) variant. */
  onVariant?: (index: number, variant: string | undefined) => void;
}

/**
 * Reorderable rows with show/hide and an optional date window. Drag a row, or
 * use the arrow buttons (keyboard and touch). Shared by the landing Sections
 * panel and the menu Categories panel.
 */
export function OrderableList({ items, ariaLabel, disabled, onMove, onToggle, onSchedule, onVariant }: OrderableListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [scheduling, setScheduling] = useState<string | null>(null);
  const today = todayIn(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <ol aria-label={ariaLabel} className="space-y-1.5">
      {items.map((item, index) => {
        const { label, hidden } = item;
        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;
        const scheduleOpen = scheduling === item.id;
        const summary = scheduleSummary(item.schedule, today);
        const live = isScheduledOn(item, today);
        return (
          <li
            key={item.id}
            // Not draggable while its date fields are open, so picking a date doesn't start a drag.
            draggable={!disabled && !scheduleOpen}
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              setOverIndex(index);
            }}
            onDragLeave={() => setOverIndex((o) => (o === index ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== index) onMove(dragIndex, index);
              endDrag();
            }}
            onDragEnd={endDrag}
            className={cn(
              "rounded-lg border bg-card px-2 py-2 transition-colors",
              isOver ? "border-primary ring-1 ring-primary" : "border-border",
              dragIndex === index && "opacity-50",
              hidden && "bg-muted/40"
            )}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("shrink-0 text-muted-foreground", disabled ? "opacity-40" : "cursor-grab active:cursor-grabbing")}
              >
                <PiDotsSixVerticalBold className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className={cn("text-body-medium truncate", hidden ? "text-muted-foreground line-through" : "text-foreground")}>
                  {label}
                </p>
                {item.description ? <p className="truncate text-caption text-muted-foreground">{item.description}</p> : null}
                {item.variants && item.variants.length > 1 && onVariant ? (
                  <label className="mt-1 flex items-center gap-2 text-caption text-muted-foreground">
                    Design
                    <select
                      aria-label={`${label} design`}
                      value={item.variant ?? item.variants[0].value}
                      disabled={disabled}
                      onChange={(e) => onVariant(index, e.target.value === item.variants![0].value ? undefined : e.target.value)}
                      className="h-7 rounded-md border border-border bg-background px-1.5 text-caption text-foreground"
                    >
                      {item.variants.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                {summary ? (
                  <p className={cn("text-caption", live ? "text-primary" : "text-warning-foreground")}>
                    <span className="sr-only">Schedule: </span>
                    {summary}
                    {live ? "" : " · not showing now"}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={`Schedule ${label}`}
                  aria-expanded={scheduleOpen}
                  aria-controls={`schedule-${item.id}`}
                  disabled={disabled}
                  onClick={() => setScheduling(scheduleOpen ? null : item.id)}
                  className={cn(
                    "rounded-md p-1.5 hover:bg-muted disabled:pointer-events-none disabled:opacity-30",
                    item.schedule ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PiCalendarBlankBold className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${label} up`}
                  disabled={disabled || index === 0}
                  onClick={() => onMove(index, index - 1)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  <PiArrowUpBold className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${label} down`}
                  disabled={disabled || index === items.length - 1}
                  onClick={() => onMove(index, index + 1)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  <PiArrowDownBold className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
                  aria-pressed={hidden}
                  disabled={disabled}
                  onClick={() => onToggle(index)}
                  className={cn(
                    "rounded-md p-1.5 hover:bg-muted disabled:pointer-events-none disabled:opacity-30",
                    hidden ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {hidden ? <PiEyeSlashBold className="size-4" /> : <PiEyeBold className="size-4" />}
                </button>
              </div>
            </div>

            {scheduleOpen ? (
              <div id={`schedule-${item.id}`} className="mt-2 grid gap-2 border-t border-border pt-2 pl-7 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
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
