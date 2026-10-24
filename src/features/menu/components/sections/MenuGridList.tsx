"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PiSparkleFill,
  PiPencilSimpleBold,
  PiTrashBold,
} from "react-icons/pi";
import { cn } from "@/shared/utils";
import { NoImagePlaceholder } from "@/components/templates/core/NoImagePlaceholder";
import type { MenuItem } from "../../types";
import { getItemDisplayName } from "../../utils";

export interface MenuGridListProps {
  filteredItems: MenuItem[];
  togglingId: string | null;
  handleToggleAvailability: (item: MenuItem) => void;
  setDeleteTarget: (item: MenuItem | null) => void;
}

export function MenuGridList({
  filteredItems,
  togglingId,
  handleToggleAvailability,
  setDeleteTarget,
}: MenuGridListProps) {
  return (
    <>
      {/* Mobile Layout (< sm): High-End Food Cards */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs transition hover:border-border/80 active:bg-muted/30"
          >
            {/* Food Square Image */}
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={getItemDisplayName(item)}
                  fill
                  className="object-cover"
                />
              ) : (
                <NoImagePlaceholder iconSize="sm" label="" className="p-1" />
              )}
              {item.popular && (
                <span className="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-xs">
                  <PiSparkleFill size={9} />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                  {item.category || "Dish"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAvailability(item);
                  }}
                  disabled={togglingId === item.id}
                  className={cn(
                    "rounded px-1.5 py-0.2 text-[9px] font-semibold transition-colors active:scale-95",
                    item.availability
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {togglingId === item.id ? "..." : item.availability ? "Available" : "Sold Out"}
                </button>
              </div>
              <h3 className="truncate text-xs font-bold text-foreground">
                {getItemDisplayName(item)}
              </h3>
              <p className="mt-1 text-xs font-bold tabular-figures text-foreground">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1.5">
              <Link
                href={`/admin/editmenu/${item.id}`}
                aria-label={`Edit ${getItemDisplayName(item)}`}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 shadow-xs"
              >
                <PiPencilSimpleBold size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(item)}
                aria-label={`Delete ${getItemDisplayName(item)}`}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95 shadow-xs"
              >
                <PiTrashBold size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid Layout (sm+) */}
      <div className="grid auto-rows-max grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            {/* Photo Area */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={getItemDisplayName(item)}
                  fill
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              ) : (
                <NoImagePlaceholder iconSize="md" label="No Image" />
              )}

              {/* Top Badges */}
              <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                {item.popular && (
                  <span className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-xs backdrop-blur-xs">
                    <PiSparkleFill size={10} />
                    Popular
                  </span>
                )}
              </div>

              <div className="absolute right-2.5 top-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleAvailability(item);
                  }}
                  disabled={togglingId === item.id}
                  title="Tap to toggle sold-out status"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs transition active:scale-95",
                    item.availability
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-black/60 text-white/90 hover:bg-black/70"
                  )}
                >
                  {togglingId === item.id ? "..." : item.availability ? "Available" : "Sold Out"}
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                  {item.category || "General"}
                </span>
                {item.type && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground truncate">
                    {item.type}
                  </span>
                )}
              </div>

              <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                {getItemDisplayName(item)}
              </h3>

              {/* Price & Action Row */}
              <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">Price</p>
                  <p className="text-base font-bold tabular-figures text-foreground">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/editmenu/${item.id}`}
                    aria-label={`Edit ${getItemDisplayName(item)}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <PiPencilSimpleBold size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${getItemDisplayName(item)}`}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <PiTrashBold size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
