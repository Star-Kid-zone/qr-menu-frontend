"use client";

import React from "react";
import Link from "next/link";
import { PiPencilSimple, PiTrash } from "react-icons/pi";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatPrice } from "@/utils/price";
import type { MenuItem } from "../../types";
import { getItemDisplayName } from "../../utils";
import { DishImage } from "../DishImage";
import { OnMenuSwitch } from "../OnMenuSwitch";
import { SelectBox } from "./SelectBox";
import { cn } from "@/utils/cn";

export interface MenuGridListProps {
  filteredItems: MenuItem[];
  togglingId: string | null;
  handleToggleAvailability: (item: MenuItem) => void;
  setDeleteTarget: (item: MenuItem | null) => void;
  currencySymbol?: string | null;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Compact rows for phones. Exported so the table view can use it below `sm` too. */
export function MenuMobileList({ filteredItems, togglingId, handleToggleAvailability, setDeleteTarget, currencySymbol, selectedIds, onToggleSelect }: MenuGridListProps) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card sm:hidden">
      {filteredItems.map((item) => {
        const name = getItemDisplayName(item);
        return (
          <li key={item.id} className={cn("flex items-center gap-3 p-3", selectedIds.has(String(item.id)) && "bg-primary/5")}>
            <SelectBox checked={selectedIds.has(String(item.id))} onChange={() => onToggleSelect(String(item.id))} label={`Select ${name}`} />
            <DishImage src={item.imageUrl} alt={name} className="size-14 shrink-0 rounded-md" sizes="56px" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-medium text-foreground">{name}</p>
              <p className="truncate text-caption text-muted-foreground">
                {item.category || "Uncategorised"} · {formatPrice(item.price, currencySymbol)}
              </p>
              <div className="mt-2">
                <OnMenuSwitch dishName={name} on={item.availability} busy={togglingId === item.id} onToggle={() => handleToggleAvailability(item)} />
              </div>
            </div>
            <div className="flex shrink-0 items-center">
              <Tooltip content="Edit dish" side="top" decorative>
                <Link href={`/admin/editmenu/${item.id}`} aria-label={`Edit ${name}`} className={iconButton}>
                  <PiPencilSimple aria-hidden className="size-5" />
                </Link>
              </Tooltip>
              <Tooltip content="Delete dish" side="top" align="end" decorative>
                <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${name}`} className={iconButton}>
                  <PiTrash aria-hidden className="size-5" />
                </button>
              </Tooltip>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function MenuGridList(props: MenuGridListProps) {
  const { filteredItems, togglingId, handleToggleAvailability, setDeleteTarget, currencySymbol, selectedIds, onToggleSelect } = props;
  const anySelected = selectedIds.size > 0;
  return (
    <>
      <MenuMobileList {...props} />

      {/* sm and up only: photo cards */}
      <ul className="hidden auto-rows-max grid-cols-2 gap-4 sm:grid md:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const name = getItemDisplayName(item);
          const selected = selectedIds.has(String(item.id));
          return (
            <li key={item.id} className={cn("group/card flex flex-col overflow-hidden rounded-lg border bg-card", selected ? "border-primary ring-2 ring-primary/40" : "border-border")}>
              <div className="relative">
                {/* Hidden until you hover the card; always shown on touch screens and once anything is selected. */}
                <span
                  className={cn(
                    "absolute left-2 top-2 z-10 flex transition-opacity focus-within:opacity-100 pointer-coarse:opacity-100",
                    anySelected ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"
                  )}
                >
                  <SelectBox onImage checked={selected} onChange={() => onToggleSelect(String(item.id))} label={`Select ${name}`} />
                </span>
                <DishImage src={item.imageUrl} alt={name} className="aspect-[16/10] w-full" sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" />
                {item.popular ? (
                  <Badge tone="neutral" className="absolute right-2 top-2 bg-card/95">
                    Popular
                  </Badge>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-caption text-muted-foreground">
                  {item.category || "Uncategorised"}
                  {item.type ? ` · ${item.type}` : ""}
                </p>
                <h3 className="line-clamp-1 text-body-medium text-foreground">{name}</h3>
                <p className="text-body-medium tabular-figures text-foreground">{formatPrice(item.price, currencySymbol)}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <OnMenuSwitch dishName={name} on={item.availability} busy={togglingId === item.id} onToggle={() => handleToggleAvailability(item)} />
                  <div className="flex items-center">
                    <Tooltip content="Edit dish" side="top" decorative>
                      <Link href={`/admin/editmenu/${item.id}`} aria-label={`Edit ${name}`} className={iconButton}>
                        <PiPencilSimple aria-hidden className="size-5" />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Delete dish" side="top" align="end" decorative>
                      <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${name}`} className={iconButton}>
                        <PiTrash aria-hidden className="size-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
