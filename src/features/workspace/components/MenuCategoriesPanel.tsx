"use client";

import React from "react";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import { Button, ToggleCard } from "@/components/ui";
import {
  CATEGORY_SECTION_TYPE,
  menuSectionsFromCategories,
  resolveMenuCategories,
  type MenuCategoryEntry,
} from "@/components/templates/sections/menu/categories";
import { isMenuPartShown, MENU_PARTS, type MenuPartType } from "@/components/templates/sections/menu/parts";
import type { SectionInstance, SiteDocument } from "@/components/templates/sections/types";
import { moveItem, OrderableList, withSchedule } from "./OrderableList";
import { CategoryIconPicker } from "./CategoryIconPicker";

export interface MenuCategoriesPanelProps {
  value: SiteDocument | null;
  /** Current category names, in the order their items appear on the menu. */
  categories: readonly string[];
  disabled: boolean;
  onChange: (doc: SiteDocument | null) => void;
  /** For the automatic category icons. */
  businessType?: string;
}

/**
 * Menu page categories: order, hide, and date windows (e.g. a festive
 * category only in December). Applies to every menu layout. Items in a
 * hidden category don't appear anywhere on the menu, including search.
 */
export function MenuCategoriesPanel({ value, categories, disabled, onChange, businessType = "" }: MenuCategoriesPanelProps) {
  const list = resolveMenuCategories(value, categories);
  const existingMenu = value?.menu?.sections ?? [];
  const customised = existingMenu.some((s) => s.type === CATEGORY_SECTION_TYPE);

  const commit = (next: MenuCategoryEntry[]) =>
    onChange({ ...(value ?? {}), version: 1, menu: { sections: menuSectionsFromCategories(next, existingMenu) } });

  const reset = () => {
    if (!value) return;
    const others = existingMenu.filter((s) => s.type !== CATEGORY_SECTION_TYPE);
    const rest: SiteDocument = { ...value };
    if (others.length) rest.menu = { sections: others };
    else delete rest.menu;
    onChange(rest.landing || rest.menu || rest.status ? rest : null);
  };

  /** Search box / filter chips: a hidden part is stored as `{ id: type, type, hidden: true }`; shown = no entry. */
  const setPart = (type: MenuPartType, shown: boolean) => {
    const without = existingMenu.filter((s) => s.type !== type);
    const next: SectionInstance[] = shown ? without : [...without, { id: type, type, hidden: true }];
    const doc: SiteDocument = { ...(value ?? {}), version: 1 };
    if (next.length) doc.menu = { sections: next };
    else delete doc.menu;
    onChange(doc.landing || doc.menu || doc.status ? doc : null);
  };

  const parts = (
    <div className="space-y-2">
      <p className="text-body-medium text-foreground">Search &amp; filters</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {MENU_PARTS.map((part) => (
          <ToggleCard
            key={part.type}
            checked={isMenuPartShown(value, part.type)}
            onChange={(checked) => setPart(part.type, checked)}
            label={part.label}
            description={part.description}
            disabled={disabled}
            className="p-3 shadow-2xs"
          />
        ))}
      </div>
    </div>
  );

  if (categories.length === 0) {
    return (
      <div className="space-y-5">
        {parts}
        <p className="text-caption text-muted-foreground">
          Your menu has no categories yet. Add a category to your menu items and it will appear here.
        </p>
      </div>
    );
  }

  const visibleCount = list.filter((c) => !c.hidden).length;

  return (
    <div className="space-y-5">
      {parts}
      <div className="space-y-3">
        <p className="text-body-medium text-foreground">Categories</p>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-caption text-muted-foreground max-w-prose">
            Choose the order guests see your categories in, hide ones you&apos;re not serving, or show a category only between two
            dates. Hidden categories stay here so you can bring them back.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled || !customised}
            onClick={reset}
            startIcon={<PiArrowCounterClockwiseBold className="size-4" />}
          >
            Reset order
          </Button>
        </div>

        {visibleCount === 0 ? (
          <p role="status" className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-caption text-foreground">
            Every category is hidden, so guests will see an empty menu.
          </p>
        ) : null}

        <OrderableList
          ariaLabel="Menu categories"
          disabled={disabled}
          items={list.map((c) => ({ id: c.id, label: c.name, hidden: c.hidden, schedule: c.schedule }))}
          onMove={(from, to) => commit(moveItem(list, from, to))}
          onToggle={(index) => commit(list.map((c, i) => (i === index ? { ...c, hidden: !c.hidden } : c)))}
          onSchedule={(index, patch) => commit(list.map((c, i) => (i === index ? withSchedule(c, patch) : c)))}
        />
      </div>
      <CategoryIconPicker
        categories={list}
        businessType={businessType}
        disabled={disabled}
        onChange={(index, icon) => commit(list.map((c, i) => (i === index ? { ...c, icon: icon || undefined } : c)))}
      />
    </div>
  );
}
