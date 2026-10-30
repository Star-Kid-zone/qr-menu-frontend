"use client";

import React from "react";
import {
  PiPaletteBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import { Button, FormField, Input } from "@/components/ui";
import {
  WORKSPACE_COLOR_FIELDS,
  WORKSPACE_EXTENDED_COLOR_FIELDS,
} from "@/constants/workspace.constants";
import { getTemplatePalette } from "@/constants/templatePalettes";
import type {
  WorkspacePalette,
  WorkspaceSettingsFormValues,
} from "@/types/workspace.types";

export interface LandingPaletteSectionProps {
  formId: string;
  disabled: boolean;
  readOnly?: boolean;
  loading?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  showPalettePresets?: boolean;
  landingTheme?: string;
  watchedValues: WorkspaceSettingsFormValues;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
  applyTemplatePalette: (palette: WorkspacePalette) => void;
}

export function LandingPaletteSection({
  formId,
  disabled,
  readOnly,
  loading,
  isExpanded,
  onToggle,
  onEdit,
  showPalettePresets = true,
  landingTheme,
  watchedValues,
  errors,
  setValue,
  applyTemplatePalette,
}: LandingPaletteSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
            <PiPaletteBold className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">
              Brand &amp; Extended Palette
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              Primary, secondary, accent, borders &amp; background shades
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
              <span>Edit colors</span>
            </button>
          )}
          <button
            type="button"
            aria-label={isExpanded ? "Collapse palette" : "Expand palette"}
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
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Core Brand Colors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {WORKSPACE_COLOR_FIELDS.map((color) => (
                <div
                  key={color.name}
                  className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                >
                  <FormField
                    label={color.label}
                    htmlFor={`${formId}-${color.name}`}
                    error={errors[color.name]?.message}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        id={`${formId}-${color.name}`}
                        type="color"
                        aria-label={`${color.label} picker`}
                        className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                        disabled={disabled}
                        value={watchedValues[color.name]}
                        onChange={(e) =>
                          setValue(color.name, e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <Input
                        aria-label={`${color.label} hex`}
                        invalid={Boolean(errors[color.name])}
                        className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                        disabled={disabled}
                        value={watchedValues[color.name]}
                        onChange={(e) =>
                          setValue(color.name, e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </FormField>
                </div>
              ))}
            </div>
          </div>

          {showPalettePresets ? (() => {
            const tp = getTemplatePalette(landingTheme ?? "");
            return tp ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-5 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                    <div className="flex-1" style={{ backgroundColor: tp.primary }} />
                    <div className="flex-1" style={{ backgroundColor: tp.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: tp.accent }} />
                  </div>
                  <span className="text-caption font-semibold text-muted-foreground truncate">
                    {tp.name} template default palette
                  </span>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => applyTemplatePalette(tp)}
                  className="shrink-0 rounded-lg border border-border bg-background px-3 py-1 text-caption font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50 transition-colors"
                >
                  Reset to defaults
                </button>
              </div>
            ) : null;
          })() : null}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Extended Colors (Text, Borders &amp; Backgrounds)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {WORKSPACE_EXTENDED_COLOR_FIELDS.map((color) => (
                <div
                  key={color.name}
                  className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                >
                  <FormField
                    label={color.label}
                    htmlFor={`${formId}-${color.name}`}
                    error={errors[color.name as keyof typeof errors]?.message}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        id={`${formId}-${color.name}`}
                        type="color"
                        aria-label={`${color.label} picker`}
                        className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                        disabled={disabled}
                        value={watchedValues[color.name as keyof typeof watchedValues] as string}
                        onChange={(e) =>
                          setValue(color.name as any, e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <Input
                        aria-label={`${color.label} hex`}
                        invalid={Boolean(errors[color.name as keyof typeof errors])}
                        className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                        disabled={disabled}
                        value={watchedValues[color.name as keyof typeof watchedValues] as string}
                        onChange={(e) =>
                          setValue(color.name as any, e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </FormField>
                </div>
              ))}
            </div>
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={onToggle}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Done editing colors
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
