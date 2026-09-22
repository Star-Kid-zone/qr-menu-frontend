"use client";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiPaletteBold, PiSparkleBold, PiSquaresFourBold } from "react-icons/pi";
import type { Currency } from "@/types";
import {
  LANDING_LAYOUT_OPTIONS,
  LANDING_STRUCTURE_OPTIONS,
  MENU_LAYOUT_OPTIONS,
  MENU_STRUCTURE_OPTIONS,
  WORKSPACE_COLOR_FIELDS,
  WORKSPACE_EXTENDED_COLOR_FIELDS,
  MENU_COLOR_FIELDS,
  MENU_EXTENDED_COLOR_FIELDS,
  WORKSPACE_TOGGLE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  CARD_STYLE_OPTIONS,
  HEADING_CLASS_OPTIONS,
  HERO_OVERLAY_OPTIONS,
  THEME_BADGE_OPTIONS,
  THEME_MARQUEE_OPTIONS,
  HERO_TAGLINE_OPTIONS,
} from "@/constants/workspace.constants";
import { DropdownWithCustomInput } from "@/components/admin/workspace/DropdownWithCustomInput";
import { getTemplatePalette } from "@/constants/templatePalettes";
import { workspaceSettingsSchema } from "@/schemas/workspace.schema";
import type {
  WorkspacePalette,
  WorkspaceSettingsFormValues,
  WorkspaceToggleKey,
} from "@/types/workspace.types";
import {
  FormField,
  Input,
  Select,
  ToggleCard,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import { WorkspaceSettingsFormProps } from "@/types/components/admin/workspace/WorkspaceSettingsForm.types";

export function WorkspaceSettingsForm({
  formId,
  isOpen,
  initialValues,
  onSubmit,
  error,
  loading = false,
  currencies = [],
  showPalettePresets = true,
  readOnly = false,
  compact = false,
  section,
  onValuesChange,
}: WorkspaceSettingsFormProps & { section?: "landing" | "menu" }) {
  const disabled = loading || readOnly;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkspaceSettingsFormValues>({
    resolver: zodResolver(workspaceSettingsSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(initialValues);
    }
  }, [initialValues, isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      reset(initialValues);
    }
  }, [isOpen, initialValues, reset]);

  const watchedValues = useWatch({ control }) ?? initialValues;

  useEffect(() => {
    if (isOpen) onValuesChange?.(watchedValues as WorkspaceSettingsFormValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, isOpen]);

  const applyTemplatePalette = (palette: WorkspacePalette) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    setValue("theme_colour",    palette.alias,     opts);
    setValue("primary_color",   palette.primary,   opts);
    setValue("secondary_color", palette.secondary, opts);
    setValue("accent_color",    palette.accent,    opts);
    if (palette.textPrimary)        setValue("text_primary_color",   palette.textPrimary,   opts);
    if (palette.textSecondary)      setValue("text_secondary_color", palette.textSecondary, opts);
    if (palette.accentText)         setValue("accent_text_color",    palette.accentText,    opts);
    if (palette.borderColor)        setValue("border_color",         palette.borderColor,   opts);
    if (palette.footerBg)           setValue("footer_bg_color",      palette.footerBg,      opts);
    if (palette.sectionBg)          setValue("section_bg_color",     palette.sectionBg,     opts);
    if (palette.fontFamily)         setValue("font_family",          palette.fontFamily,    opts);
    if (palette.cardStyle)          setValue("card_style",           palette.cardStyle,     opts);
    if (palette.heroOverlay)        setValue("hero_overlay",         palette.heroOverlay,   opts);
    if (palette.badge != null)      setValue("theme_badge",          palette.badge,         opts);
    if (palette.marqueeText != null) setValue("theme_marquee",       palette.marqueeText,   opts);
    if (palette.headingClass != null) setValue("heading_class",      palette.headingClass,  opts);
    if (palette.heroTagline != null) setValue("hero_tagline",        palette.heroTagline,   opts);
  };

  const applyMenuTemplatePalette = (palette: WorkspacePalette) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    if (palette.primary)       setValue("menu_primary_color",        palette.primary,       opts);
    if (palette.secondary)     setValue("menu_secondary_color",      palette.secondary,     opts);
    if (palette.accent)        setValue("menu_accent_color",         palette.accent,        opts);
    if (palette.textPrimary)   setValue("menu_text_primary_color",   palette.textPrimary,   opts);
    if (palette.textSecondary) setValue("menu_text_secondary_color", palette.textSecondary, opts);
    if (palette.accentText)    setValue("menu_accent_text_color",    palette.accentText,    opts);
    if (palette.borderColor)   setValue("menu_border_color",         palette.borderColor,   opts);
    if (palette.footerBg)      setValue("menu_footer_bg_color",      palette.footerBg,      opts);
    if (palette.sectionBg)     setValue("menu_section_bg_color",     palette.sectionBg,     opts);
    if (palette.fontFamily)    setValue("menu_font_family",          palette.fontFamily,    opts);
    if (palette.cardStyle)     setValue("menu_card_style",           palette.cardStyle,     opts);
  };

  const landingTheme = watchedValues.landing_theme as string | undefined;
  const menuTheme    = watchedValues.menu_theme    as string | undefined;
  const prevLandingThemeRef = useRef<string | undefined>(undefined);
  const prevMenuThemeRef    = useRef<string | undefined>(undefined);

  useEffect(() => {
    prevLandingThemeRef.current = undefined;
    prevMenuThemeRef.current    = undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (prevLandingThemeRef.current === undefined) {
      prevLandingThemeRef.current = landingTheme;
      return;
    }
    if (prevLandingThemeRef.current === landingTheme) return;
    prevLandingThemeRef.current = landingTheme;
    const palette = getTemplatePalette(landingTheme ?? "");
    if (!palette) return;
    applyTemplatePalette(palette);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingTheme, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (prevMenuThemeRef.current === undefined) {
      prevMenuThemeRef.current = menuTheme;
      return;
    }
    if (prevMenuThemeRef.current === menuTheme) return;
    prevMenuThemeRef.current = menuTheme;
    const palette = getTemplatePalette(menuTheme ?? "");
    if (!palette) return;
    applyMenuTemplatePalette(palette);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuTheme, isOpen]);

  const cardClass = cn(
    "space-y-4 border border-border bg-card",
    compact ? "rounded-xl p-4" : "rounded-[2rem] p-6",
  );
  // CSS multi-column instead of a two-column grid: the browser balances section
  // heights across columns automatically, so the shorter column never trails
  // off with a block of empty space under it (which a manual grid-cols-2 split
  // would, whenever the two columns' section heights don't happen to match).
  const layoutGridClass = cn(
    "columns-1 lg:columns-2",
    compact ? "gap-4" : "gap-6",
  );
  const layoutSectionClass = "mb-4 break-inside-avoid";

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        void handleSubmit(onSubmit)(e);
      }}
      className={cn("py-0", compact ? "space-y-4" : "space-y-6")}
    >

      {/* ── LANDING PAGE DESIGN ───────────────────────────────────────────── */}
      {(!section || section === "landing") && (
      <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground px-1">Landing Page Design</p>

        <div className={layoutGridClass}>
            {/* Brand palette — hidden, keeping only Layout visible for now
            <section className={cn("space-y-4 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary"><PiPaletteBold className="size-5" /></div>
                <div>
                  <h3 className="text-h3 text-foreground">Brand palette</h3>
                  <p className="text-caption text-muted-foreground">Primary, secondary &amp; accent</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WORKSPACE_COLOR_FIELDS.map((color) => (
                  <div key={color.name} className="space-y-1 rounded-xl border border-border bg-background p-2.5">
                    <FormField label={color.label} htmlFor={`${formId}-${color.name}`} error={errors[color.name]?.message}>
                      <div className="flex items-center gap-2">
                        <input id={`${formId}-${color.name}`} type="color" aria-label={`${color.label} picker`} className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1" disabled={disabled} value={watchedValues[color.name]} onChange={(e) => setValue(color.name, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                        <Input aria-label={`${color.label} hex`} invalid={Boolean(errors[color.name])} className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2" disabled={disabled} value={watchedValues[color.name]} onChange={(e) => setValue(color.name, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                      </div>
                    </FormField>
                  </div>
                ))}
              </div>
              {showPalettePresets ? (() => {
                const tp = getTemplatePalette(landingTheme ?? "");
                return tp ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-5 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                        <div className="flex-1" style={{ backgroundColor: tp.primary }} />
                        <div className="flex-1" style={{ backgroundColor: tp.secondary }} />
                        <div className="flex-1" style={{ backgroundColor: tp.accent }} />
                      </div>
                      <span className="text-caption font-semibold text-muted-foreground truncate">{tp.name} defaults</span>
                    </div>
                    <button type="button" disabled={disabled} onClick={() => applyTemplatePalette(tp)} className="shrink-0 rounded-lg border border-border bg-background px-3 py-1 text-caption font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50">Reset to defaults</button>
                  </div>
                ) : null;
              })() : null}
            </section>

            <section className={cn("space-y-4 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary"><PiPaletteBold className="size-5" /></div>
                <div>
                  <h3 className="text-h3 text-foreground">Extended colours</h3>
                  <p className="text-caption text-muted-foreground">Text, borders &amp; backgrounds</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WORKSPACE_EXTENDED_COLOR_FIELDS.map((color) => (
                  <div key={color.name} className="space-y-1 rounded-xl border border-border bg-background p-2.5">
                    <FormField label={color.label} htmlFor={`${formId}-${color.name}`} error={errors[color.name as keyof typeof errors]?.message}>
                      <div className="flex items-center gap-2">
                        <input id={`${formId}-${color.name}`} type="color" aria-label={`${color.label} picker`} className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1" disabled={disabled} value={watchedValues[color.name as keyof typeof watchedValues] as string} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                        <Input aria-label={`${color.label} hex`} invalid={Boolean(errors[color.name as keyof typeof errors])} className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2" disabled={disabled} value={watchedValues[color.name as keyof typeof watchedValues] as string} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                      </div>
                    </FormField>
                  </div>
                ))}
              </div>
            </section>
            */}

            <section className={cn("space-y-3 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <PiSquaresFourBold className="size-5 text-primary" />
                <h3 className="text-h3 text-foreground">Layout</h3>
              </div>
              <FormField label="Landing layout" htmlFor={`${formId}-landing-layout`} error={errors.landing_theme?.message}>
                <Select id={`${formId}-landing-layout`} invalid={Boolean(errors.landing_theme)} disabled={disabled} className="h-9 text-sm" {...register("landing_theme")}>
                  {LANDING_LAYOUT_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
              </FormField>
              <FormField label="Page structure" htmlFor={`${formId}-landing-structure`} error={errors.landing_structure?.message}>
                <Select id={`${formId}-landing-structure`} invalid={Boolean(errors.landing_structure)} disabled={disabled} className="h-9 text-sm" {...register("landing_structure")}>
                  {LANDING_STRUCTURE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </FormField>
              <FormField label="Loading screen" htmlFor={`${formId}-loading-layout`} error={errors.loading_screen_theme?.message}>
                <Select id={`${formId}-loading-layout`} invalid={Boolean(errors.loading_screen_theme)} disabled={disabled} className="h-9 text-sm" {...register("loading_screen_theme")}>
                  <option value="minimal">Minimalist - Clean spinner</option>
                  <option value="branded">Branded - Logo &amp; Primary color</option>
                  <option value="skeleton">Skeleton - Content placeholders</option>
                </Select>
              </FormField>
            </section>

            {/* Typography & style, Text customisation — hidden, keeping only Layout visible for now
            <section className={cn("space-y-3 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <PiSparkleBold className="size-5 text-primary" />
                <div>
                  <h3 className="text-h3 text-foreground">Typography &amp; style</h3>
                  <p className="text-caption text-muted-foreground">Font, card shape &amp; hero overlay</p>
                </div>
              </div>
              <FormField label="Font family" htmlFor={`${formId}-font-family`}>
                <DropdownWithCustomInput
                  id={`${formId}-font-family`}
                  options={FONT_FAMILY_OPTIONS}
                  disabled={disabled}
                  placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                  selectClassName="h-9 text-sm"
                  inputClassName="h-9 text-sm"
                  value={watchedValues.font_family ?? ""}
                  onChange={(v) => setValue("font_family", v, { shouldDirty: true, shouldValidate: true })}
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
                  onChange={(v) => setValue("card_style", v, { shouldDirty: true, shouldValidate: true })}
                />
              </FormField>
              <FormField label="Heading style" htmlFor={`${formId}-heading-class`}>
                <Select id={`${formId}-heading-class`} disabled={disabled} className="h-9 text-sm" {...register("heading_class")}>
                  {HEADING_CLASS_OPTIONS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
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
                  onChange={(v) => setValue("hero_overlay", v, { shouldDirty: true, shouldValidate: true })}
                />
              </FormField>
            </section>

            <section className={cn("space-y-3 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <PiSparkleBold className="size-5 text-primary" />
                <h3 className="text-h3 text-foreground">Text customisation</h3>
              </div>
              <FormField label="Theme alias" htmlFor={`${formId}-theme-colour`} error={errors.theme_colour?.message}>
                <Input id={`${formId}-theme-colour`} invalid={Boolean(errors.theme_colour)} disabled={disabled} placeholder="e.g. Modern Bistro" className="h-9 text-sm" {...register("theme_colour")} />
              </FormField>
              {currencies.length > 0 && (
                <FormField label="Website currency" htmlFor={`${formId}-currency`}>
                  <Select id={`${formId}-currency`} disabled={disabled} className="h-9 text-sm" {...register("currency_id", { setValueAs: (v) => { if (v === "" || v == null) return null; const n = Number(v); return Number.isNaN(n) ? null : n; } })}>
                    <option value="">Select Currency</option>
                    {currencies.map((c) => <option key={c.id} value={c.id}>{c.code} ({c.symbol})</option>)}
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
                  onChange={(v) => setValue("theme_badge", v, { shouldDirty: true, shouldValidate: true })}
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
                  onChange={(v) => setValue("theme_marquee", v, { shouldDirty: true, shouldValidate: true })}
                />
              </FormField>
              <FormField label="Hero tagline" htmlFor={`${formId}-hero-tagline`}>
                <DropdownWithCustomInput
                  id={`${formId}-hero-tagline`}
                  options={HERO_TAGLINE_OPTIONS}
                  disabled={disabled}
                  placeholder="e.g. Fresh flavours, made with care"
                  selectClassName="h-9 text-sm"
                  inputClassName="h-9 text-sm"
                  value={watchedValues.hero_tagline ?? ""}
                  onChange={(v) => setValue("hero_tagline", v, { shouldDirty: true, shouldValidate: true })}
                />
              </FormField>
            </section>
            */}
        </div>

        {/* ── VISIBILITY ────────────────────────────────────────────────────── */}
        {/* Visibility — hidden, keeping only Layout visible for now
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <PiSparkleBold className="size-5 text-primary" />
            <h3 className="text-h3 text-foreground">Visibility</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {WORKSPACE_TOGGLE_OPTIONS.filter((t) => t.id !== "announcement_enabled").map((toggle) => (
              <ToggleCard key={toggle.id} checked={Boolean(watchedValues[toggle.id])} onChange={(checked) => setValue(toggle.id as WorkspaceToggleKey, checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true })} label={toggle.label} disabled={disabled} className="p-2.5" />
            ))}
          </div>
        </section>
        */}
      </div>
      )}

      {/* ── MENU PAGE DESIGN ──────────────────────────────────────────────── */}
      {section === "menu" && (
      <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground px-1">Menu Page Design</p>

        <div className={layoutGridClass}>
            {/* Brand palette — hidden, keeping only Layout visible for now
            <section className={cn("space-y-4 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary"><PiPaletteBold className="size-5" /></div>
                <div>
                  <h3 className="text-h3 text-foreground">Brand palette</h3>
                  <p className="text-caption text-muted-foreground">Primary, secondary &amp; accent</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MENU_COLOR_FIELDS.map((color) => (
                  <div key={color.name} className="space-y-1 rounded-xl border border-border bg-background p-2.5">
                    <FormField label={color.label} htmlFor={`${formId}-${color.name}`} error={errors[color.name as keyof typeof errors]?.message}>
                      <div className="flex items-center gap-2">
                        <input id={`${formId}-${color.name}`} type="color" aria-label={`${color.label} picker`} className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1" disabled={disabled} value={(watchedValues[color.name as keyof typeof watchedValues] as string) || '#000000'} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                        <Input aria-label={`${color.label} hex`} invalid={Boolean(errors[color.name as keyof typeof errors])} className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2" disabled={disabled} value={(watchedValues[color.name as keyof typeof watchedValues] as string) || ''} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                      </div>
                    </FormField>
                  </div>
                ))}
              </div>
              {(() => {
                const mp = getTemplatePalette(menuTheme ?? "");
                return mp ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-5 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                        <div className="flex-1" style={{ backgroundColor: mp.primary }} />
                        <div className="flex-1" style={{ backgroundColor: mp.secondary }} />
                        <div className="flex-1" style={{ backgroundColor: mp.accent }} />
                      </div>
                      <span className="text-caption font-semibold text-muted-foreground truncate">{mp.name} defaults</span>
                    </div>
                    <button type="button" disabled={disabled} onClick={() => applyMenuTemplatePalette(mp)} className="shrink-0 rounded-lg border border-border bg-background px-3 py-1 text-caption font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50">Reset to defaults</button>
                  </div>
                ) : null;
              })()}
            </section>

            <section className={cn("space-y-4 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary"><PiPaletteBold className="size-5" /></div>
                <div>
                  <h3 className="text-h3 text-foreground">Extended colours</h3>
                  <p className="text-caption text-muted-foreground">Text, borders &amp; backgrounds</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MENU_EXTENDED_COLOR_FIELDS.map((color) => (
                  <div key={color.name} className="space-y-1 rounded-xl border border-border bg-background p-2.5">
                    <FormField label={color.label} htmlFor={`${formId}-${color.name}`} error={errors[color.name as keyof typeof errors]?.message}>
                      <div className="flex items-center gap-2">
                        <input id={`${formId}-${color.name}`} type="color" aria-label={`${color.label} picker`} className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1" disabled={disabled} value={(watchedValues[color.name as keyof typeof watchedValues] as string) || '#000000'} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                        <Input aria-label={`${color.label} hex`} invalid={Boolean(errors[color.name as keyof typeof errors])} className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2" disabled={disabled} value={(watchedValues[color.name as keyof typeof watchedValues] as string) || ''} onChange={(e) => setValue(color.name as any, e.target.value, { shouldDirty: true, shouldValidate: true })} />
                      </div>
                    </FormField>
                  </div>
                ))}
              </div>
            </section>
            */}

            <section className={cn("space-y-3 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <PiSquaresFourBold className="size-5 text-primary" />
                <h3 className="text-h3 text-foreground">Layout</h3>
              </div>
              <FormField label="Menu layout" htmlFor={`${formId}-menu-layout`} error={errors.menu_theme?.message}>
                <Select id={`${formId}-menu-layout`} invalid={Boolean(errors.menu_theme)} disabled={disabled} className="h-9 text-sm" {...register("menu_theme")}>
                  {MENU_LAYOUT_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
              </FormField>
              <FormField label="Menu structure" htmlFor={`${formId}-menu-structure`} error={errors.menu_structure?.message}>
                <Select id={`${formId}-menu-structure`} invalid={Boolean(errors.menu_structure)} disabled={disabled} className="h-9 text-sm" {...register("menu_structure")}>
                  {MENU_STRUCTURE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </FormField>
            </section>

            {/* Typography & style — hidden, keeping only Layout visible for now
            <section className={cn("space-y-3 rounded-2xl border border-border bg-card p-4", layoutSectionClass)}>
              <div className="flex items-center gap-3">
                <PiSparkleBold className="size-5 text-primary" />
                <div>
                  <h3 className="text-h3 text-foreground">Typography &amp; style</h3>
                  <p className="text-caption text-muted-foreground">Font &amp; card shape</p>
                </div>
              </div>
              <FormField label="Font family" htmlFor={`${formId}-menu-font-family`}>
                <DropdownWithCustomInput
                  id={`${formId}-menu-font-family`}
                  options={FONT_FAMILY_OPTIONS}
                  disabled={disabled}
                  placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                  selectClassName="h-9 text-sm"
                  inputClassName="h-9 text-sm"
                  value={watchedValues.menu_font_family ?? ""}
                  onChange={(v) => setValue("menu_font_family", v, { shouldDirty: true, shouldValidate: true })}
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
                  onChange={(v) => setValue("menu_card_style", v, { shouldDirty: true, shouldValidate: true })}
                />
              </FormField>
            </section>
            */}
        </div>
      </div>
      )}

      {/* Managed on the Banners tab; keep registered so workspace saves still send current values */}
      <div className="hidden" aria-hidden="true">
        <input type="checkbox" {...register("announcement_enabled")} />
        <textarea {...register("announcement_text")} />
      </div>
    </form>
  );
}
