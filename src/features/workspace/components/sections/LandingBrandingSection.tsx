"use client";

import React from "react";
import {
  PiTextAaBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Button, FormField, Input, Select } from "@/shared/components";
import {
  THEME_BADGE_OPTIONS,
  THEME_MARQUEE_OPTIONS,
  HERO_TAGLINE_OPTIONS,
} from "@/constants/workspace.constants";
import { DropdownWithCustomInput } from "../DropdownWithCustomInput";
import type { Currency } from "@/types";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";

export interface LandingBrandingSectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  loading?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  currencies?: Currency[];
  watchedValues: WorkspaceSettingsFormValues;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
}

export function LandingBrandingSection({
  formId,
  disabled,
  readOnly,
  loading,
  isExpanded,
  onToggle,
  onEdit,
  currencies = [],
  watchedValues,
  errors,
  register,
  setValue,
}: LandingBrandingSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
            <PiTextAaBold className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">Text &amp; Content Customisation</h3>
            <p className="text-xs text-muted-foreground truncate">
              Theme alias, currency, promotional badges, marquee strips &amp; hero tagline
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
              <span>Edit text</span>
            </button>
          )}
          <button
            type="button"
            aria-label={isExpanded ? "Collapse text options" : "Expand text options"}
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
            <FormField
              label="Theme alias"
              htmlFor={`${formId}-theme-colour`}
              error={errors.theme_colour?.message}
            >
              <Input
                id={`${formId}-theme-colour`}
                invalid={Boolean(errors.theme_colour)}
                disabled={disabled}
                placeholder="e.g. Modern Bistro"
                className="h-9 text-sm"
                {...register("theme_colour")}
              />
            </FormField>

            {currencies.length > 0 && (
              <FormField label="Website currency" htmlFor={`${formId}-currency`}>
                <Select
                  id={`${formId}-currency`}
                  disabled={disabled}
                  className="h-9 text-sm"
                  {...register("currency_id", {
                    setValueAs: (v) => {
                      if (v === "" || v == null) return null;
                      const n = Number(v);
                      return Number.isNaN(n) ? null : n;
                    },
                  })}
                >
                  <option value="">Select Currency</option>
                  {currencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </Select>
              </FormField>
            )}

            <FormField label="Badge text" htmlFor={`${formId}-theme-badge`}>
              <DropdownWithCustomInput
                id={`${formId}-theme-badge`}
                options={THEME_BADGE_OPTIONS}
                disabled={disabled}
                placeholder="e.g. Curated · Modern · Delicious"
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.theme_badge ?? ""}
                onChange={(v) =>
                  setValue("theme_badge", v, { shouldDirty: true, shouldValidate: true })
                }
              />
            </FormField>

            <FormField label="Marquee strip text" htmlFor={`${formId}-theme-marquee`}>
              <DropdownWithCustomInput
                id={`${formId}-theme-marquee`}
                options={THEME_MARQUEE_OPTIONS}
                disabled={disabled}
                placeholder="e.g. Bento Style · Modern Dining"
                selectClassName="h-9 text-sm"
                inputClassName="h-9 text-sm"
                value={watchedValues.theme_marquee ?? ""}
                onChange={(v) =>
                  setValue("theme_marquee", v, { shouldDirty: true, shouldValidate: true })
                }
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Hero tagline" htmlFor={`${formId}-hero-tagline`}>
                <DropdownWithCustomInput
                  id={`${formId}-hero-tagline`}
                  options={HERO_TAGLINE_OPTIONS}
                  disabled={disabled}
                  placeholder="e.g. Fresh flavours, made with care"
                  selectClassName="h-9 text-sm"
                  inputClassName="h-9 text-sm"
                  value={watchedValues.hero_tagline ?? ""}
                  onChange={(v) =>
                    setValue("hero_tagline", v, { shouldDirty: true, shouldValidate: true })
                  }
                />
              </FormField>
            </div>
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={onToggle}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Done editing text
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
