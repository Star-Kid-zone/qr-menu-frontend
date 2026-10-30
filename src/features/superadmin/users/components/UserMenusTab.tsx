"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  Button,
  Input,
  EmptyState,
} from "@/components/ui";
import {
  PiMagnifyingGlassBold,
  PiBookBookmarkBold,
  PiStorefrontBold,
  PiStarBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiPencilSimpleBold,
} from "react-icons/pi";
import type { UserDetailResponse, TenantMenuItem } from "../types";
import { UserMenuEditModal, UserBlueprintSeedModal } from "./modals";

export interface UserMenusTabProps {
  userId: number;
  detail: UserDetailResponse;
  filteredMenus: TenantMenuItem[];
  categories: string[];
  menuSearch: string;
  setMenuSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  handleToggleMenuAvailability: (
    menuId: number,
    currentAvailability: boolean
  ) => Promise<void>;
  editingItem: TenantMenuItem | null;
  setEditingItem: (item: TenantMenuItem | null) => void;
  menuSaving: boolean;
  handleSaveMenuItem: (e: React.FormEvent) => Promise<void>;
  blueprintModalOpen: boolean;
  setBlueprintModalOpen: (val: boolean) => void;
  handleOpenBlueprintModal: () => Promise<void>;
  availableBlueprints: any[];
  selectedBpId: string;
  setSelectedBpId: (val: string) => void;
  bpMode: "append" | "replace";
  setBpMode: (val: "append" | "replace") => void;
  applyingBp: boolean;
  handleApplyBlueprint: () => Promise<void>;
}

export function UserMenusTab({
  userId,
  detail,
  filteredMenus,
  categories,
  menuSearch,
  setMenuSearch,
  selectedCategory,
  setSelectedCategory,
  handleToggleMenuAvailability,
  editingItem,
  setEditingItem,
  menuSaving,
  handleSaveMenuItem,
  blueprintModalOpen,
  setBlueprintModalOpen,
  handleOpenBlueprintModal,
  availableBlueprints,
  selectedBpId,
  setSelectedBpId,
  bpMode,
  setBpMode,
  applyingBp,
  handleApplyBlueprint,
}: UserMenusTabProps) {
  return (
    <div className="space-y-5 pb-8">
      {/* Search, Filters & Blueprint Action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search tenant menu items..."
              className="pl-9"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenBlueprintModal}
            className="shrink-0 border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 font-semibold"
            leftIcon={<PiBookBookmarkBold size={14} />}
          >
            Apply Blueprint
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({detail.menus.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      {filteredMenus.length === 0 ? (
        <EmptyState
          icon={<PiStorefrontBold className="size-8" />}
          title="No menu items found"
          description={
            menuSearch
              ? "No items match your search filter."
              : "This tenant has not added any menu items yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenus.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col overflow-hidden transition-all hover:border-primary/30"
            >
              {/* Item Image */}
              <div className="relative h-44 w-full bg-muted/60">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.item}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <PiStorefrontBold className="size-10 opacity-40" />
                  </div>
                )}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.type === "Veg"
                        ? "border border-emerald-500/30 bg-emerald-950/80 text-emerald-400"
                        : "border border-rose-500/30 bg-rose-950/80 text-rose-400"
                    }`}
                  >
                    {item.type}
                  </span>
                  {item.popular && (
                    <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      <PiStarBold size={10} /> Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Item Info */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-foreground">
                      {item.item}
                    </h3>
                    <span className="font-mono text-base font-bold text-primary">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.category}
                  </p>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleMenuAvailability(item.id, item.availability)
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                      item.availability
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.availability ? (
                      <>
                        <PiEyeBold size={13} /> Available
                      </>
                    ) : (
                      <>
                        <PiEyeSlashBold size={13} /> Unavailable
                      </>
                    )}
                  </button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingItem({ ...item })}
                    leftIcon={<PiPencilSimpleBold size={13} />}
                  >
                    Edit Item
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Menu Item Modal */}
      <UserMenuEditModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        menuSaving={menuSaving}
        handleSaveMenuItem={handleSaveMenuItem}
      />

      {/* Seed Starter Blueprint Modal */}
      <UserBlueprintSeedModal
        blueprintModalOpen={blueprintModalOpen}
        setBlueprintModalOpen={setBlueprintModalOpen}
        userName={detail.user.name}
        userId={userId}
        availableBlueprints={availableBlueprints}
        selectedBpId={selectedBpId}
        setSelectedBpId={setSelectedBpId}
        bpMode={bpMode}
        setBpMode={setBpMode}
        applyingBp={applyingBp}
        handleApplyBlueprint={handleApplyBlueprint}
      />
    </div>
  );
}
