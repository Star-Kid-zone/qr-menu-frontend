"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PiSparkleFill,
  PiPencilSimpleBold,
  PiTrashBold,
} from "react-icons/pi";
import { cn } from "@/utils";
import { NoImagePlaceholder } from "@/components/templates/core/NoImagePlaceholder";
import type { MenuItem } from "../../types";
import { getItemDisplayName } from "../../utils";

export interface MenuTableListProps {
  filteredItems: MenuItem[];
  togglingId: string | null;
  handleToggleAvailability: (item: MenuItem) => void;
  setDeleteTarget: (item: MenuItem | null) => void;
}

export function MenuTableList({
  filteredItems,
  togglingId,
  handleToggleAvailability,
  setDeleteTarget,
}: MenuTableListProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3">Dish</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filteredItems.map((item) => (
            <tr key={item.id} className="transition hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={getItemDisplayName(item)} fill className="object-cover" />
                    ) : (
                      <NoImagePlaceholder iconSize="sm" label="" className="p-0.5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{getItemDisplayName(item)}</p>
                    {item.popular && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <PiSparkleFill size={10} /> Popular
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-primary">{item.category}</td>
              <td className="px-4 py-3 text-muted-foreground">{item.type || "—"}</td>
              <td className="px-4 py-3 font-bold tabular-figures text-foreground">${Number(item.price).toFixed(2)}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item)}
                  disabled={togglingId === item.id}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold transition active:scale-95",
                    item.availability
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {togglingId === item.id ? "..." : item.availability ? "Available" : "Sold Out"}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/admin/editmenu/${item.id}`}
                    aria-label={`Edit ${getItemDisplayName(item)}`}
                    className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <PiPencilSimpleBold size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${getItemDisplayName(item)}`}
                    className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <PiTrashBold size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
