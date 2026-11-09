"use client";

import type { IconType } from "react-icons";
import {
  PiEggFill,
  PiFlameFill,
  PiForkKnifeFill,
  PiGrainsSlashFill,
  PiHandsPrayingFill,
  PiLeafFill,
  PiPlantFill,
  PiWarningFill,
  PiDropSlashFill,
} from "react-icons/pi";
import type { Menu } from "@/types";
import { allergenLabel, dietaryTagLabel, SPICE_LEVELS } from "@/constants/dietary.constants";

/** Three-flame heat meter: lit flames for the level, dimmed ones for the rest,
 *  so "Mild" and "Hot" are distinguishable at a glance (and not just a count
 *  of emoji). Used by the guest menu, the admin preview and the spice picker. */
export function SpiceMeter({ level, size = 12, className = "" }: { level: number; size?: number; className?: string }) {
  const label = SPICE_LEVELS.find((l) => l.value === level)?.label ?? `Level ${level}`;
  return (
    <span role="img" aria-label={`Spice level: ${label}`} className={`inline-flex items-center gap-px ${className}`}>
      {[1, 2, 3].map((n) => (
        <PiFlameFill
          key={n}
          size={size}
          aria-hidden
          className={n <= level ? "text-orange-500" : "text-current opacity-20"}
        />
      ))}
    </span>
  );
}

const DIETARY_TAG_ICONS: Record<string, { Icon: IconType; color: string }> = {
  vegetarian: { Icon: PiLeafFill, color: "text-green-600" },
  vegan: { Icon: PiPlantFill, color: "text-emerald-600" },
  gluten_free: { Icon: PiGrainsSlashFill, color: "text-amber-600" },
  dairy_free: { Icon: PiDropSlashFill, color: "text-sky-500" },
  jain: { Icon: PiHandsPrayingFill, color: "text-orange-500" },
  egg: { Icon: PiEggFill, color: "text-yellow-600" },
};

/** Vector icon for a dietary tag — renders identically on every OS, unlike
 *  the emoji it replaces. Unknown tags fall back to a neutral fork-and-knife. */
export function DietaryTagIcon({ tag, size = 12, className = "" }: { tag: string; size?: number; className?: string }) {
  const { Icon, color } = DIETARY_TAG_ICONS[tag] ?? { Icon: PiForkKnifeFill, color: "text-current" };
  return <Icon aria-hidden size={size} className={`shrink-0 ${color} ${className}`} />;
}

interface DietaryBadgesProps {
  item: Menu;
  className?: string;
  /** Item-detail view: show the spice label and the allergen warning too.
   *  Cards in the list stay compact (tags, flames, calories only). */
  detailed?: boolean;
}

/** Small inline badge row for a menu item's dietary tags, spice level and
 *  calories — renders nothing for the fields that aren't set, so untagged
 *  legacy items look exactly as before. */
export function DietaryBadges({ item, className = "", detailed = false }: DietaryBadgesProps) {
  const tags = item.dietaryTags || [];
  const allergens = detailed ? item.allergens || [] : [];
  const spiceLevel = item.spiceLevel;
  const calories = item.calories;

  if (tags.length === 0 && allergens.length === 0 && !spiceLevel && calories == null) return null;

  const textSize = detailed ? "text-xs" : "text-[10px]";
  const spiceLabel = SPICE_LEVELS.find((l) => l.value === spiceLevel)?.label;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            title={dietaryTagLabel(tag)}
            className={`inline-flex items-center gap-0.5 rounded-full bg-black/5 px-1.5 py-0.5 ${textSize} font-semibold dark:bg-white/10`}
          >
            <DietaryTagIcon tag={tag} size={detailed ? 13 : 11} />
            {dietaryTagLabel(tag)}
          </span>
        ))}
        {!!spiceLevel && (
          <span
            title={`Spice level: ${spiceLabel ?? spiceLevel}`}
            className={`inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-1.5 py-0.5 ${textSize} font-semibold`}
          >
            <SpiceMeter level={spiceLevel} size={detailed ? 13 : 11} />
            {detailed && spiceLabel}
          </span>
        )}
        {calories != null && (
          <span className={`inline-flex items-center rounded-full bg-black/5 px-1.5 py-0.5 ${textSize} font-semibold dark:bg-white/10`}>
            {calories} cal
          </span>
        )}
      </div>
      {allergens.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <PiWarningFill size={13} aria-hidden />
          <span>Contains: {allergens.map(allergenLabel).join(", ")}</span>
        </p>
      )}
    </div>
  );
}
