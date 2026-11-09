"use client";

import React from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import type { MenuItem } from "../../types";

interface MenuToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  items: MenuItem[];
  /** Number of dishes after search and filter, for the result line. */
  shownCount?: number;
}

function countFor(cat: string, items: MenuItem[]) {
  if (cat === "All") return items.length;
  if (cat === "Popular") return items.filter((i) => i.popular).length;
  if (cat === "Sold out") return items.filter((i) => !i.availability).length;
  return items.filter((i) => i.category === cat).length;
}

/** Search plus one filter. Categories are a dropdown, so 14+ categories never wrap into rows of chips. */
export function MenuToolbar({ search, setSearch, categories, selectedCategory, setSelectedCategory, items, shownCount }: MenuToolbarProps) {
  const filtered = search.trim() !== "" || selectedCategory !== "All";
  return (
    <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <PiMagnifyingGlass aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search dishes"
          placeholder="Search dishes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {/* Select renders a full-width wrapper; size it here so it can't squeeze the search box. */}
      <div className="shrink-0 sm:w-56">
      <Select
        aria-label="Show"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All dishes" : cat} ({countFor(cat, items)})
          </option>
        ))}
      </Select>
      </div>
      <p className="whitespace-nowrap text-body text-muted-foreground sm:ml-auto" aria-live="polite">
        {filtered ? `Showing ${shownCount ?? 0} of ${items.length}` : null}
        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="ml-3 font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </p>
    </div>
  );
}
