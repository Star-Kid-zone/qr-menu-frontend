"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIndustryTaxonomy } from "@/hooks/useIndustryTaxonomy";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getApiErrorMessage } from "@/utils/errors";
import { resolveBusinessType } from "@/components/site-system/business-types";
import type { MenuItemDetail } from "@/types/admin/menu/menu.types";
import {
  cleanAttributes,
  cleanPriceOptions,
  lowestOptionPrice,
  type ItemAttributes,
  type PriceOptionRow,
} from "../components/ItemDetailsFields";

import { MAX_DISH_PHOTOS, MENU_ALL_DAY } from "@/constants/menu.constants";
import { routes } from "@/config/routes";

/**
 * State and actions for the add-dish and edit-dish forms. With `menuId` the dish is loaded
 * (`itemLoading` / `itemError` / `retryItem`), existing photos and videos are shown and can be
 * removed, and submit updates; without it, submit creates (prefilling the name from `?name=`).
 */
export function useMenuItemForm({ menuId }: { menuId?: string } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = Boolean(menuId);

  const [itemName, setItemName] = useState(() => (isEdit ? "" : (searchParams.get("name") ?? "").slice(0, 100)));
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([MENU_ALL_DAY]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number | null>(null);
  const [calories, setCalories] = useState("");
  const [attributes, setAttributes] = useState<ItemAttributes>({});
  const [priceOptions, setPriceOptions] = useState<PriceOptionRow[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [mediaKeysToDelete, setMediaKeysToDelete] = useState<string[]>([]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  // Industry is a business-level setting (managed once from the Menu page): read, never asked for here.
  const { data: workspace, loading: workspaceLoading } = useWorkspace();
  const industryId = workspace?.business?.industryId != null ? String(workspace.business.industryId) : null;
  const currencySymbol = workspace?.currency?.symbol?.trim() || "$";
  const business = useMemo(
    () => resolveBusinessType(workspace ? { business_type: workspace.theme?.businessType, site_document: workspace.siteDocument } : null),
    [workspace],
  );
  const taxonomy = useIndustryTaxonomy(industryId);
  const industryLoading = workspaceLoading;

  // Edit only: load the dish and copy it into the form state.
  const item = useAsyncData<MenuItemDetail | null>(
    async () => (menuId ? (await menuService.getMenu(menuId)).data : null),
    [menuId],
    "Couldn't load this dish.",
  );
  const loaded = item.data;
  // Copy a freshly loaded dish into the form once, during render (React's "adjust state when data
  // changes" pattern) instead of in an effect, which would render the empty form first.
  const [prefilledFrom, setPrefilledFrom] = useState<MenuItemDetail | null>(null);
  if (loaded && loaded !== prefilledFrom) {
    setPrefilledFrom(loaded);
    setItemName(loaded.item || "");
    setPrice(loaded.price?.toString() || "");
    setDescription(loaded.description || "");
    setIsPopular(Boolean(loaded.popular));
    setIsActive(loaded.availability !== false);
    setSelectedCategory(loaded.category || "");
    setSelectedType(loaded.type || "");
    if (loaded.availabilityTime) setSelectedTimes(loaded.availabilityTime.split(","));
    setExistingImages([
      ...(loaded.imageUrl ? [loaded.imageUrl] : []),
      ...(loaded.images ?? []).filter((url) => url !== loaded.imageUrl),
    ]);
    setExistingVideos(loaded.videos ?? []);
    setDietaryTags(loaded.dietaryTags ?? []);
    setAllergens(loaded.allergens ?? []);
    setSpiceLevel(typeof loaded.spiceLevel === "number" ? loaded.spiceLevel : null);
    setCalories(typeof loaded.calories === "number" ? String(loaded.calories) : "");
    setAttributes(loaded.attributes ?? {});
    setPriceOptions((loaded.priceOptions ?? []).map((o) => ({ label: String(o.label ?? ""), price: String(o.price ?? "") })));
  }

  const fromPrice = lowestOptionPrice(priceOptions);

  // Object URLs are derived from the selected files; the effects only release the previous set.
  const imagePreviews = useMemo(() => images.map((img) => URL.createObjectURL(img)), [images]);
  useEffect(() => () => imagePreviews.forEach((url) => URL.revokeObjectURL(url)), [imagePreviews]);
  const videoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : null), [videoFile]);
  useEffect(() => {
    if (!videoPreviewUrl) return;
    return () => URL.revokeObjectURL(videoPreviewUrl);
  }, [videoPreviewUrl]);

  const toggleTime = (time: string) => {
    if (time === MENU_ALL_DAY) return setSelectedTimes([MENU_ALL_DAY]);
    let next = selectedTimes.filter((t) => t !== MENU_ALL_DAY);
    next = next.includes(time) ? next.filter((t) => t !== time) : [...next, time];
    setSelectedTimes(next.length === 0 ? [MENU_ALL_DAY] : next);
  };

  const requireIndustry = (open: (v: boolean) => void) => {
    if (!industryId) return toast.error("Choose your business type on the Website page first");
    open(true);
  };

  const createTaxonomyEntry = async (kind: "category" | "type", name: string) => {
    if (!industryId) return;
    const setBusy = kind === "category" ? setCategorySubmitting : setTypeSubmitting;
    setBusy(true);
    try {
      if (kind === "category") {
        const res = await industryService.createCategory({ industry_id: industryId, name });
        taxonomy.addCategory(res.data);
        setSelectedCategory(res.data.name);
        toast.success("Category created");
        setCategoryDialogOpen(false);
      } else {
        const res = await industryService.createType({ industry_id: industryId, name });
        taxonomy.addType(res.data);
        setSelectedType(res.data.name);
        toast.success("Type created");
        setTypeDialogOpen(false);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, kind === "category" ? "Failed to create category" : "Failed to create type"));
    } finally {
      setBusy(false);
    }
  };

  const removeExistingImage = (url: string) => {
    setMediaKeysToDelete((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };
  const removeExistingVideo = (url: string) => {
    setMediaKeysToDelete((prev) => [...prev, url]);
    setExistingVideos((prev) => prev.filter((u) => u !== url));
  };
  const addImages = (files: File[]) =>
    setImages((prev) => [...prev, ...files].slice(0, MAX_DISH_PHOTOS - existingImages.length));
  const removeNewImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const submit = async () => {
    const missing: Record<string, string> = {};
    if (!itemName.trim()) missing["item-name"] = "Dish name";
    if (!price && !fromPrice) missing["item-price"] = "Price";
    if (!selectedCategory) missing["category"] = "Category";
    if (!selectedType) missing["type"] = "Dish type";
    setFieldErrors(missing);
    const firstMissing = Object.keys(missing)[0];
    if (firstMissing) {
      document.getElementById(firstMissing)?.focus();
      return;
    }
    if (priceOptions.length !== cleanPriceOptions(priceOptions).length) {
      toast.error("Give every size a name and a price, or remove it.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("item", itemName);
      // With sizes, the headline price is the lowest size (the server enforces the same rule).
      formData.append("price", fromPrice ?? price);
      formData.append("attributes", JSON.stringify(cleanAttributes(attributes)));
      formData.append("priceOptions", JSON.stringify(cleanPriceOptions(priceOptions)));
      formData.append("description", description);
      formData.append("popular", isPopular.toString());
      formData.append("availability", isActive.toString());
      formData.append("availabilityTime", selectedTimes.join(","));
      formData.append("category", selectedCategory);
      formData.append("type", selectedType);
      formData.append("dietaryTags", JSON.stringify(dietaryTags));
      formData.append("allergens", JSON.stringify(allergens));
      if (isEdit) {
        // Edit sends empty values so a cleared field is saved as cleared.
        formData.append("spiceLevel", spiceLevel !== null ? String(spiceLevel) : "");
        formData.append("calories", calories);
        if (mediaKeysToDelete.length > 0) formData.append("mediaKeysToDelete", JSON.stringify(mediaKeysToDelete));
      } else {
        if (spiceLevel !== null) formData.append("spiceLevel", String(spiceLevel));
        if (calories) formData.append("calories", calories);
      }
      images.forEach((img) => formData.append("images", img));
      if (videoFile) formData.append("videos", videoFile);

      if (menuId) await menuService.updateMenu(menuId, formData);
      else await menuService.createMenu(formData);
      toast.success(isEdit ? "Changes saved" : "Dish added");
      router.push(routes.admin.listMenu);
    } catch (error) {
      toast.error(getApiErrorMessage(error, isEdit ? "Couldn't save the dish. Try again." : "Couldn't add the dish. Try again."));
      setSubmitting(false);
    }
  };

  return {
    isEdit,
    backToList: () => router.push(routes.admin.listMenu),
    // Loading the dish (edit only)
    itemLoading: isEdit && item.loading,
    itemError: isEdit ? item.error : null,
    retryItem: item.refetch,
    // Business context
    industryId,
    industryLoading,
    currencySymbol,
    business,
    categories: taxonomy.categories,
    types: taxonomy.types,
    // Fields
    itemName, setItemName,
    price, setPrice,
    fromPrice,
    description, setDescription,
    isPopular, setIsPopular,
    isActive, setIsActive,
    selectedTimes, toggleTime,
    selectedCategory, setSelectedCategory,
    selectedType, setSelectedType,
    dietaryTags, setDietaryTags,
    allergens, setAllergens,
    spiceLevel, setSpiceLevel,
    calories, setCalories,
    attributes, setAttributes,
    priceOptions, setPriceOptions,
    fieldErrors,
    // Media
    images, imagePreviews, addImages, removeNewImage,
    videoFile, setVideoFile, videoPreviewUrl,
    existingImages, removeExistingImage,
    existingVideos, removeExistingVideo,
    // New category / type dialogs
    categoryDialogOpen, openCategoryDialog: () => requireIndustry(setCategoryDialogOpen), closeCategoryDialog: () => setCategoryDialogOpen(false),
    typeDialogOpen, openTypeDialog: () => requireIndustry(setTypeDialogOpen), closeTypeDialog: () => setTypeDialogOpen(false),
    categorySubmitting, typeSubmitting,
    createCategory: (name: string) => createTaxonomyEntry("category", name),
    createType: (name: string) => createTaxonomyEntry("type", name),
    // Submit
    submitting,
    submit,
  };
}

export type MenuItemFormState = ReturnType<typeof useMenuItemForm>;
