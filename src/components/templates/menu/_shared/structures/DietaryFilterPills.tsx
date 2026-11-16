"use client";

import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { MenuStructureTheme } from "./buildMenuTheme";
import { dietaryTagLabel } from "@/constants/dietary.constants";
import { DietaryTagIcon } from "./DietaryBadges";

/** Guest-facing dietary filter pills. One row that scrolls sideways (with
 *  faded edges) on phones and wraps on wider screens. Renders nothing when no
 *  dish is tagged, so it never adds empty chrome. */
export function DietaryFilterPills({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  if (!p.allDietaryTags || p.allDietaryTags.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Dietary preferences"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]"
    >
      {p.allDietaryTags.map((tag) => {
        const selected = p.activeDietaryTag === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => p.setActiveDietaryTag(selected ? null : tag)}
            aria-pressed={selected}
            style={
              selected
                ? { background: t.accent, color: t.accentText, borderColor: t.accent }
                : { borderColor: t.border, color: t.textPrimary, background: t.surface }
            }
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <DietaryTagIcon tag={tag} size={14} className={selected ? "!text-current" : ""} />
            {dietaryTagLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}
