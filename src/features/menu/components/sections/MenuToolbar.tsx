"use client";

import React from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { Input } from "@/components/ui";
import { cn } from "@/utils";
import type { MenuItem } from "../../types";

export interface MenuToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  items: MenuItem[];
}

export function MenuToolbar({
  search,
  setSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  items,
}: MenuToolbarProps) {
  return (
    <div className="shrink-0 space-y-2 rounded-xl border border-border bg-card p-2.5 shadow-xs sm:p-3">
      {/* Search */}
      <div className="relative">
        <PiMagnifyingGlassBold
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search dishes or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8.5 text-xs sm:h-9 sm:pl-9"
        />
      </div>

      {/* Categories Horizontal Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
        {categories.map((cat) => {
          const selected = cat === selectedCategory;
          const count =
            cat === "All"
              ? items.length
              : cat === "Popular"
                ? items.filter((i) => i.popular).length
                : items.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold",
                  selected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
