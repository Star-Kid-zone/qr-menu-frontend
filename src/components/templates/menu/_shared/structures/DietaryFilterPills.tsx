"use client";

import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { MenuStructureTheme } from "./buildMenuTheme";
import { dietaryTagLabel } from "@/constants/dietary.constants";
import { DietaryTagIcon } from "./DietaryBadges";

/** Guest-facing dietary filter pills — renders nothing when no item on the
 *  menu has any dietary tags, so it never adds empty chrome to a menu that
 *  hasn't been tagged yet. */
export function DietaryFilterPills({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  if (!p.allDietaryTags || p.allDietaryTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {p.allDietaryTags.map((tag) => {
        const selected = p.activeDietaryTag === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => p.setActiveDietaryTag(selected ? null : tag)}
            aria-pressed={selected}
            style={selected ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${selected ? "" : "border"}`}
          >
            <DietaryTagIcon tag={tag} size={13} className={selected ? "!text-current" : ""} />
            {dietaryTagLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}
