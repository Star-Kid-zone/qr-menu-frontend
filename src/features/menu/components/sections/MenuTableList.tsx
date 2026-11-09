"use client";

import React from "react";
import Link from "next/link";
import { PiPencilSimple, PiTrash } from "react-icons/pi";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/price";
import { getItemDisplayName } from "../../utils";
import { DishImage } from "../DishImage";
import { OnMenuSwitch } from "../OnMenuSwitch";
import { MenuMobileList, type MenuGridListProps } from "./MenuGridList";
import { SelectBox } from "./SelectBox";

export type MenuTableListProps = MenuGridListProps & { onToggleAll: () => void };

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function MenuTableList(props: MenuTableListProps) {
  const { filteredItems, togglingId, handleToggleAvailability, setDeleteTarget, currencySymbol, selectedIds, onToggleSelect, onToggleAll } = props;
  const selectedCount = filteredItems.filter((i) => selectedIds.has(String(i.id))).length;
  return (
    <>
      {/* Phones get the same compact rows as the grid view: one rendering only. */}
      <MenuMobileList {...props} />

      <div className="hidden sm:block">
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-0">
                  <SelectBox
                    checked={filteredItems.length > 0 && selectedCount === filteredItems.length}
                    indeterminate={selectedCount > 0}
                    onChange={onToggleAll}
                    label="Select all shown dishes"
                  />
                </TableHead>
                <TableHead>Dish</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>On menu</TableHead>
                <TableHead className="w-0 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const name = getItemDisplayName(item);
                return (
                  <TableRow key={item.id} className={selectedIds.has(String(item.id)) ? "bg-primary/5" : undefined}>
                    <TableCell className="w-0">
                      <SelectBox checked={selectedIds.has(String(item.id))} onChange={() => onToggleSelect(String(item.id))} label={`Select ${name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <DishImage src={item.imageUrl} alt={name} className="size-10 shrink-0 rounded-md" sizes="40px" />
                        <span className="text-body-medium text-foreground">{name}</span>
                        {item.popular ? <Badge tone="neutral">Popular</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.category || "Uncategorised"}
                      {item.type ? ` · ${item.type}` : ""}
                    </TableCell>
                    <TableCell className="text-right tabular-figures">{formatPrice(item.price, currencySymbol)}</TableCell>
                    <TableCell>
                      <OnMenuSwitch dishName={name} on={item.availability} busy={togglingId === item.id} onToggle={() => handleToggleAvailability(item)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
