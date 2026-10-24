"use client";

import React from "react";
import {
  PiEyeBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import type { UseFormSetValue } from "react-hook-form";
import { Button, ToggleCard } from "@/shared/components";
import { WORKSPACE_TOGGLE_OPTIONS } from "@/constants/workspace.constants";
import type {
  WorkspaceSettingsFormValues,
  WorkspaceToggleKey,
} from "@/types/workspace.types";

export interface LandingVisibilitySectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  loading?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  watchedValues: WorkspaceSettingsFormValues;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
}

export function LandingVisibilitySection({
  formId,
  disabled,
  readOnly,
  loading,
  isExpanded,
  onToggle,
  onEdit,
  watchedValues,
  setValue,
}: LandingVisibilitySectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
            <PiEyeBold className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">Section Visibility</h3>
            <p className="text-xs text-muted-foreground truncate">
              Turn on or off landing page action buttons and promotional sections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {readOnly && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <PiPencilSimpleBold className="size-3.5 text-primary" />
              <span>Edit visibility</span>
            </button>
          )}
          <button
            type="button"
            aria-label={isExpanded ? "Collapse visibility" : "Expand visibility"}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <PiCaretUpBold className="size-4" />
            ) : (
              <PiCaretDownBold className="size-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {WORKSPACE_TOGGLE_OPTIONS.filter((t) => t.id !== "announcement_enabled").map(
              (toggle) => (
                <ToggleCard
                  key={toggle.id}
                  checked={Boolean(watchedValues[toggle.id])}
                  onChange={(checked) =>
                    setValue(toggle.id as WorkspaceToggleKey, checked, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                  label={toggle.label}
                  disabled={disabled}
                  className="p-3 shadow-2xs"
                />
              )
            )}
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={onToggle}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Done editing visibility
              </button>
              <Button size="sm" type="submit" form={formId} loading={loading}>
                Save changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
