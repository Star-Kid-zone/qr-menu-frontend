"use client";

import React from "react";
import { PiMagnifyingGlassBold, PiStarFill } from "react-icons/pi";
import { Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { MEDIA_TYPE_TABS } from "../../constants";

export interface PromptFiltersBarProps {
  selectedMediaType: string;
  setSelectedMediaType: (type: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (fav: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PromptFiltersBar({
  selectedMediaType,
  setSelectedMediaType,
  favoritesOnly,
  setFavoritesOnly,
  searchQuery,
  setSearchQuery,
}: PromptFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      {/* Media Type Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {MEDIA_TYPE_TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = selectedMediaType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedMediaType(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border",
            favoritesOnly
              ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <PiStarFill
            className={cn("h-3.5 w-3.5", favoritesOnly ? "text-amber-500" : "text-muted-foreground")}
          />
          <span>Starred</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative min-w-[240px]">
        <PiMagnifyingGlassBold
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search prompts, dishes, models, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8.5 text-xs sm:h-9 sm:pl-9"
        />
      </div>
    </div>
  );
}
