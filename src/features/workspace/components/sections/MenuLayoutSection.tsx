"use client";

import React from "react";
import { PiSquaresFourBold, PiPencilSimpleBold } from "react-icons/pi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField, Select } from "@/shared/components";
import {
  MENU_LAYOUT_OPTIONS,
  MENU_STRUCTURE_OPTIONS,
} from "@/constants/workspace.constants";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface MenuLayoutSectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  onStartEditing?: (id: string) => void;
}

export function MenuLayoutSection({
  formId,
  disabled,
  readOnly,
  errors,
  register,
  onStartEditing,
}: MenuLayoutSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <PiSquaresFourBold className="size-5" />
          </div>
          <div>
            <h3 className="text-h3 text-foreground">Menu Page Layout</h3>
            <p className="text-caption text-muted-foreground">
              Menu layout style and category navigation structure
            </p>
          </div>
        </div>
        {readOnly && onStartEditing && (
          <button
            type="button"
            onClick={() => onStartEditing("layout")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <PiPencilSimpleBold className="size-3.5 text-primary" />
            <span>Edit layout</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          label="Menu layout"
          htmlFor={`${formId}-menu-layout`}
          error={errors.menu_theme?.message}
        >
          <Select
            id={`${formId}-menu-layout`}
            invalid={Boolean(errors.menu_theme)}
            disabled={disabled}
            className="h-9 text-sm"
            {...register("menu_theme")}
          >
            {MENU_LAYOUT_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Menu structure"
          htmlFor={`${formId}-menu-structure`}
          error={errors.menu_structure?.message}
        >
          <Select
            id={`${formId}-menu-structure`}
            invalid={Boolean(errors.menu_structure)}
            disabled={disabled}
            className="h-9 text-sm"
            {...register("menu_structure")}
          >
            {MENU_STRUCTURE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
    </section>
  );
}
