'use client';

import React from 'react';
import type { MenuBlueprint } from '@/services/superadmin.service';

interface BlueprintBasicSectionProps {
  formData: MenuBlueprint;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
  isEditing: boolean;
  categoriesStr: string;
  handleCategoriesChange: (val: string) => void;
}

export function BlueprintBasicSection({
  formData,
  setFormData,
  isEditing,
  categoriesStr,
  handleCategoriesChange,
}: BlueprintBasicSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Identifier Slug <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            disabled={isEditing}
            value={formData.id}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
              }))
            }
            placeholder="e.g. taco_fiesta"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-60 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Unique machine ID (lowercase letters, numbers, dashes, underscores).
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Blueprint Display Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Taqueria & Mezcal Bar"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold text-foreground">Marketing Tagline</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
          placeholder="e.g. Wood-grilled street tacos, fresh guacamole, and hand-shaken agave cocktails"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">Badge Label</label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
            placeholder="e.g. Trending, Most Popular, Chef Special"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">Icon Name</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="utensils">Utensils (General)</option>
            <option value="coffee">Coffee / Cafe</option>
            <option value="pizza">Pizza / Bistro</option>
            <option value="hamburger">Burger / Diner</option>
            <option value="bowl-food">Bowl / Asian / Noodle</option>
            <option value="fire">Fire / Grill / BBQ</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold text-foreground">
          Menu Categories Included (comma separated) <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={categoriesStr}
          onChange={(e) => handleCategoriesChange(e.target.value)}
          placeholder="Street Tacos, Antojitos & Sides, Especiales, Margaritas"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {formData.categoryNames.map((cat) => (
            <span key={cat} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
