"use client";

import React, { useState } from "react";
import { PiArrowCounterClockwiseBold, PiCursorClickBold, PiPlusBold } from "react-icons/pi";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { CARD_STYLE_OPTIONS, CUSTOM_OPTION_VALUE, FONT_FAMILY_OPTIONS } from "@/constants/workspace.constants";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";
import {
  MENU_COLOUR_THEMES,
  findActiveTheme,
  swatchOptions,
  type ColourRole,
  type RoleFieldMap,
} from "../menuThemes";

const sameColour = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/* ── Layout tiles ─────────────────────────────────────────────────────────── */

/** Rects are [x, y, w, h] in a 40×28 box. */
export type Glyphs = Record<string, number[][]>;

export function StructureGlyph({ glyphs, id, active }: { glyphs: Glyphs; id: string; active: boolean }) {
  return (
    <svg viewBox="0 0 40 28" className="h-7 w-10 shrink-0" aria-hidden="true">
      {(glyphs[id] ?? glyphs[""] ?? []).map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={1.5}
          className={active ? "fill-primary" : "fill-muted-foreground/40"}
        />
      ))}
    </svg>
  );
}

/** A radio group of small wireframe tiles, bound to a form field. */
export function StructureTiles({
  label,
  field,
  options,
  glyphs,
  value,
  register,
  disabled,
}: {
  label: string;
  field: "menu_structure" | "landing_structure";
  options: readonly { value: string; label: string }[];
  glyphs: Glyphs;
  value: string;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  disabled: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2 lg:grid-cols-3">
      {options.map((o) => {
        const selected = value === o.value;
        const [title, blurb] = o.label.split(" — ");
        return (
          <label
            key={o.value || "default"}
            title={blurb}
            className={cn(
              "relative flex cursor-pointer items-center gap-2 rounded-xl border p-2 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
              selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40",
              disabled && "cursor-not-allowed"
            )}
          >
            {/* `relative` on the label anchors this visually hidden input inside the tile; without it,
                focusing it on click scrolled a distant ancestor and shifted the whole admin layout. */}
            <input type="radio" value={o.value} disabled={disabled} className="sr-only" {...register(field)} />
            <StructureGlyph glyphs={glyphs} id={o.value} active={selected} />
            <span className="text-body-medium leading-tight text-foreground">{title.replace(" (follows template)", "")}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Colour theme strip ───────────────────────────────────────────────────── */

/** One click recolours the whole page with a balanced set of colours. */
export function ThemeStrip({
  values,
  fields,
  disabled,
  dirty,
  onPick,
}: {
  values: Record<string, unknown>;
  fields: RoleFieldMap;
  disabled: boolean;
  dirty: boolean;
  onPick: (id: string) => void;
}) {
  const active = findActiveTheme(values, fields);
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p id="studio-colour-theme-label" className="text-body-medium text-foreground">
          Colour theme
        </p>
        <p className="text-caption text-muted-foreground">
          {active ? active.name : "Custom colours"}
          {dirty ? <span className="font-semibold text-foreground">{" · Unsaved changes"}</span> : null}
          {!disabled ? (
            <span className="hidden sm:inline">
              {" · "}
              <PiCursorClickBold className="mb-0.5 inline size-3.5" aria-hidden="true" /> Tap the preview to jump to a part
            </span>
          ) : null}
        </p>
      </div>
      <div role="radiogroup" aria-labelledby="studio-colour-theme-label" className="mt-2 flex flex-wrap gap-2">
        {MENU_COLOUR_THEMES.map((t) => {
          const selected = active?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t.name}
              title={t.name}
              disabled={disabled}
              onClick={() => onPick(t.id)}
              className={cn(
                "rounded-xl border p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
              )}
            >
              {/* A miniature page in the theme's own colours. */}
              <span
                aria-hidden="true"
                className="flex h-10 w-14 flex-col justify-center gap-1 rounded-lg p-1.5"
                style={{ background: t.colors.accent }}
              >
                <span className="h-3 rounded" style={{ background: t.colors.sectionBg, border: `1px solid ${t.colors.borderColor}` }} />
                <span className="h-1.5 w-7 rounded-full" style={{ background: t.colors.primary }} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Colour swatches ──────────────────────────────────────────────────────── */

/** Pick a colour from swatches drawn from the themes, or open the colour wheel for anything else. */
export function SwatchControl({
  id,
  role,
  label,
  hint,
  value,
  templateValue,
  disabled,
  onChange,
  wide,
}: {
  id: string;
  role: ColourRole;
  label: string;
  hint: string;
  value: string;
  templateValue: string | undefined;
  disabled: boolean;
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  const options = swatchOptions(role);
  const known = options.some((o) => sameColour(o.value, value));
  const list = known || !value ? options : [{ value, label: "Current colour" }, ...options];
  const changed = templateValue != null && !sameColour(value, templateValue);

  return (
    <div className={cn("rounded-xl border border-border bg-card p-3", wide && "sm:col-span-2")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p id={id} className="text-body-medium text-foreground">
            {label}
          </p>
          <p className="text-caption text-muted-foreground">{hint}</p>
        </div>
        {changed && !disabled && templateValue ? (
          <button
            type="button"
            onClick={() => onChange(templateValue)}
            className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-caption font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            <PiArrowCounterClockwiseBold className="size-3.5" aria-hidden="true" />
            Reset
          </button>
        ) : null}
      </div>

      <div role="radiogroup" aria-labelledby={id} className="mt-3 flex flex-wrap items-center gap-2.5">
        {list.map((o) => {
          const selected = sameColour(o.value, value);
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${o.label} ${o.value}`}
              title={o.label}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "size-8 rounded-full border border-black/15 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                selected ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card" : "hover:scale-110"
              )}
              style={{ background: o.value }}
            />
          );
        })}
        <label
          title="Pick any colour"
          className={cn(
            "relative flex size-8 items-center justify-center rounded-full border border-dashed border-muted-foreground/60 text-muted-foreground transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary hover:text-primary"
          )}
        >
          <PiPlusBold className="size-3.5" aria-hidden="true" />
          <input
            type="color"
            aria-label={`Pick a custom colour for ${label}`}
            disabled={disabled}
            value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </label>
      </div>
    </div>
  );
}

/* ── Card shape ───────────────────────────────────────────────────────────── */

const SHAPE_PRESETS = CARD_STYLE_OPTIONS.filter((o) => o.value !== CUSTOM_OPTION_VALUE).slice(0, 8);

export function ShapeControl({
  value,
  disabled,
  onChange,
  cardBg,
  border,
  pageBg,
}: {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  cardBg: string;
  border: string;
  pageBg: string;
}) {
  return (
    <div role="radiogroup" aria-label="Card shape" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {SHAPE_PRESETS.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={o.label}
            title={o.label}
            disabled={disabled}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-col items-center gap-1 overflow-hidden rounded-xl border p-1 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
              selected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40"
            )}
          >
            {/* Drawn in the page's own colours so the corners and shadow read as they will on the page. */}
            <span aria-hidden="true" className="flex w-full items-center justify-center rounded-lg p-2" style={{ background: pageBg }}>
              <span className={cn("block h-7 w-full border", o.value)} style={{ background: cardBg, borderColor: border }} />
            </span>
            <span className="sr-only">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Typeface ─────────────────────────────────────────────────────────────── */

const FONT_PRESETS = FONT_FAMILY_OPTIONS.filter((o) => o.value !== CUSTOM_OPTION_VALUE);
const FONTS_SHOWN = 6;

export function FontControl({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  // Start with a short list; the chosen font is always visible even if it is further down.
  const head = FONT_PRESETS.slice(0, FONTS_SHOWN);
  const chosen = FONT_PRESETS.find((o) => o.value === value);
  const visible = showAll ? FONT_PRESETS : chosen && !head.includes(chosen) ? [...head, chosen] : head;

  return (
    <div className="space-y-2">
      <div role="radiogroup" aria-label="Typeface" className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {visible.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span className="block truncate text-base text-foreground" style={{ fontFamily: o.value }}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
      {FONT_PRESETS.length > FONTS_SHOWN ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="text-body-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {showAll ? "Show fewer fonts" : `Show all ${FONT_PRESETS.length} fonts`}
        </button>
      ) : null}
    </div>
  );
}

/* ── Free wording with ready-made suggestions ─────────────────────────────── */

/** Guests read this text, so it stays editable — with a few one-tap suggestions. */
export function TextWithSuggestions({
  id,
  label,
  hint,
  value,
  options,
  placeholder,
  disabled,
  onChange,
  wide,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  disabled: boolean;
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  const suggestions = options.filter((o) => o.value !== CUSTOM_OPTION_VALUE).slice(0, 3);
  return (
    <div className={cn("rounded-xl border border-border bg-card p-3", wide && "sm:col-span-2")}>
      <label htmlFor={id} className="text-body-medium text-foreground">
        {label}
      </label>
      <p className="text-caption text-muted-foreground">{hint}</p>
      <Input
        id={id}
        className="mt-2 h-9 text-sm"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {!disabled && suggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label={`${label} suggestions`}>
          {suggestions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              title={o.value}
              className={cn(
                "max-w-full truncate rounded-full border px-2.5 py-1 text-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                value === o.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
