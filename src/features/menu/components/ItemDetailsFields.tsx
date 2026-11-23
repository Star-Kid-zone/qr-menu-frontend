"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { ATTRIBUTE_SETS, type AttributeFieldDef } from "@/components/site-system/attributes";
import type { BusinessTypeDefinition } from "@/components/site-system/types";

/**
 * Business-type fields for a menu item (docs/site-system/PLAN.md §2.2):
 * several prices (glass / bottle, half / pint…) and the attribute sets the
 * business type uses (wine, beer, cheese…). Shared by the Add and Edit forms.
 * Display only — nothing here takes orders.
 */

export type ItemAttributes = Record<string, Record<string, unknown>>;
export interface PriceOptionRow {
  label: string;
  price: string;
}

import { MAX_PRICE_OPTIONS } from "@/constants/menu.constants";

export { MAX_PRICE_OPTIONS };

/** Drops empty values and empty sets, so the saved JSON only holds what the owner filled in. */
export function cleanAttributes(attrs: ItemAttributes): ItemAttributes {
  const out: ItemAttributes = {};
  for (const [setId, fields] of Object.entries(attrs)) {
    const kept: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields ?? {})) {
      if (v === undefined || v === null || v === "") continue;
      if (Array.isArray(v) && v.length === 0) continue;
      kept[k] = v;
    }
    if (Object.keys(kept).length) out[setId] = kept;
  }
  return out;
}

/** Rows with both a name and a price; prices as plain decimal strings. */
export function cleanPriceOptions(rows: PriceOptionRow[]): PriceOptionRow[] {
  return rows
    .map((r) => ({ label: r.label.trim(), price: r.price.trim() }))
    .filter((r) => r.label && r.price !== "" && Number.isFinite(Number(r.price)) && Number(r.price) >= 0);
}

/** The headline price when several are given: the lowest ("from"). */
export function lowestOptionPrice(rows: PriceOptionRow[]): string | null {
  const clean = cleanPriceOptions(rows);
  if (!clean.length) return null;
  return clean.reduce((min, r) => (Number(r.price) < Number(min) ? r.price : min), clean[0].price);
}

const sectionLabel = (text: string) => <p className="mb-3 text-caption font-bold text-muted-foreground">{text}</p>;

const chip = (selected: boolean) =>
  cn(
    "rounded-full border px-3 py-2 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
    selected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-muted text-muted-foreground hover:bg-muted/70",
  );

function FieldInput({
  field,
  value,
  onChange,
  inputId,
}: {
  field: AttributeFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  inputId: string;
}) {
  switch (field.kind) {
    case "bool":
      return (
        <div className="flex gap-2" role="group" aria-labelledby={`${inputId}-label`}>
          {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((o) => (
            <button key={o.l} type="button" aria-pressed={value === o.v} onClick={() => onChange(value === o.v ? undefined : o.v)} className={chip(value === o.v)}>
              {o.l}
            </button>
          ))}
        </div>
      );
    case "enum":
      return (
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${inputId}-label`}>
          {field.options!.map((o) => (
            <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(value === o.value ? undefined : o.value)} className={chip(value === o.value)}>
              {o.label}
            </button>
          ))}
        </div>
      );
    case "enumList": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${inputId}-label`}>
          {field.options!.map((o) => {
            const on = list.includes(o.value);
            return (
              <button key={o.value} type="button" aria-pressed={on} onClick={() => onChange(on ? list.filter((x) => x !== o.value) : [...list, o.value])} className={chip(on)}>
                {o.label}
              </button>
            );
          })}
        </div>
      );
    }
    case "list":
      return (
        <Input
          id={inputId}
          placeholder="Separate with commas"
          maxLength={600}
          value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12))}
        />
      );
    case "number":
    case "int":
      return (
        <Input
          id={inputId}
          type="number"
          inputMode={field.kind === "int" ? "numeric" : "decimal"}
          step={field.kind === "int" ? 1 : "any"}
          min={field.min}
          max={field.max}
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={typeof value === "number" ? String(value) : ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return onChange(undefined);
            const n = field.kind === "int" ? parseInt(raw, 10) : parseFloat(raw);
            onChange(Number.isFinite(n) ? n : undefined);
          }}
        />
      );
    case "text":
    default:
      return <Input id={inputId} maxLength={120} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

