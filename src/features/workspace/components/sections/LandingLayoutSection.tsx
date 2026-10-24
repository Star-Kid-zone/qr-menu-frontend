"use client";

import React from "react";
import { PiSquaresFourBold, PiPencilSimpleBold } from "react-icons/pi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField, Select } from "@/shared/components";
import {
  LANDING_LAYOUT_OPTIONS,
  LANDING_STRUCTURE_OPTIONS,
} from "@/constants/workspace.constants";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface LandingLayoutSectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  onStartEditing?: (id: string) => void;
}

export function LandingLayoutSection({
  formId,
  disabled,
  readOnly,
  errors,
  register,
  onStartEditing,
}: LandingLayoutSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <PiSquaresFourBold className="size-5" />
          </div>
          <div>
            <h3 className="text-h3 text-foreground">Landing Page Layout</h3>
            <p className="text-caption text-muted-foreground">
              Core template, page structure, and loading style
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField
          label="Landing layout"
          htmlFor={`${formId}-landing-layout`}
          error={errors.landing_theme?.message}
        >
          <Select
            id={`${formId}-landing-layout`}
            invalid={Boolean(errors.landing_theme)}
            disabled={disabled}
            className="h-9 text-sm"
            {...register("landing_theme")}
          >
            {LANDING_LAYOUT_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Page structure"
          htmlFor={`${formId}-landing-structure`}
          error={errors.landing_structure?.message}
        >
          <Select
            id={`${formId}-landing-structure`}
            invalid={Boolean(errors.landing_structure)}
            disabled={disabled}
            className="h-9 text-sm"
            {...register("landing_structure")}
          >
            {LANDING_STRUCTURE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Loading screen"
          htmlFor={`${formId}-loading-layout`}
          error={errors.loading_screen_theme?.message}
        >
          <Select
            id={`${formId}-loading-layout`}
            invalid={Boolean(errors.loading_screen_theme)}
            disabled={disabled}
            className="h-9 text-sm"
            {...register("loading_screen_theme")}
          >
            <option value="minimal">Minimalist - Clean spinner</option>
            <option value="branded">Branded - Logo &amp; Primary color</option>
            <option value="skeleton">Skeleton - Content placeholders</option>
          </Select>
        </FormField>
      </div>
    </section>
  );
}
