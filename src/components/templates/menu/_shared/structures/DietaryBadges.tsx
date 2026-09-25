"use client";

import type { Menu } from "@/types";
import { dietaryTagEmoji, dietaryTagLabel } from "@/constants/dietary.constants";

/** Small inline badge row for a menu item's dietary tags, spice level and
 *  calories — renders nothing for the fields that aren't set, so untagged
 *  legacy items look exactly as before. */
export function DietaryBadges({ item, className = "" }: { item: Menu; className?: string }) {
  const tags = item.dietaryTags || [];
  const spiceLevel = item.spiceLevel;
  const calories = item.calories;

  if (tags.length === 0 && !spiceLevel && calories == null) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          title={dietaryTagLabel(tag)}
          className="inline-flex items-center gap-0.5 rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-white/10"
        >
          <span>{dietaryTagEmoji(tag)}</span>
          {dietaryTagLabel(tag)}
        </span>
      ))}
      {!!spiceLevel && (
        <span title={`Spice level ${spiceLevel}/3`} className="inline-flex items-center gap-0.5 text-[10px] font-semibold">
          {"🌶".repeat(spiceLevel)}
        </span>
      )}
      {calories != null && (
        <span className="inline-flex items-center rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-white/10">
          {calories} cal
        </span>
      )}
    </div>
  );
}
