"use client";

import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { GLYPH_GROUPS } from "@/components/site-system/icons/glyphs";
import { getBusinessType, iconForCategory, resolveBusinessType } from "@/components/site-system/business-types";
import type { MenuCategoryEntry } from "@/components/templates/sections/menu/categories";

const label = (name: string) => name.replace(/-/g, " ").replace(/^\w/, (ch) => ch.toUpperCase());

const GROUPS: Array<[string, readonly string[]]> = [
  ["Food", GLYPH_GROUPS.food],
  ["Drinks", GLYPH_GROUPS.drinks],
  ["Shop", GLYPH_GROUPS.shop],
  ["Dietary", GLYPH_GROUPS.dietary],
];

/**
 * One icon per menu category. "Automatic" matches the category name for the
 * business type (e.g. "Pizzas" → pizza); picking an icon overrides that on
 * every menu design that shows category icons.
 */
export function CategoryIconPicker({
  categories,
  businessType,
  disabled,
  onChange,
}: {
  categories: readonly MenuCategoryEntry[];
  businessType: string;
  disabled: boolean;
  onChange: (index: number, icon: string) => void;
}) {
  const business = getBusinessType(businessType) ?? resolveBusinessType({});
  return (
    <div className="space-y-3">
      <div>
        <p className="text-body-medium text-foreground">Category icons</p>
        <p className="text-caption text-muted-foreground">
          Shown next to each category on menu designs that use icons. Automatic picks one from the category name.
        </p>
      </div>
      <ul className="divide-y rounded-xl border">
        {categories.map((c, i) => {
          const auto = iconForCategory(c.name, { business });
          const shown = c.icon || auto;
          const id = `cat-icon-${c.id}`;
          return (
            <li key={c.id} className="flex items-center gap-3 px-3 py-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground" aria-hidden>
                <SiteIcon name={shown} size={20} iconStyle="line" />
              </span>
              <label htmlFor={id} className="min-w-0 flex-1 truncate text-sm text-foreground">
                {c.name}
              </label>
              <select
                id={id}
                value={c.icon ?? ""}
                disabled={disabled}
                onChange={(e) => onChange(i, e.target.value)}
                className="h-9 max-w-44 rounded-md border bg-background px-2 text-sm text-foreground"
              >
                <option value="">Automatic ({label(auto)})</option>
                {GROUPS.map(([group, names]) => (
                  <optgroup key={group} label={group}>
                    {names.map((n) => (
                      <option key={n} value={n}>
                        {label(n)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
