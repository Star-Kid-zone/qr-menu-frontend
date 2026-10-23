"use client";

import { Input } from "@/components/ui/input";
import { DIETARY_TAG_OPTIONS, ALLERGEN_OPTIONS, SPICE_LEVELS } from "@/constants/dietary.constants";
import { cn } from "@/utils/cn";

interface DietaryNutritionFieldsProps {
  dietaryTags: string[];
  onDietaryTagsChange: (tags: string[]) => void;
  allergens: string[];
  onAllergensChange: (allergens: string[]) => void;
  spiceLevel: number | null;
  onSpiceLevelChange: (level: number | null) => void;
  calories: string;
  onCaloriesChange: (calories: string) => void;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const sectionLabel = (text: string) => (
  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{text}</p>
);
const fieldLabel = (text: string) => (
  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{text}</label>
);

/** Shared dietary/allergen/spice/calorie editor used by both Add and Edit menu-item forms. */
export function DietaryNutritionFields({
  dietaryTags,
  onDietaryTagsChange,
  allergens,
  onAllergensChange,
  spiceLevel,
  onSpiceLevelChange,
  calories,
  onCaloriesChange,
}: DietaryNutritionFieldsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {sectionLabel("Dietary & Nutrition")}

      <div className="grid grid-cols-1 gap-4">
        <div>
          {fieldLabel("Dietary tags")}
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAG_OPTIONS.map((opt) => {
              const selected = dietaryTags.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onDietaryTagsChange(toggleValue(dietaryTags, opt.value))}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                    selected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {fieldLabel("Allergens present")}
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_OPTIONS.map((opt) => {
              const selected = allergens.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onAllergensChange(toggleValue(allergens, opt.value))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                    selected
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            {fieldLabel("Spice level")}
            <div className="flex gap-2">
              {SPICE_LEVELS.map((lvl) => {
                const selected = spiceLevel === lvl.value;
                return (
                  <button
                    key={lvl.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSpiceLevelChange(selected ? null : lvl.value)}
                    title={lvl.label}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                      selected
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
                        : "border-border bg-muted hover:bg-muted/70",
                    )}
                  >
                    {lvl.chilies === 0 ? "—" : "🌶".repeat(lvl.chilies)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {fieldLabel("Calories (optional)")}
            <Input
              id="item-calories"
              type="number"
              min="0"
              placeholder="e.g. 450"
              value={calories}
              onChange={(e) => onCaloriesChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