interface ItemDetailsFieldsProps {
  business: BusinessTypeDefinition;
  attributes: ItemAttributes;
  onAttributesChange: (next: ItemAttributes) => void;
  priceOptions: PriceOptionRow[];
  onPriceOptionsChange: (next: PriceOptionRow[]) => void;
  currencySymbol: string;
}

export function ItemDetailsFields({ business, attributes, onAttributesChange, priceOptions, onPriceOptionsChange, currencySymbol }: ItemDetailsFieldsProps) {
  const baseId = useId();
  const setField = (setId: string, fieldId: string, v: unknown) =>
    onAttributesChange({ ...attributes, [setId]: { ...(attributes[setId] ?? {}), [fieldId]: v } });

  const updateRow = (i: number, patch: Partial<PriceOptionRow>) =>
    onPriceOptionsChange(priceOptions.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  // "food" extras (serves, veg mark) sit with the other sets; dietary/allergens stay in their own panel.
  const sets = business.attributeSets.map((id) => ATTRIBUTE_SETS[id]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {sectionLabel(`${business.terms.itemSingular} details`)}

      <section aria-labelledby={`${baseId}-prices`} className="mb-6">
        <h3 id={`${baseId}-prices`} className="mb-1 text-sm font-semibold text-foreground">Sizes and prices</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Add these when one {business.terms.itemSingular.toLowerCase()} comes in several sizes. Guests see every price; the lowest shows as the starting price.
        </p>

        {priceOptions.length === 0 && business.priceOptionPresets.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {business.priceOptionPresets.map((preset) => (
              <button
                key={preset.join("/")}
                type="button"
                onClick={() => onPriceOptionsChange(preset.map((label) => ({ label, price: "" })))}
                className={chip(false)}
              >
                Use {preset.join(" / ")}
              </button>
            ))}
          </div>
        )}

        {priceOptions.length > 0 && (
          <ul className="space-y-2">
            {priceOptions.map((row, i) => (
              <li key={i} className="grid grid-cols-[1fr_8rem_auto] items-center gap-2">
                <Input aria-label={`Size ${i + 1} name`} placeholder="e.g. Pint" maxLength={24} value={row.label} onChange={(e) => updateRow(i, { label: e.target.value })} />
                <Input
                  aria-label={`Size ${i + 1} price (${currencySymbol})`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder={currencySymbol}
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={row.price}
                  onChange={(e) => updateRow(i, { price: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => onPriceOptionsChange(priceOptions.filter((_, j) => j !== i))}
                  className="rounded-md px-2 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${row.label || `size ${i + 1}`}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {priceOptions.length < MAX_PRICE_OPTIONS && (
          <button
            type="button"
            onClick={() => onPriceOptionsChange([...priceOptions, { label: "", price: "" }])}
            className="mt-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Add a size
          </button>
        )}
      </section>

      <div className="space-y-6">
        {sets.map((set) => (
          <fieldset key={set.id} className="border-t border-border pt-5">
            <legend className="mb-3 text-sm font-semibold text-foreground">{set.label}</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {set.fields.map((field) => {
                const inputId = `${baseId}-${set.id}-${field.id}`;
                const wide = field.kind === "enum" || field.kind === "enumList" || field.kind === "list";
                return (
                  <div key={field.id} className={wide ? "sm:col-span-2" : undefined}>
                    <label id={`${inputId}-label`} htmlFor={inputId} className="mb-2 block text-xs font-semibold text-muted-foreground">
                      {field.label}
                      {field.unit ? ` (${field.unit})` : ""}
                    </label>
                    <FieldInput field={field} inputId={inputId} value={attributes[set.id]?.[field.id]} onChange={(v) => setField(set.id, field.id, v)} />
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
