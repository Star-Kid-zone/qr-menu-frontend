import { isScheduledOn, parseSiteDocument } from "../document";
import type { SectionInstance, SectionSchedule } from "../types";

/**
 * Menu page layout: the order guests see menu categories in, which are
 * hidden, and which only show between two dates.
 *
 * Categories are free text on each menu item, so they're matched by name
 * (trimmed, case-insensitive). Stored as `site_document.menu.sections` with
 * `type: "category"` and the name in `props.name`. A category the owner has
 * never placed (new, or renamed in the menu) appears after the placed ones,
 * in the order its items were added — exactly how the menu showed before.
 */

export const CATEGORY_SECTION_TYPE = "category";

export interface MenuCategoryEntry {
  id: string;
  name: string;
  hidden: boolean;
  schedule?: SectionSchedule;
  /** Owner-chosen icon (an icon name); empty = matched from the name. */
  icon?: string;
}

const keyOf = (name: string) => name.trim().toLowerCase();

/** A stable section id for a category name: an ASCII slug, or a short hash for names like "المشويات". */
export function categorySectionId(name: string, taken: ReadonlySet<string> = new Set()): string {
  const slug = keyOf(name)
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  let base = slug;
  if (!base) {
    let h = 0;
    for (const ch of keyOf(name)) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
    base = h.toString(36);
  }
  let id = `cat-${base}`;
  for (let n = 2; taken.has(id); n += 1) id = `cat-${base}-${n}`;
  return id;
}

/** Category names in the order their items appear (the menu's natural order). */
export function categoriesInItemOrder(items: ReadonlyArray<{ category?: string | null }>): string[] {
  const seen = new Map<string, string>();
  for (const it of items) {
    const name = it.category?.trim();
    if (name && !seen.has(keyOf(name))) seen.set(keyOf(name), name);
  }
  return Array.from(seen.values());
}

/**
 * Every current category with its saved placement. Saved entries for
 * categories no longer on the menu are dropped; unsaved categories follow.
 */
export function resolveMenuCategories(rawDocument: unknown, currentNames: readonly string[]): MenuCategoryEntry[] {
  const current = new Map(currentNames.map((n) => [keyOf(n), n]));
  const saved = parseSiteDocument(rawDocument)?.menu?.sections ?? [];
  const result: MenuCategoryEntry[] = [];
  const placed = new Set<string>();
  const ids = new Set<string>();

  for (const s of saved) {
    if (s.type !== CATEGORY_SECTION_TYPE) continue;
    const savedName = typeof s.props?.name === "string" ? s.props.name : "";
    const key = keyOf(savedName);
    const name = current.get(key);
    if (!name || placed.has(key)) continue;
    placed.add(key);
    ids.add(s.id);
    const icon = typeof s.props?.icon === "string" && s.props.icon ? s.props.icon : undefined;
    result.push({ id: s.id, name, hidden: Boolean(s.hidden), ...(s.schedule ? { schedule: s.schedule } : {}), ...(icon ? { icon } : {}) });
  }

  for (const name of currentNames) {
    const key = keyOf(name);
    if (placed.has(key)) continue;
    placed.add(key);
    const id = categorySectionId(name, ids);
    ids.add(id);
    result.push({ id, name, hidden: false });
  }
  return result;
}

/** The categories a guest sees today, in order. */
export function visibleMenuCategories(rawDocument: unknown, currentNames: readonly string[], today: string): string[] {
  return resolveMenuCategories(rawDocument, currentNames)
    .filter((c) => !c.hidden && isScheduledOn(c, today))
    .map((c) => c.name);
}

/** Store the editor's list back as menu sections, keeping any non-category menu sections. */
export function menuSectionsFromCategories(
  categories: readonly MenuCategoryEntry[],
  existing: readonly SectionInstance[] = [],
): SectionInstance[] {
  const others = existing.filter((s) => s.type !== CATEGORY_SECTION_TYPE);
  const cats: SectionInstance[] = categories.map((c) => ({
    id: c.id,
    type: CATEGORY_SECTION_TYPE,
    props: { name: c.name, ...(c.icon ? { icon: c.icon } : {}) },
    ...(c.hidden ? { hidden: true } : {}),
    ...(c.schedule ? { schedule: c.schedule } : {}),
  }));
  return [...cats, ...others];
}

/** Owner-chosen category icons, keyed by lower-cased category name. */
export function categoryIconOverrides(rawDocument: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of parseSiteDocument(rawDocument)?.menu?.sections ?? []) {
    if (s.type !== CATEGORY_SECTION_TYPE) continue;
    const name = typeof s.props?.name === "string" ? keyOf(s.props.name) : "";
    const icon = typeof s.props?.icon === "string" ? s.props.icon : "";
    if (name && icon) out[name] = icon;
  }
  return out;
}