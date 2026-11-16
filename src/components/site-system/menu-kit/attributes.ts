import type { Menu } from "@/types";
import { ATTRIBUTE_SETS, formatAttributeValue, type AttributeFieldDef } from "../attributes";
import type { AttributeSetId } from "../types";

/**
 * Item details (attribute sets, PLAN §2.2) as guests see them on the menu:
 * short chips on a card, a full list in the item sheet, and filters built
 * from whatever details the owner actually filled in.
 */

type Attrs = Record<string, Record<string, unknown>>;

function attrsOf(item: Pick<Menu, "attributes">): Attrs {
  const a = item.attributes;
  return a && typeof a === "object" && !Array.isArray(a) ? (a as Attrs) : {};
}

function fieldsIn(item: Pick<Menu, "attributes">): Array<{ set: AttributeSetId; field: AttributeFieldDef; value: unknown }> {
  const out: Array<{ set: AttributeSetId; field: AttributeFieldDef; value: unknown }> = [];
  const attrs = attrsOf(item);
  for (const [setId, values] of Object.entries(attrs)) {
    const def = ATTRIBUTE_SETS[setId as AttributeSetId];
    if (!def || !values || typeof values !== "object") continue;
    for (const field of def.fields) {
      if (field.id in values) out.push({ set: def.id, field, value: (values as Record<string, unknown>)[field.id] });
    }
  }
  return out;
}

/** Every filled-in detail, labelled, for the item sheet. */
export function itemDetailRows(item: Pick<Menu, "attributes">): Array<{ key: string; label: string; value: string }> {
  return fieldsIn(item)
    .map(({ set, field, value }) => {
      const v = formatAttributeValue(field, value);
      return v === null ? null : { key: `${set}.${field.id}`, label: field.label, value: v };
    })
    .filter((r): r is { key: string; label: string; value: string } => Boolean(r));
}

/** Text fields worth a chip on a card (short, identifying). */
const CHIP_TEXT = new Set(["grape", "region", "country", "style", "origin", "brand", "cut", "fish", "age", "size", "weight"]);

/**
 * A few short chips for a card: "Red", "Nebbiolo", "14%", "2018", "On tap",
 * "Made fresh daily", "Out of stock". Long text and lists stay in the sheet.
 */
export function itemChips(item: Pick<Menu, "attributes">, max = 4): string[] {
  const chips: string[] = [];
  for (const { field, value } of fieldsIn(item)) {
    let chip: string | null = null;
    if (field.kind === "bool") {
      if (field.id === "inStock") chip = value === false ? "Out of stock" : null;
      else chip = value === true ? field.label : null;
    } else if (field.kind === "enum") {
      chip = formatAttributeValue(field, value);
    } else if (field.kind === "number" || field.kind === "int") {
      const v = formatAttributeValue(field, value);
      chip = v === null ? null : field.id === "vintage" ? v : field.unit ? `${field.label} ${v}` : null;
    } else if (field.kind === "text" && CHIP_TEXT.has(field.id)) {
      const v = formatAttributeValue(field, value);
      chip = v && v.length <= 28 ? v : null;
    }
    if (chip && !chips.includes(chip)) chips.push(chip);
    if (chips.length >= max) break;
  }
  return chips;
}

/** One value of a detail, read for a given item (lists → their entries). */
function valuesFor(item: Pick<Menu, "attributes">, set: string, field: string): string[] {
  const v = attrsOf(item)[set]?.[field];
  if (v === undefined || v === null || v === "") return [];
  if (Array.isArray(v)) return v.map(String);
  return [String(v)];
}

export interface AttributeFilter {
  /** "wine.colour" */
  key: string;
  label: string;
  options: Array<{ value: string; label: string; count: number }>;
}

/**
 * Guest filters for this menu: the filterable details (marked `filter` in the
 * set definitions) that have at least two different values among the items.
 */
export function attributeFilters(items: ReadonlyArray<Pick<Menu, "attributes">>, max = 3): AttributeFilter[] {
  const counts = new Map<string, { field: AttributeFieldDef; values: Map<string, number> }>();
  for (const item of items) {
    for (const { set, field, value } of fieldsIn(item)) {
      if (!field.filter) continue;
      const key = `${set}.${field.id}`;
      const entry = counts.get(key) ?? { field, values: new Map<string, number>() };
      for (const v of Array.isArray(value) ? value : [value]) {
        if (v === undefined || v === null || v === "") continue;
        const s = String(v);
        entry.values.set(s, (entry.values.get(s) ?? 0) + 1);
      }
      counts.set(key, entry);
    }
  }
  const out: Array<AttributeFilter & { rank: number }> = [];
  for (const [key, { field, values }] of counts) {
    // Free text with many values (every grape, every country) makes a wall of chips — skip it.
    const fixedChoice = field.kind === "enum" || field.kind === "bool";
    if (values.size < 2 || (!fixedChoice && values.size > 6)) continue;
    // The group is labelled with the field name, so a yes/no option reads just "Yes" / "No".
    const label = (v: string) => (field.kind === "bool" ? (v === "true" ? "Yes" : "No") : field.options?.find((o) => o.value === v)?.label ?? v);
    out.push({
      key,
      label: field.label,
      rank: (fixedChoice ? 0 : 100) + values.size,
      options: [...values.entries()].map(([value, count]) => ({ value, label: label(value), count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    });
  }
  // Fixed choices first (colour, served on tap…), fewest options first; at most `max` groups.
  return out
    .sort((a, b) => a.rank - b.rank)
    .slice(0, max)
    .map((f) => ({ key: f.key, label: f.label, options: f.options }));
}

/** True when the item has every chosen detail value (`{ "wine.colour": "red" }`). */
export function matchesAttributes(item: Pick<Menu, "attributes">, chosen: Readonly<Record<string, string>>): boolean {
  for (const [key, want] of Object.entries(chosen)) {
    const [set, field] = key.split(".");
    if (!valuesFor(item, set, field).includes(want)) return false;
  }
  return true;
}

/** A detail's display value for one item ("4.8%", "Piedmont"), or "". */
export function detail(item: Pick<Menu, "attributes">, set: AttributeSetId, fieldId: string): string {
  const field = ATTRIBUTE_SETS[set]?.fields.find((f) => f.id === fieldId);
  if (!field) return "";
  return formatAttributeValue(field, attrsOf(item)[set]?.[fieldId]) ?? "";
}
