"use client";

import React from "react";
import { cn } from "@/utils/cn";
import type { PromptCategorySummary } from "@/services/superadmin.service";

export interface PromptCategoriesBarProps {
  categories: PromptCategorySummary[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  totalPrompts: number;
}

export function PromptCategoriesBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  totalPrompts,
}: PromptCategoriesBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
      <button
        type="button"
        onClick={() => setSelectedCategory("all")}
        className={cn(
          "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <span>All Categories</span>
        <span
          className={cn(
            "rounded-full px-1.5 text-[10px] font-bold",
            selectedCategory === "all"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {totalPrompts}
        </span>
      </button>

      {categories.map((c) => {
        const isSelected = selectedCategory === c.category;
        return (
          <button
            key={c.category}
            type="button"
            onClick={() => setSelectedCategory(c.category)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <span>{c.category}</span>
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-bold",
                isSelected
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
