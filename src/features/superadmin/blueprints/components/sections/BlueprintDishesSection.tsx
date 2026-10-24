'use client';

import React from 'react';
import { PiPlusBold, PiTrashBold } from 'react-icons/pi';
import { Button } from '@/components/ui';
import type { BlueprintMenuItem } from '@/services/superadmin.service';

interface BlueprintDishesSectionProps {
  items: BlueprintMenuItem[];
  categoryNames: string[];
  addDish: () => void;
  updateDish: (index: number, updates: Partial<BlueprintMenuItem>) => void;
  removeDish: (index: number) => void;
}

export function BlueprintDishesSection({
  items,
  categoryNames,
  addDish,
  updateDish,
  removeDish,
}: BlueprintDishesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Menu Items ({items.length})</h3>
          <p className="text-xs text-muted-foreground">
            Every dish pre-loads directly into the tenant&apos;s live catalog.
          </p>
        </div>
        <Button onClick={addDish} variant="secondary" size="sm" leftIcon={<PiPlusBold size={14} />}>
          Add Dish
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((dish, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {idx + 1}
              </span>
              <input
                type="text"
                value={dish.item}
                onChange={(e) => updateDish(idx, { item: e.target.value })}
                placeholder="Dish name"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-muted-foreground">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={dish.price}
                  onChange={(e) => updateDish(idx, { price: e.target.value })}
                  placeholder="Price"
                  className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-bold text-primary text-right"
                />
              </div>
              <button
                type="button"
                onClick={() => removeDish(idx)}
                className="text-muted-foreground hover:text-rose-500 p-1"
                title="Delete dish"
              >
                <PiTrashBold size={16} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <select
                  value={dish.category}
                  onChange={(e) => updateDish(idx, { category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                >
                  {categoryNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Type</label>
                <select
                  value={dish.type}
                  onChange={(e) => updateDish(idx, { type: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                >
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Veg">Vegetarian</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(dish.popular)}
                    onChange={(e) => updateDish(idx, { popular: e.target.checked })}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Featured Popular Dish
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
              <textarea
                rows={2}
                value={dish.description}
                onChange={(e) => updateDish(idx, { description: e.target.value })}
                placeholder="Dish description with ingredients and craft notes..."
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Photo URL</label>
                <input
                  type="text"
                  value={dish.imageUrl}
                  onChange={(e) => updateDish(idx, { imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Dietary Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={(dish.dietaryTags || []).join(', ')}
                  onChange={(e) =>
                    updateDish(idx, {
                      dietaryTags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Gluten-Free, Organic, Chef Special"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
