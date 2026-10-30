"use client";

import React from "react";
import {
  PiSparkleBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import type { UseFormSetValue } from "react-hook-form";
import { Button, FormField } from "@/components/ui";
import {
  FONT_FAMILY_OPTIONS,
  CARD_STYLE_OPTIONS,
} from "@/constants/workspace.constants";
import { DropdownWithCustomInput } from "../DropdownWithCustomInput";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface MenuTypographySectionProps {
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

export function MenuTypographySection({
  formId,
  disabled,
  readOnly,
  loading,
  isExpanded,
  onToggle,
  onEdit,
  watchedValues,
  setValue,
}: MenuTypographySectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
            <PiSparkleBold className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">Menu Typography &amp; Styling</h3>
            <p className="text-xs text-muted-foreground truncate">
              Font family &amp; item card corners for dishes
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
              <span>Edit typography</span>
            </button>
          )}
          <button
            type="button"
            aria-label={isExpanded ? "Collapse menu typography" : "Expand menu typography"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Font family" htmlFor={`${formId}-menu-font-family`}>
              <DropdownWithCustomInput
                id={`${formId}-menu-font-family`}
                options={FONT_FAMILY_OPTIONS}
                disabled={disabled}
                placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.menu_font_family ?? ""}
                onChange={(v) =>
                  setValue("menu_font_family", v, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>

            <FormField label="Card corners" htmlFor={`${formId}-menu-card-style`}>
              <DropdownWithCustomInput
                id={`${formId}-menu-card-style`}
                options={CARD_STYLE_OPTIONS}
                disabled={disabled}
                placeholder="rounded-2xl"
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.menu_card_style ?? ""}
                onChange={(v) =>
                  setValue("menu_card_style", v, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={onToggle}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Done editing typography
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
