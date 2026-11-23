"use client";

import React from "react";
import { type Shift } from "@/services/shift.service";
import { PiPlusBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { DAY_LABELS } from "@/constants/schedule.constants";
import { toIsoDate } from "../schedule.utils";
import { ShiftCard } from "./ShiftCard";

interface DayColumnProps {
  day: Date;
  dayIndex: number;
  shifts: Shift[];
  canManage: boolean;
  onAddShift: (isoDate: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shift: Shift) => void;
}

export function DayColumn({
  day,
  dayIndex,
  shifts,
  canManage,
  onAddShift,
  onEditShift,
  onDeleteShift,
}: DayColumnProps) {
  const iso = toIsoDate(day);
  const isToday = iso === toIsoDate(new Date());

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3 shadow-sm",
        isToday ? "border-primary/40" : "border-border"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-caption font-bold text-muted-foreground">
            {DAY_LABELS[dayIndex]}
          </p>
          <p className={cn("text-sm font-bold", isToday ? "text-primary" : "text-foreground")}>
            {day.getDate()}
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => onAddShift(iso)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Add shift on ${iso}`}
          >
            <PiPlusBold size={12} />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {shifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            canManage={canManage}
            onEdit={onEditShift}
            onDelete={onDeleteShift}
          />
        ))}
      </div>
    </div>
  );
}
