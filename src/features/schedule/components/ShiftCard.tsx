"use client";

import React from "react";
import { type Shift } from "@/services/shift.service";
import { PiPencilSimpleBold, PiTrashBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { formatTime, STATUS_STYLES } from "../types";

interface ShiftCardProps {
  shift: Shift;
  canManage: boolean;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

export function ShiftCard({ shift, canManage, onEdit, onDelete }: ShiftCardProps) {
  return (
    <div className="group rounded-lg border border-border/60 bg-muted/30 p-2">
      <div className="flex items-start justify-between gap-1">
        <p className="truncate text-xs font-bold text-foreground">{shift.staffName}</p>
        {canManage && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onEdit(shift)}
              aria-label="Edit shift"
              className="text-muted-foreground hover:text-primary"
            >
              <PiPencilSimpleBold size={11} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(shift)}
              aria-label="Delete shift"
              className="text-muted-foreground hover:text-destructive"
            >
              <PiTrashBold size={11} />
            </button>
          </div>
        )}
      </div>
      <p className="text-caption text-muted-foreground">
        {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
      </p>
      {shift.roleLabel && <p className="text-caption text-muted-foreground">{shift.roleLabel}</p>}
      <span
        className={cn(
          "mt-1 inline-block rounded px-2 py-0.5 text-caption font-bold",
          STATUS_STYLES[shift.status]
        )}
      >
        {shift.status}
      </span>
    </div>
  );
}
