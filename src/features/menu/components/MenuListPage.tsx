"use client";

import React from "react";
import Link from "next/link";
import {
  Select,
  Button,
  buttonVariants,
  EmptyState,
  ConfirmDeleteModal,
  toast,
} from "@/components/ui";
import { MenuImportModal } from "./MenuImportModal";
import { BulkPriceAdjustModal } from "./BulkPriceAdjustModal";
import {
  PiForkKnifeBold,
  PiPlusBold,
  PiDownloadSimpleBold,
  PiUploadSimpleBold,
  PiCalculatorBold,
  PiSquaresFourBold,
  PiListDashesBold,
} from "react-icons/pi";
import { downloadCsv, cn } from "@/utils";
import { useMenuListState } from "../hooks/useMenuListState";
import {
  IndustryOnboardingBanner,
  MenuToolbar,
  MenuGridList,
  MenuTableList,
} from "./sections";
import { getItemDisplayName } from "../utils";

export function MenuListPage() {
  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    deleteTarget,
    setDeleteTarget,
    viewMode,
    setViewMode,
    importOpen,
    setImportOpen,
    bulkPriceOpen,
    setBulkPriceOpen,
    togglingId,
    industries,
    industryLoading,
    industrySaving,
    showOnboardingBanner,
    dismissOnboardingBanner,
    currentIndustryId,
    handleIndustryChange,
    items,
    fetchMenus,
    handleDelete,
    handleToggleAvailability,
    dynamicCategories,
    categories,
    filteredItems,
  } = useMenuListState();

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Menu Items</h1>
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {items.length} dishes in {Math.max(dynamicCategories.length, 1)} categories
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Industry (set once; drives Category/Type on Add/Edit Menu Item) */}
          {!industryLoading && (
            <Select
              value={currentIndustryId ? String(currentIndustryId) : ""}
              onChange={(e) => handleIndustryChange(e.target.value)}
              disabled={industrySaving}
              className="h-8 w-[6.5rem] px-2 py-0 text-[11px] sm:h-9 sm:w-36 sm:text-xs"
            >
              <option value="">Set Industry</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </Select>
          )}

          {/* View Switcher (Desktop/Tablet) */}
          <div className="hidden items-center rounded-lg border border-border bg-card p-0.5 shadow-xs sm:flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <PiSquaresFourBold size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <PiListDashesBold size={15} />
            </button>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            leftIcon={<PiCalculatorBold size={14} />}
            onClick={() => setBulkPriceOpen(true)}
          >
            Bulk Price
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            leftIcon={<PiUploadSimpleBold size={14} />}
            onClick={() => setImportOpen(true)}
          >
            Import
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            leftIcon={<PiDownloadSimpleBold size={14} />}
            onClick={() =>
              downloadCsv("/menu/export.csv", "menu-items.csv").catch(() =>
                toast.error("Failed to export CSV"),
              )
            }
          >
            Export
          </Button>

          <Link
            href="/admin/addmenu"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 gap-1 px-3 text-xs sm:h-9 sm:gap-1.5 sm:px-3.5 shadow-sm"
            )}
          >
            <PiPlusBold size={13} />
            <span>Add Item</span>
          </Link>
        </div>
      </div>

      {/* ── Onboarding Starter Menu Banner ── */}
      <IndustryOnboardingBanner
        show={showOnboardingBanner}
        itemCount={items.length}
        onDismiss={dismissOnboardingBanner}
      />

      {/* ── Search & Horizontally Scrollable Categories ── */}
      <MenuToolbar
        search={search}
        setSearch={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        items={items}
      />

      {/* ── Content View ── */}
      <div className={cn("min-h-0 flex-1 overflow-hidden", filteredItems.length === 0 && "flex flex-col")}>
        {filteredItems.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiForkKnifeBold size={32} />}
              title="No dishes found"
              description={
                search || selectedCategory !== "All"
                  ? "No items match your active search or category."
                  : "Add your first menu dish to get started."
              }
              action={
                !search && selectedCategory === "All" ? (
                  <Link href="/admin/addmenu" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
                    <PiPlusBold size={13} />
                    Add Menu Item
                  </Link>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-0.5 pb-6">
            {viewMode === "grid" ? (
              <MenuGridList
                filteredItems={filteredItems}
                togglingId={togglingId}
                handleToggleAvailability={handleToggleAvailability}
                setDeleteTarget={setDeleteTarget}
              />
            ) : (
              <MenuTableList
                filteredItems={filteredItems}
                togglingId={togglingId}
                handleToggleAvailability={handleToggleAvailability}
                setDeleteTarget={setDeleteTarget}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleDelete(deleteTarget.id);
        }}
        entityName="menu item"
        description={`Are you sure you want to delete "${
          deleteTarget ? getItemDisplayName(deleteTarget) : "this menu item"
        }"? This action cannot be undone.`}
      />

      <MenuImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={fetchMenus}
      />

      <BulkPriceAdjustModal
        isOpen={bulkPriceOpen}
        onClose={() => setBulkPriceOpen(false)}
        categories={dynamicCategories}
        onApplied={fetchMenus}
      />
    </div>
  );
}
