"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  buttonVariants,
  EmptyState,
  Tooltip,
  ConfirmDeleteModal,
  PageHeader,
  toast,
} from "@/components/ui";
import { MenuImportModal } from "./MenuImportModal";
import { BulkPriceAdjustModal } from "./BulkPriceAdjustModal";
import { PiCalculator, PiCamera, PiDownloadSimple, PiForkKnifeBold, PiListDashes, PiPlus, PiSquaresFour, PiUploadSimple } from "react-icons/pi";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { MenuScanModal } from "./MenuScanModal";
import { industryService } from "@/services/industry.service";
import type { IndustryCategory, IndustryType } from "@/types";
import { downloadCsv, cn } from "@/utils";
import { useMenuListState } from "../hooks/useMenuListState";
import {
  IndustryOnboardingBanner,
  MenuToolbar,
  MenuBulkBar,
  MenuGridList,
  MenuTableList,
} from "./sections";
import { getItemDisplayName } from "../utils";
import { Notice } from "@/components/ui/Notice";
import { usePermissions } from "@/hooks/usePermissions";

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
    industryLoading,
    showOnboardingBanner,
    dismissOnboardingBanner,
    currentIndustryId,
    items,
    fetchMenus,
    handleDelete,
    handleToggleAvailability,
    dynamicCategories,
    categories,
    filteredItems,
    workspace,
    selectedIds,
    selectedItems,
    toggleSelected,
    clearSelection,
    setSelectedIds,
    bulkBusy,
    bulkDeleteOpen,
    setBulkDeleteOpen,
    bulkSetAvailability,
    bulkMoveCategory,
    bulkDelete,
  } = useMenuListState();
  const { canEditWebsite } = usePermissions();
  const [scanOpen, setScanOpen] = useState(false);
  const [scanLists, setScanLists] = useState<{ categories: IndustryCategory[]; types: IndustryType[] }>({ categories: [], types: [] });

  // The scanner needs this restaurant's category and dish-type lists.
  const openScanner = () => {
    setScanOpen(true);
    if (!currentIndustryId) return;
    Promise.all([industryService.getCategories(currentIndustryId), industryService.getTypes(currentIndustryId)])
      .then(([c, t]) => setScanLists({ categories: c.data || [], types: t.data || [] }))
      .catch(() => toast.error("Couldn't load your categories. Try again."));
  };
  const currencySymbol = workspace?.currency?.symbol;

  // Header checkbox / "Select all": everything visible, or clear if all already picked.
  const toggleAllShown = () =>
    setSelectedIds(selectedItems.length === filteredItems.length ? new Set() : new Set(filteredItems.map((i) => String(i.id))));

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ── Header ── */}
      <PageHeader
        title="Menu"
        description={`${items.length} dishes in ${Math.max(dynamicCategories.length, 1)} categories`}
        actions={
          <>
            <div role="group" aria-label="View" className="hidden rounded-md border border-input p-0.5 sm:flex">
              {(
                [
                  ["grid", "Photo cards", "Show dishes as big photo cards", PiSquaresFour],
                  ["list", "List", "Show dishes in a compact list with prices", PiListDashes],
                ] as const
              ).map(([mode, label, hint, Icon]) => (
                <Tooltip key={mode} content={hint}>
                  <button
                    type="button"
                    aria-pressed={viewMode === mode}
                    aria-label={label}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                      viewMode === mode ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                  </button>
                </Tooltip>
              ))}
            </div>
            <Tooltip content="Take a photo of your printed menu and add many dishes at once">
              <button type="button" onClick={openScanner} className={buttonVariants({ variant: "secondary" })}>
                <PiCamera aria-hidden className="size-4" />
                Scan menu
              </button>
            </Tooltip>
            <ActionMenu
              tooltip="Import, export or change prices in bulk"
              items={[
                { label: "Import from spreadsheet", description: "Upload a CSV of dishes", icon: <PiUploadSimple className="size-4" />, onSelect: () => setImportOpen(true) },
                {
                  label: "Export to spreadsheet",
                  description: "Download all dishes as CSV",
                  icon: <PiDownloadSimple className="size-4" />,
                  onSelect: () => void downloadCsv("/menu/export.csv", "menu-items.csv").catch(() => toast.error("Couldn't download the file. Try again.")),
                },
                { label: "Change prices in bulk", description: "Raise or lower many prices", icon: <PiCalculator className="size-4" />, onSelect: () => setBulkPriceOpen(true) },
              ]}
            />
            <Tooltip content="Add one dish by filling in its details" align="end">
              <Link href="/admin/addmenu" className={buttonVariants({ variant: "primary" })}>
                <PiPlus aria-hidden className="size-4" />
                Add dish
              </Link>
            </Tooltip>
          </>
        }
      />

      {/* Restaurant type drives the category and dish-type lists. It is set
          in Settings > Business details (moved from this page). */}
      {!industryLoading && !currentIndustryId ? (
        <Notice
          tone="info"
          title="Set your restaurant type"
          action={
            canEditWebsite ? (
              <Link href="/admin/settings?tab=business" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Set restaurant type
              </Link>
            ) : undefined
          }
        >
          {canEditWebsite
            ? "It decides which categories and dish types you can pick when adding dishes."
            : "Ask the owner to set it in Settings. It decides which categories and dish types you can pick."}
        </Notice>
      ) : null}

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
        shownCount={filteredItems.length}
      />


      {/* ── Content View ── */}
      <div className={cn("relative min-h-0 flex-1 overflow-hidden", filteredItems.length === 0 && "flex flex-col")}>
        {filteredItems.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiForkKnifeBold size={32} />}
              title={search || selectedCategory !== "All" ? "No dishes found" : "Your menu is empty"}
              description={
                search || selectedCategory !== "All"
                  ? "No items match your active search or category."
                  : "Photograph your printed menu and we'll add the dishes for you, or add them one by one."
              }
              action={
                !search && selectedCategory === "All" ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button type="button" onClick={openScanner} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "gap-2")}>
                      <PiCamera aria-hidden size={14} />
                      Scan a menu photo
                    </button>
                    <Link href="/admin/addmenu" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-2")}>
                      <PiPlus aria-hidden size={13} />
                      Add manually
                    </Link>
                  </div>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className={cn("h-full overflow-y-auto pr-0.5", selectedItems.length > 0 ? "pb-28" : "pb-6")}>
            {viewMode === "grid" ? (
              <MenuGridList
                filteredItems={filteredItems}
                togglingId={togglingId}
                handleToggleAvailability={handleToggleAvailability}
                setDeleteTarget={setDeleteTarget}
                currencySymbol={currencySymbol}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelected}
              />
            ) : (
              <MenuTableList
                filteredItems={filteredItems}
                togglingId={togglingId}
                handleToggleAvailability={handleToggleAvailability}
                setDeleteTarget={setDeleteTarget}
                currencySymbol={currencySymbol}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelected}
                onToggleAll={toggleAllShown}
              />
            )}
          </div>
        )}
        {selectedItems.length > 0 ? (
          <MenuBulkBar
            selectedCount={selectedItems.length}
            shownCount={filteredItems.length}
            categories={dynamicCategories}
            busy={bulkBusy}
            onSelectAll={() => setSelectedIds(new Set(filteredItems.map((i) => String(i.id))))}
            onClear={clearSelection}
            onPutOnMenu={() => void bulkSetAvailability(true)}
            onMarkSoldOut={() => void bulkSetAvailability(false)}
            onMoveCategory={(c) => void bulkMoveCategory(c)}
            onDelete={() => setBulkDeleteOpen(true)}
          />
        ) : null}
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

      <ConfirmDeleteModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={bulkDelete}
        title="Delete selected dishes"
        confirmLabel={`Delete ${selectedItems.length}`}
        entityName="dishes"
        successMessage={`Deleted ${selectedItems.length} ${selectedItems.length === 1 ? "dish" : "dishes"}`}
        description={`Delete ${selectedItems.length} ${selectedItems.length === 1 ? "dish" : "dishes"} and their photos and videos? This action cannot be undone.`}
      />

      <MenuImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={fetchMenus}
      />

      <MenuScanModal
        isOpen={scanOpen}
        onClose={() => setScanOpen(false)}
        onImported={fetchMenus}
        industryId={currentIndustryId}
        categories={scanLists.categories}
        types={scanLists.types}
      />

      <BulkPriceAdjustModal
        isOpen={bulkPriceOpen}
        onClose={() => setBulkPriceOpen(false)}
        categories={dynamicCategories}
        items={items}
        onApplied={fetchMenus}
      />
    </div>
  );
}
