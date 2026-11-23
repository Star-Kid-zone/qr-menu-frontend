"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui";
import {
  superadminService,
  PlatformPrompt,
  PromptCategorySummary,
} from "@/services/superadmin.service";
import { routes } from "@/config/routes";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { DEFAULT_PROMPT_FORM } from "@/constants";
import type { PromptFormData, PromptLibrary, PromptFilters } from "@/types";

// The prompts endpoint has answered with a bare array, `{ data }` or `{ prompts }`; accept each.
function readPromptList(res: unknown): PlatformPrompt[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    const { data, prompts } = res as { data?: unknown; prompts?: unknown };
    if (Array.isArray(data)) return data;
    if (Array.isArray(prompts)) return prompts;
  }
  return [];
}

function readCategories(res: unknown): PromptCategorySummary[] {
  const categories =
    res && typeof res === "object" ? (res as { categories?: unknown }).categories : undefined;
  return Array.isArray(categories) ? categories : [];
}

async function fetchPromptLibrary({
  selectedCategory,
  selectedMediaType,
  favoritesOnly,
  searchQuery,
}: PromptFilters): Promise<PromptLibrary> {
  const res = await superadminService.listPrompts({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    mediaType: selectedMediaType !== "all" ? selectedMediaType : undefined,
    isFavorite: favoritesOnly ? true : undefined,
    search: searchQuery.trim() || undefined,
  });

  const list = readPromptList(res);

  let cats = readCategories(res);
  if (cats.length === 0 && list.length > 0) {
    const catMap = new Map<string, number>();
    list.forEach((p) => {
      if (p.category) {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      }
    });
    cats = Array.from(catMap.entries()).map(([category, count]) => ({ category, count }));
  }

  // If library is completely empty, auto-seed with curated defaults
  if (
    list.length === 0 &&
    !searchQuery.trim() &&
    selectedCategory === "all" &&
    selectedMediaType === "all" &&
    !favoritesOnly
  ) {
    const seededList = readPromptList(await superadminService.seedDefaultPrompts());

    if (seededList.length > 0) {
      const reloaded = await superadminService.listPrompts();
      return { prompts: seededList, categories: readCategories(reloaded) };
    }
  }

  return { prompts: list, categories: cats };
}

