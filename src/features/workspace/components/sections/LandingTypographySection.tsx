"use client";

import React from "react";
import {
  PiSparkleBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Button, FormField, Select } from "@/components/ui";
import {
  FONT_FAMILY_OPTIONS,
  CARD_STYLE_OPTIONS,
  HEADING_CLASS_OPTIONS,
  HERO_OVERLAY_OPTIONS,
} from "@/constants/workspace.constants";
import { DropdownWithCustomInput } from "../DropdownWithCustomInput";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface LandingTypographySectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  loading?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  watchedValues: WorkspaceSettingsFormValues;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
}

export function LandingTypographySection({
  formId,
  disabled,
  readOnly,
  loading,
  isExpanded,
  onToggle,
  onEdit,
  watchedValues,
  register,
  setValue,
}: LandingTypographySectionProps) {
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
            <h3 className="text-sm font-bold text-foreground">Typography &amp; Styling</h3>
            <p className="text-xs text-muted-foreground truncate">
              Font family, card corner shapes, headings &amp; hero overlay
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
            aria-label={isExpanded ? "Collapse typography" : "Expand typography"}
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
            <FormField label="Font family" htmlFor={`${formId}-font-family`}>
              <DropdownWithCustomInput
                id={`${formId}-font-family`}
                options={FONT_FAMILY_OPTIONS}
                disabled={disabled}
                placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.font_family ?? ""}
                onChange={(v) =>
                  setValue("font_family", v, { shouldDirty: true, shouldValidate: true })
                }
              />
            </FormField>

            <FormField label="Card corners" htmlFor={`${formId}-card-style`}>
              <DropdownWithCustomInput
                id={`${formId}-card-style`}
                options={CARD_STYLE_OPTIONS}
                disabled={disabled}
                placeholder="rounded-2xl"
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.card_style ?? ""}
                onChange={(v) =>
                  setValue("card_style", v, { shouldDirty: true, shouldValidate: true })
                }
              />
            </FormField>

            <FormField label="Heading style" htmlFor={`${formId}-heading-class`}>
              <Select
                id={`${formId}-heading-class`}
                disabled={disabled}
                className="h-9 text-sm"
                {...register("heading_class")}
              >
                {HEADING_CLASS_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Hero overlay" htmlFor={`${formId}-hero-overlay`}>
              <DropdownWithCustomInput
                id={`${formId}-hero-overlay`}
                options={HERO_OVERLAY_OPTIONS}
                disabled={disabled}
                placeholder="linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))"
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm font-mono text-[10px]"
                value={watchedValues.hero_overlay ?? ""}
                onChange={(v) =>
                  setValue("hero_overlay", v, { shouldDirty: true, shouldValidate: true })
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
