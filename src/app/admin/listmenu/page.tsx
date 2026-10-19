"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { menuService } from "@/services/menu.service";
import { workspaceService, type WorkspaceData } from "@/services/workspace.service";
import industryService from "@/services/industry.service";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { MenuImportModal } from "@/components/admin/MenuImportModal";
import { BulkPriceAdjustModal } from "@/components/admin/BulkPriceAdjustModal";
import { toast } from "@/components/ui/toast";
import {
  PiForkKnifeBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
  PiDownloadSimpleBold,
  PiUploadSimpleBold,
  PiCalculatorBold,
  PiSparkleFill,
  PiMagnifyingGlassBold,
  PiSquaresFourBold,
  PiListDashesBold,
  PiXBold,
} from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cn } from "@/utils/cn";
import { NoImagePlaceholder } from "@/components/templates/core/NoImagePlaceholder";
import { getApiErrorMessage } from "@/utils/errors";
import type { Industry } from "@/types";

interface MenuItem {
  id: string;
  name?: string;
  item: string;
  category: string;
  price: number;
  availability: boolean;
  imageUrl?: string;
  type?: string;
  popular?: boolean;
  description?: string;
}

const getItemDisplayName = (item: MenuItem) => item.item || item.name || "";

export default function ListMenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [importOpen, setImportOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Industry — a business-level setting (set once), which drives the
  // Category/Type options available when adding/editing menu items.
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industryLoading, setIndustryLoading] = useState(true);
  const [industrySaving, setIndustrySaving] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);

  useEffect(() => {
    try {
      const dismissed = typeof window !== 'undefined' ? localStorage.getItem("qr_menu_onboarding_dismissed") : null;
      if (!dismissed) {
        setShowOnboardingBanner(true);
      }
    } catch {
      // safe ignore localStorage errors
    }
  }, []);

  const dismissOnboardingBanner = () => {
    try {
      localStorage.setItem("qr_menu_onboarding_dismissed", "true");
    } catch {
      // safe ignore
    }
    setShowOnboardingBanner(false);
  };

  useEffect(() => {
    async function loadIndustryContext() {
      try {
        setIndustryLoading(true);
        const [wsRes, indRes] = await Promise.all([
          workspaceService.getWorkspace(),
          industryService.getIndustries(),
        ]);
        setWorkspace(wsRes.data);
        setIndustries(indRes.data || []);
      } catch (err) {
        console.error("Failed to load industry context:", err);
      } finally {
        setIndustryLoading(false);
      }
    }
    loadIndustryContext();
  }, []);

  const currentIndustryId = workspace?.business?.industryId != null ? Number(workspace.business.industryId) : null;

  const handleIndustryChange = async (value: string) => {
    setIndustrySaving(true);
    try {
      const industryId = value ? Number(value) : null;
      await workspaceService.updateWorkspace({ business: { industryId } });
      setWorkspace((prev) =>
        prev && prev.business ? { ...prev, business: { ...prev.business, industryId } } : prev,
      );
      toast.success("Industry updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update industry"));
    } finally {
      setIndustrySaving(false);
    }
  };

  const {
    data: itemsData,
    error: itemsError,
    refetch: fetchMenus,
  } = useAsyncData(
    async () => (await menuService.getMenus()).data as MenuItem[],
    [],
    "Failed to load menu items",
  );
  const items = itemsData ?? [];

  useEffect(() => {
    if (itemsError) toast.error(itemsError);
  }, [itemsError]);

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenu(id);
      toast.success("Menu item deleted");
      fetchMenus();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    setTogglingId(item.id);
    try {
      const res = await menuService.toggleAvailability(item.id);
      toast.success((res.data as { message?: string })?.message || "Availability updated");
      fetchMenus();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update availability"));
    } finally {
      setTogglingId(null);
    }
  };

  // "All" and "Popular" are pinned quick-filters; the rest are the business's
  // actual categories, sorted alphabetically.
  const dynamicCategories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b));
  const categories = ["All", "Popular", ...dynamicCategories];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      getItemDisplayName(item).toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Popular" ? !!item.popular : item.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

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
      {showOnboardingBanner && items.length > 0 && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground shadow-xs">
          <div className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <PiSparkleFill className="size-4" />
            </span>
            <div className="space-y-0.5">
              <p className="font-bold text-foreground">Starter Menu Loaded</p>
              <p className="text-muted-foreground leading-relaxed">
                We’ve pre-loaded sample dishes with photos, categories, and realistic prices so your digital QR menu is live immediately. You can customize, rename, reprice, or delete any dishes anytime!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissOnboardingBanner}
            className="rounded-lg p-1 text-muted-foreground hover:bg-primary/10 hover:text-foreground shrink-0 transition"
            title="Dismiss notice"
          >
            <PiXBold className="size-4" />
          </button>
        </div>
      )}

      {/* ── Search & Horizontally Scrollable Categories ── */}
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

            {/* ── Mobile Layout (< sm): High-End Food Cards ── */}
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
                        onClick={(e) => { e.stopPropagation(); handleToggleAvailability(item); }}
                        disabled={togglingId === item.id}
                        className={cn(
                          "rounded px-1.5 py-0.2 text-[9px] font-semibold transition-colors active:scale-95",
                          item.availability
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
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

            {/* ── Tablet & Desktop Layout (sm+) ── */}
            <div className="hidden sm:block">
              {viewMode === "grid" ? (
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
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleToggleAvailability(item); }}
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
              ) : (
                /* List View for Desktop */
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
              )}
            </div>

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
