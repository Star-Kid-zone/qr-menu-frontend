"use client";

import { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import { toast } from "@/components/ui";
import { menuService } from "@/services/menu.service";
import { workspaceService, type WorkspaceData } from "@/services/workspace.service";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getApiErrorMessage } from "@/utils";
import { getRawStorageItem, setRawStorageItem } from "@/utils/storage";
import type { MenuItem } from "../types";
import { getItemDisplayName } from "../utils";

const ONBOARDING_DISMISSED_KEY = "qr_menu_onboarding_dismissed";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const getOnboardingNotDismissedSnapshot = () => !getRawStorageItem(ONBOARDING_DISMISSED_KEY);
const getOnboardingServerSnapshot = () => false;

const BULK_DELETE_MAX = 200;

/** Runs `task` over `items` a few at a time so a big selection doesn't fire dozens of requests at once. */
async function settleInBatches<T>(items: T[], task: (item: T) => Promise<unknown>, size = 4) {
  const results: PromiseSettledResult<unknown>[] = [];
  for (let i = 0; i < items.length; i += size) {
    results.push(...(await Promise.allSettled(items.slice(i, i + size).map(task))));
  }
  return results;
}

export function useMenuListState() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [importOpen, setImportOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [industryLoading, setIndustryLoading] = useState(true);
  const [onboardingDismissedNow, setOnboardingDismissedNow] = useState(false);
  // Server and first client render keep the banner hidden; it appears after
  // hydration unless the dismissal is stored.
  const onboardingNotDismissed = useSyncExternalStore(
    subscribeToStorage,
    getOnboardingNotDismissedSnapshot,
    getOnboardingServerSnapshot
  );
  const showOnboardingBanner = onboardingNotDismissed && !onboardingDismissedNow;

  const dismissOnboardingBanner = useCallback(() => {
    setRawStorageItem(ONBOARDING_DISMISSED_KEY, "true");
    setOnboardingDismissedNow(true);
  }, []);

  useEffect(() => {
    workspaceService
      .getWorkspace()
      .then((res) => setWorkspace(res.data))
      .catch((err: unknown) => console.error("Failed to load workspace:", err))
      .finally(() => setIndustryLoading(false));
  }, []);

  // The industry follows the business type chosen in the website studio (set on the server).
  const currentIndustryId = workspace?.business?.industryId != null ? Number(workspace.business.industryId) : null;

  const {
    data: itemsData,
    error: itemsError,
    refetch: fetchMenus,
  } = useAsyncData(
    async () => (await menuService.getMenus()).data as MenuItem[],
    [],
    "Failed to load menu items",
  );
  const items = useMemo(() => itemsData ?? [], [itemsData]);

  useEffect(() => {
    if (itemsError) toast.error(itemsError);
  }, [itemsError]);

  // Called from ConfirmDeleteModal, which shows the success toast or the
  // inline error, so this must not toast and must let failures propagate.
  const handleDelete = useCallback(async (id: string) => {
    await menuService.deleteMenu(id);
    fetchMenus();
  }, [fetchMenus]);

  const handleToggleAvailability = useCallback(async (item: MenuItem) => {
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
  }, [fetchMenus]);

  const dynamicCategories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));
  }, [items]);

  const categories = useMemo(() => {
    return ["All", "Popular", "Sold out", ...dynamicCategories];
  }, [dynamicCategories]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const displayName = getItemDisplayName(item).toLowerCase();
      const s = search.toLowerCase();
      const matchesSearch =
        displayName.includes(s) ||
        (item.category && item.category.toLowerCase().includes(s)) ||
        (item.type && item.type.toLowerCase().includes(s));
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Popular"
        ? !!item.popular
        : selectedCategory === "Sold out"
          ? !item.availability
          : item.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

  // Bulk actions only ever apply to dishes that are selected AND currently
  // visible, so a filter change can't leave hidden dishes silently selected.
  const selectedItems = useMemo(() => filteredItems.filter((i) => selectedIds.has(String(i.id))), [filteredItems, selectedIds]);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const summarise = (ok: number, failed: number, doneText: string) => {
    if (failed === 0) toast.success(`${doneText} ${ok} ${ok === 1 ? "dish" : "dishes"}`);
    else toast.error(`${doneText} ${ok}, but ${failed} failed. They are still selected so you can try again.`);
  };

  /** Uses the single-dish toggle so sold-out dishes keep their end-of-day auto-revival. */
  const bulkSetAvailability = useCallback(async (on: boolean) => {
    const targets = selectedItems.filter((i) => i.availability !== on);
    if (targets.length === 0) {
      toast.info(on ? "Those dishes are already on the menu" : "Those dishes are already sold out");
      return;
    }
    setBulkBusy(true);
    try {
      const results = await settleInBatches(targets, (i) => menuService.toggleAvailability(i.id));
      const failedIds = new Set(targets.filter((_, idx) => results[idx].status === "rejected").map((i) => String(i.id)));
      setSelectedIds(failedIds);
      summarise(targets.length - failedIds.size, failedIds.size, on ? "Put on the menu:" : "Marked sold out:");
      await fetchMenus();
    } finally {
      setBulkBusy(false);
    }
  }, [selectedItems, fetchMenus]);

  const bulkMoveCategory = useCallback(async (category: string) => {
    if (!category || selectedItems.length === 0) return;
    setBulkBusy(true);
    try {
      await menuService.bulkUpdate(selectedItems.map((i) => i.id), { category });
      toast.success(`Moved ${selectedItems.length} ${selectedItems.length === 1 ? "dish" : "dishes"} to ${category}`);
      setSelectedIds(new Set());
      await fetchMenus();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't move the dishes. Try again."));
    } finally {
      setBulkBusy(false);
    }
  }, [selectedItems, fetchMenus]);

  // Called from ConfirmDeleteModal (it shows the success toast, or the thrown
  // message inline), so failures are thrown, not toasted.
  const bulkDelete = useCallback(async () => {
    const ids = selectedItems.map((i) => i.id);
    let deleted = 0;
    try {
      // The API caps one request at BULK_DELETE_MAX dishes.
      for (let i = 0; i < ids.length; i += BULK_DELETE_MAX) {
        const res = await menuService.bulkDelete(ids.slice(i, i + BULK_DELETE_MAX));
        deleted += res.data.count;
      }
    } finally {
      // Whatever happened, show the real state; deleted dishes drop out of the selection with the refetch.
      setSelectedIds(new Set());
      await fetchMenus();
    }
    if (deleted < ids.length) {
      throw new Error(`Deleted ${deleted} of ${ids.length}. The rest were already removed or couldn't be found.`);
    }
  }, [selectedItems, fetchMenus]);

  return {
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
    workspace,
    industryLoading,
    showOnboardingBanner,
    dismissOnboardingBanner,
    currentIndustryId,
    items,
    fetchMenus,
    handleDelete,
    handleToggleAvailability,
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
    dynamicCategories,
    categories,
    filteredItems,
  };
}
