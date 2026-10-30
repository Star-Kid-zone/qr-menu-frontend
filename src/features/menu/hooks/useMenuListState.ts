"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "@/components/ui";
import { menuService } from "@/services/menu.service";
import { workspaceService, type WorkspaceData } from "@/services/workspace.service";
import industryService from "@/services/industry.service";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getApiErrorMessage } from "@/utils";
import { getRawStorageItem, setRawStorageItem } from "@/utils/storage";
import type { Industry } from "@/types";
import type { MenuItem } from "../types";
import { getItemDisplayName } from "../utils";

export function useMenuListState() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [importOpen, setImportOpen] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Industry settings
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [industryLoading, setIndustryLoading] = useState(true);
  const [industrySaving, setIndustrySaving] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);

  useEffect(() => {
    const dismissed = getRawStorageItem("qr_menu_onboarding_dismissed");
    if (!dismissed) {
      setShowOnboardingBanner(true);
    }
  }, []);

  const dismissOnboardingBanner = useCallback(() => {
    setRawStorageItem("qr_menu_onboarding_dismissed", "true");
    setShowOnboardingBanner(false);
  }, []);

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

  const handleIndustryChange = useCallback(async (value: string) => {
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
  }, []);

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

  const handleDelete = useCallback(async (id: string) => {
    try {
      await menuService.deleteMenu(id);
      toast.success("Menu item deleted");
      fetchMenus();
    } catch {
      toast.error("Failed to delete item");
    }
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
    return ["All", "Popular", ...dynamicCategories];
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
        (selectedCategory === "Popular" ? !!item.popular : item.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

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
  };
}
