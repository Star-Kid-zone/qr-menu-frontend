"use client";

import type { IconType } from "react-icons";
import {
  PiEggFill,
  PiFireSimpleFill,
  PiForkKnifeFill,
  PiGrainsSlashFill,
  PiHandsPrayingFill,
  PiLeafFill,
  PiPlantFill,
  PiWarningFill,
  PiDropSlashFill,
} from "react-icons/pi";
import { createContext, useContext } from "react";
import type { Menu } from "@/types";
import { allergenLabel, dietaryTagLabel, SPICE_LEVELS } from "@/constants/dietary.constants";
import { itemChips } from "@/components/site-system/menu-kit/attributes";

/**
 * The menu's currency symbol, for the sizes line on item cards. Set once by
 * the menu page (TenantMenuPage / the admin preview) so every menu structure
 * gets item sizes without each one passing it down.
 */
export const MenuCurrencyContext = createContext<string>("");

/** Three-chilli heat meter: lit chillies for the level, faint ones for the
 *  rest, so "Mild" and "Hot" are distinguishable at a glance. Used by the
 *  guest menu, the admin preview and the spice picker. */
export function SpiceMeter({ level, size = 12, className = "" }: { level: number; size?: number; className?: string }) {
  const label = SPICE_LEVELS.find((l) => l.value === level)?.label ?? `Level ${level}`;
  return (
    <span role="img" aria-label={`Spice level: ${label}`} className={`inline-flex items-center ${className}`}>
      {[1, 2, 3].map((n) => (
        <PiFireSimpleFill
          key={n}
          size={size}
          aria-hidden
          className={n <= level ? "text-red-600 dark:text-red-400" : "text-current opacity-20"}
          style={{ marginInline: -1 }}
        />
      ))}
    </span>
  );
}

const DIETARY_TAG_ICONS: Record<string, { Icon: IconType; color: string }> = {
  vegetarian: { Icon: PiLeafFill, color: "text-green-600 dark:text-green-400" },
  vegan: { Icon: PiPlantFill, color: "text-emerald-600 dark:text-emerald-400" },
  gluten_free: { Icon: PiGrainsSlashFill, color: "text-amber-600 dark:text-amber-400" },
  dairy_free: { Icon: PiDropSlashFill, color: "text-sky-600 dark:text-sky-400" },
  jain: { Icon: PiHandsPrayingFill, color: "text-orange-600 dark:text-orange-400" },
  egg: { Icon: PiEggFill, color: "text-yellow-600 dark:text-yellow-400" },
};

/** Vector icon for a dietary tag — renders identically on every OS, unlike
 *  emoji. Unknown tags fall back to a neutral fork-and-knife. */
export function DietaryTagIcon({ tag, size = 12, className = "" }: { tag: string; size?: number; className?: string }) {
  const { Icon, color } = DIETARY_TAG_ICONS[tag] ?? { Icon: PiForkKnifeFill, color: "text-current" };
  return <Icon aria-hidden size={size} className={`shrink-0 ${color} ${className}`} />;
}

interface DietaryBadgesProps {
  item: Menu;
  className?: string;
  /** Item-detail view: show the spice label and the allergen warning too.
   *  Cards in the list stay compact (tags, chillies, calories only). */
  detailed?: boolean;
}

/** Small inline badge row for a menu item's dietary tags, spice level and
 *  calories — renders nothing for fields that aren't set. Badges inherit the
 *  surrounding text colour, so they sit correctly on light and dark menus. */
export function DietaryBadges({ item, className = "", detailed = false }: DietaryBadgesProps) {
  const currency = useContext(MenuCurrencyContext);
  const tags = item.dietaryTags || [];
  const allergens = detailed ? item.allergens || [] : [];
  const spiceLevel = item.spiceLevel;
  const calories = item.calories;
  // On cards: the item's sizes and a few details (wine colour, ABV, on tap…). The item sheet lists them in full itself.
  const sizes = !detailed && item.priceOptions?.length ? item.priceOptions : [];
  const details = detailed ? [] : itemChips(item, 3);

  if (tags.length === 0 && allergens.length === 0 && !spiceLevel && calories == null && !sizes.length && !details.length) return null;

  const badge = detailed
    ? "h-7 gap-1.5 px-2.5 text-xs"
    : "h-5 gap-1 px-1.5 text-[11px]";
  const base = `inline-flex items-center whitespace-nowrap rounded-full font-medium leading-none ring-1 ring-inset ring-current/15 ${badge}`;
  const icon = detailed ? 14 : 12;
  const spiceLabel = SPICE_LEVELS.find((l) => l.value === spiceLevel)?.label;

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      {sizes.length ? (
        <p className="flex flex-wrap gap-x-3 text-xs font-semibold tabular-nums" aria-label="Sizes and prices">
          {sizes.map((o) => (
            <span key={o.label}>
              <span className="font-normal opacity-75">{o.label}</span> {currency}
              {o.price}
            </span>
          ))}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-1.5 empty:hidden">
        {details.map((d) => (
          <span key={d} className={base}>
            <span className="opacity-80">{d}</span>
          </span>
        ))}
        {tags.map((tag) => (
          <span key={tag} title={dietaryTagLabel(tag)} className={base}>
            <DietaryTagIcon tag={tag} size={icon} />
            <span className="opacity-80">{dietaryTagLabel(tag)}</span>
          </span>
        ))}
        {!!spiceLevel && (
          <span title={`Spice level: ${spiceLabel ?? spiceLevel}`} className={base}>
            <SpiceMeter level={spiceLevel} size={icon} />
            {detailed && spiceLabel ? <span className="opacity-80">{spiceLabel}</span> : null}
          </span>
        )}
        {calories != null && (
          <span className={`${base} tabular-nums`}>
            <span className="opacity-80">{calories} kcal</span>
          </span>
        )}
      </div>
      {allergens.length > 0 && (
        <p className="flex items-start gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
          <PiWarningFill size={14} aria-hidden className="mt-px shrink-0" />
          <span>Contains {allergens.map(allergenLabel).join(", ")}</span>
        </p>
      )}
    </div>
  );
}