export function usePromptsState() {
  const router = useRouter();
  const { confirm, confirmDialog } = useConfirmDialog();
  const [prompts, setPrompts] = useState<PlatformPrompt[]>([]);
  const [categories, setCategories] = useState<PromptCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lightbox preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PlatformPrompt | null>(null);
  const [modalForm, setModalForm] = useState<PromptFormData>(DEFAULT_PROMPT_FORM);
  const [uploadingRefImage, setUploadingRefImage] = useState(false);

  const applyLibrary = useCallback((library: PromptLibrary) => {
    setPrompts(library.prompts);
    setCategories(library.categories);
  }, []);

  const handleLoadError = useCallback((err: unknown) => {
    console.error(err);
    toast.error("Failed to load prompts");
  }, []);

  // Load prompts
  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      applyLibrary(
        await fetchPromptLibrary({ selectedCategory, selectedMediaType, favoritesOnly, searchQuery })
      );
    } catch (err) {
      handleLoadError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedMediaType, favoritesOnly, searchQuery, applyLibrary, handleLoadError]);

  // Changing a filter shows the loading state again (adjusted during render);
  // the effect below then reloads. `loading` starts true for the first load.
  const [loadedFilters, setLoadedFilters] = useState({
    selectedCategory,
    selectedMediaType,
    favoritesOnly,
  });
  if (
    loadedFilters.selectedCategory !== selectedCategory ||
    loadedFilters.selectedMediaType !== selectedMediaType ||
    loadedFilters.favoritesOnly !== favoritesOnly
  ) {
    setLoadedFilters({ selectedCategory, selectedMediaType, favoritesOnly });
    setLoading(true);
  }

  useEffect(() => {
    fetchPromptLibrary({ selectedCategory, selectedMediaType, favoritesOnly, searchQuery })
      .then(applyLibrary)
      .catch(handleLoadError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchQuery is debounced in the effect below
  }, [selectedCategory, selectedMediaType, favoritesOnly, applyLibrary, handleLoadError]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, loadPrompts]);

  // Derived Metrics
  const metrics = useMemo(() => {
    return {
      total: prompts.length,
      photos: prompts.filter((p) => p.mediaType === "image").length,
      videos: prompts.filter((p) => p.mediaType === "video").length,
      withRefs: prompts.filter((p) => p.referenceImages && p.referenceImages.length > 0).length,
      favorites: prompts.filter((p) => p.isFavorite).length,
    };
  }, [prompts]);

  // Copy Prompt to Clipboard
  const handleCopyPrompt = (p: PlatformPrompt) => {
    navigator.clipboard.writeText(p.prompt);
    setCopiedId(p.id);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Launch Prompt in AI Studio
  const handleUseInStudio = async (p: PlatformPrompt) => {
    try {
      await superadminService.recordPromptUsage(p.id);
    } catch {}

    const queryParams = new URLSearchParams({
      tab: "aistudio",
      prompt: p.prompt,
      model: p.recommendedModel || "",
      aspectRatio: p.aspectRatio || "1:1",
      mediaType: p.mediaType || "image",
    });

    if (p.referenceImages && p.referenceImages.length > 0) {
      queryParams.set("refImg", p.referenceImages[0]);
    }

    router.push(`${routes.superadmin.creativeStudio}?${queryParams.toString()}`);
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await superadminService.togglePromptFavorite(id);
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: res.prompt.isFavorite } : p))
      );
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  // Delete Prompt
  const handleDeletePrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Delete prompt?",
      description: "Are you sure you want to delete this prompt from the library?",
      confirmLabel: "Delete prompt",
    });
    if (!confirmed) return;
    try {
      await superadminService.deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prompt deleted from library");
    } catch {
      toast.error("Failed to delete prompt");
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPrompt(null);
    setModalForm(DEFAULT_PROMPT_FORM);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: PlatformPrompt, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPrompt(p);
    setModalForm({
      title: p.title,
      prompt: p.prompt,
      negativePrompt: p.negativePrompt || "",
      category: p.category || "General",
      mediaType: p.mediaType || "image",
      aspectRatio: p.aspectRatio || "1:1",
      recommendedModel: p.recommendedModel || "Ideogram 2.0 (Typography & Posters)",
      stylePreset: p.stylePreset || "Commercial Food Photography",
      referenceImages: p.referenceImages || [],
      tags: p.tags || [],
      cameraNotes: p.cameraNotes || "",
      isFavorite: p.isFavorite || false,
    });
    setIsModalOpen(true);
  };

  // Upload Reference Image
  const handleUploadRefImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }
    try {
      setUploadingRefImage(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setModalForm((prev) => ({
        ...prev,
        referenceImages: [...prev.referenceImages, res.url],
      }));
      toast.success(`Reference image "${file.name}" uploaded!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload reference image");
    } finally {
      setUploadingRefImage(false);
    }
  };

  // Save Prompt (Create / Update)
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.title.trim()) {
      toast.error("Please provide a prompt title");
      return;
    }
    if (!modalForm.prompt.trim()) {
      toast.error("Please provide prompt text");
      return;
    }

    try {
      setActionLoading(true);
      if (editingPrompt) {
        const res = await superadminService.updatePrompt(editingPrompt.id, modalForm);
        setPrompts((prev) =>
          prev.map((p) => (p.id === editingPrompt.id ? res.prompt : p))
        );
        toast.success("Prompt template updated!");
      } else {
        const res = await superadminService.createPrompt(modalForm);
        setPrompts((prev) => [res.prompt, ...prev]);
        toast.success("New prompt created and saved to library!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save prompt");
    } finally {
      setActionLoading(false);
    }
  };

  // Seed / Reset Defaults
  const handleResetDefaults = async () => {
    const confirmed = await confirm({
      title: "Load default prompts?",
      description:
        "This will load the official curated restaurant culinary prompts and reference images into your library. Proceed?",
      confirmLabel: "Load prompts",
      tone: "default",
    });
    if (!confirmed) return;
    try {
      setActionLoading(true);
      const res = await superadminService.seedDefaultPrompts(true);
      toast.success(res?.message || "Curated default prompts loaded!");
      loadPrompts();
    } catch {
      toast.error("Failed to load default presets");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    prompts,
    categories,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    favoritesOnly,
    setFavoritesOnly,
    copiedId,
    previewImageUrl,
    setPreviewImageUrl,
    isModalOpen,
    setIsModalOpen,
    editingPrompt,
    modalForm,
    setModalForm,
    uploadingRefImage,
    metrics,
    handleCopyPrompt,
    handleUseInStudio,
    handleToggleFavorite,
    handleDeletePrompt,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleUploadRefImage,
    handleSavePrompt,
    handleResetDefaults,
    confirmDialog,
  };
}
