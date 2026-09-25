"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ToggleCard } from "@/components/ui/ToggleCard";
import { PromptDialog } from "@/components/ui/PromptDialog";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { MenuScanModal } from "@/components/admin/MenuScanModal";
import { MenuItemPreviewCard } from "@/components/admin/MenuItemPreviewCard";
import { DietaryNutritionFields } from "@/components/admin/DietaryNutritionFields";
import Link from "next/link";
import {
  PiImageBold,
  PiVideoCameraBold,
  PiTrashBold,
  PiClockBold,
  PiMagicWandBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { workspaceService } from "@/services/workspace.service";
import { IndustryCategory, IndustryType } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";

export default function AddMenuPage() {
  const router = useRouter();
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["All Day"]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [types, setTypes] = useState<IndustryType[]>([]);

  // Industry is a business-level setting (managed once from the Menu Items
  // page) — read it here, never asked for on this form.
  const [industryId, setIndustryId] = useState<number | null>(null);
  const [industryLoading, setIndustryLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number | null>(null);
  const [calories, setCalories] = useState("");

  useEffect(() => {
    workspaceService.getWorkspace()
      .then((res) => {
        const id = res.data.business?.industryId;
        setIndustryId(id != null ? Number(id) : null);
      })
      .catch(console.error)
      .finally(() => setIndustryLoading(false));
  }, []);

  useEffect(() => {
    if (industryId) {
      industryService.getCategories(industryId).then(res => setCategories(res.data || [])).catch(console.error);
      industryService.getTypes(industryId).then(res => setTypes(res.data || [])).catch(console.error);
    } else {
      setCategories([]);
      setTypes([]);
    }
  }, [industryId]);

  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setImagePreviews(urls);
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [images]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const toggleTime = (time: string) => {
    if (time === "All Day") { setSelectedTimes(["All Day"]); return; }
    let newTimes = selectedTimes.filter(t => t !== "All Day");
    if (newTimes.includes(time)) {
      newTimes = newTimes.filter(t => t !== time);
    } else {
      newTimes.push(time);
    }
    setSelectedTimes(newTimes.length === 0 ? ["All Day"] : newTimes);
  };

  const handleCreateCategory = () => {
    if (!industryId) return toast.error("Set your industry on the Menu Items page first");
    setCategoryDialogOpen(true);
  };

  const handleCreateType = () => {
    if (!industryId) return toast.error("Set your industry on the Menu Items page first");
    setTypeDialogOpen(true);
  };

  const handleSubmitCategory = async (name: string) => {
    if (!industryId) return;
    setCategorySubmitting(true);
    try {
      const res = await industryService.createCategory({ industry_id: industryId, name });
      setCategories([...categories, res.data]);
      setSelectedCategory(res.data.name);
      toast.success("Category created");
      setCategoryDialogOpen(false);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create category"));
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleSubmitType = async (name: string) => {
    if (!industryId) return;
    setTypeSubmitting(true);
    try {
      const res = await industryService.createType({ industry_id: industryId, name });
      setTypes([...types, res.data]);
      setSelectedType(res.data.name);
      toast.success("Type created");
      setTypeDialogOpen(false);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create type"));
    } finally {
      setTypeSubmitting(false);
    }
  };

  const handleCreateItem = async () => {
    if (!itemName || !price || !selectedCategory || !selectedType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("item", itemName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("popular", isPopular.toString());
      formData.append("availability", isActive.toString());
      formData.append("availabilityTime", selectedTimes.join(","));
      formData.append("category", selectedCategory);
      formData.append("type", selectedType);
      formData.append("dietaryTags", JSON.stringify(dietaryTags));
      formData.append("allergens", JSON.stringify(allergens));
      if (spiceLevel !== null) formData.append("spiceLevel", String(spiceLevel));
      if (calories) formData.append("calories", calories);
      if (images.length > 0) images.forEach((img) => formData.append("images", img));
      if (videoFile) formData.append("videos", videoFile);
      await menuService.createMenu(formData);
      toast.success("Menu item created!");
      router.push("/admin/listmenu");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create menu item."));
      setSubmitting(false);
    }
  };

  const fieldLabel = (text: string, required = false) => (
    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
      {text}{required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );

  const sectionLabel = (text: string) => (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{text}</p>
  );

  const TIME_SLOTS = ["Morning", "Lunch", "Evening", "Dinner"];

  return (
    <>
    <AdminFormPage
      title="New Menu Item"
      onBack={() => router.push("/admin/listmenu")}
      onCancel={() => router.push("/admin/listmenu")}
      onSubmit={handleCreateItem}
      submitLabel="Create Item"
      submitting={submitting}
      headerExtra={
        <button
          type="button"
          onClick={() => setScanModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
        >
          <PiMagicWandBold size={13} />
          Scan Menu Image
        </button>
      }
    >
      <div className="flex flex-col gap-4">
      {/* Two-column layout: form fields + live preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

        {/* ── Left column (8/12) ── */}
        <div className="flex flex-col gap-4 lg:col-span-8">

          {/* Basic Information */}
          <div className="rounded-xl border border-border bg-card p-5">
            {sectionLabel("Basic Information")}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                {fieldLabel("Item Name", true)}
                <Input
                  id="item-name"
                  placeholder="e.g. House Burger"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div>
                {fieldLabel("Price ($)", true)}
                <Input
                  id="item-price"
                  type="number"
                  placeholder="0.00"
                  step="any"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                {fieldLabel("Highlight")}
                <ToggleCard
                  checked={isPopular}
                  onChange={setIsPopular}
                  label="Popular Item"
                  description="Feature this dish"
                  className="p-3"
                />
              </div>

              <div className="md:col-span-2">
                {fieldLabel("Description")}
                <Textarea
                  id="item-description"
                  rows={3}
                  placeholder="Ingredients, dietary notes, allergens... (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categorization + Availability side by side */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Categorization */}
            <div className="rounded-xl border border-border bg-card p-5">
              {sectionLabel("Categorization")}

              {!industryLoading && !industryId ? (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-[11px] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                  <PiWarningCircleBold size={15} className="mt-0.5 shrink-0" />
                  <span>
                    No industry set yet.{" "}
                    <Link href="/admin/listmenu" className="font-semibold underline underline-offset-2">
                      Set it on the Menu Items page
                    </Link>{" "}
                    to enable categories &amp; types.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    {fieldLabel("Category", true)}
                    <Select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      disabled={industryLoading}
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Select>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="mt-1 text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none"
                    >
                      + New
                    </button>
                  </div>

                  <div>
                    {fieldLabel("Type", true)}
                    <Select
                      id="type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      disabled={industryLoading}
                    >
                      <option value="">Select</option>
                      {types.map(typ => (
                        <option key={typ.id} value={typ.name}>{typ.name}</option>
                      ))}
                    </Select>
                    <button
                      type="button"
                      onClick={handleCreateType}
                      className="mt-1 text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none"
                    >
                      + New
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                {sectionLabel("Availability")}
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "-mt-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isActive ? "Active" : "Hidden"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <PiClockBold size={13} />
                  Serving times
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(time => {
                    const isSelected = selectedTimes.includes(time);
                    return (
                      <button
                        type="button"
                        key={time}
                        aria-pressed={isSelected}
                        onClick={() => toggleTime(time)}
                        className={cn(
                          "rounded-lg border py-2 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                        )}
                      >
                        {time}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={selectedTimes.includes("All Day")}
                    onClick={() => toggleTime("All Day")}
                    className={cn(
                      "col-span-2 rounded-lg border py-2 text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                      selectedTimes.includes("All Day")
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                    )}
                  >
                    Available All Day
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DietaryNutritionFields
            dietaryTags={dietaryTags}
            onDietaryTagsChange={setDietaryTags}
            allergens={allergens}
            onAllergensChange={setAllergens}
            spiceLevel={spiceLevel}
            onSpiceLevelChange={setSpiceLevel}
            calories={calories}
            onCaloriesChange={setCalories}
          />
        </div>

        {/* ── Right column (4/12): Live Preview only ── */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-0">
            {sectionLabel("Live Preview")}
            <MenuItemPreviewCard
              images={imagePreviews}
              videos={videoPreviewUrl ? [videoPreviewUrl] : []}
              name={itemName}
              price={price}
              description={description}
              category={selectedCategory}
              type={selectedType}
              popular={isPopular}
              available={isActive}
            />
          </div>
        </div>
      </div>

      {/* ── Media row: Photos, Video ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Photos */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            {sectionLabel("Photos")}
            <span className="-mt-3 text-[10px] font-semibold text-muted-foreground">
              {images.length}/5
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {imagePreviews.map((previewUrl, idx) => (
              <div
                key={previewUrl}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* blob preview, cannot be optimized */}
                <Image
                  src={previewUrl}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setImages(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive/90 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <PiTrashBold size={9} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                <PiImageBold size={18} className="text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground">Add</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const newImages = Array.from(e.target.files);
                      setImages(prev => [...prev, ...newImages].slice(0, 5));
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Video */}
        <div className="rounded-xl border border-border bg-card p-5">
          {sectionLabel("Video Promotion")}
          <label className="relative flex h-24 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
            {videoFile ? (
              <div className="flex items-center gap-2">
                <PiVideoCameraBold size={16} className="shrink-0 text-emerald-600" />
                <span className="max-w-[160px] truncate text-xs font-semibold text-foreground">
                  {videoFile.name}
                </span>
              </div>
            ) : (
              <>
                <PiVideoCameraBold size={20} className="text-muted-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Upload Video
                </span>
              </>
            )}
            <input
              type="file"
              className="sr-only"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setVideoFile(e.target.files[0]);
                }
              }}
            />
          </label>
          {videoFile && (
            <button
              type="button"
              onClick={() => setVideoFile(null)}
              className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
            >
              <PiTrashBold size={11} />
              Remove video
            </button>
          )}
        </div>
      </div>
      </div>

      <PromptDialog
        isOpen={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSubmit={handleSubmitCategory}
        title="New Category"
        label="Category Name"
        placeholder="e.g. Beverages"
        confirmLabel="Create"
        loading={categorySubmitting}
      />

      <PromptDialog
        isOpen={typeDialogOpen}
        onClose={() => setTypeDialogOpen(false)}
        onSubmit={handleSubmitType}
        title="New Type"
        label="Type Name"
        placeholder="e.g. Vegetarian"
        confirmLabel="Create"
        loading={typeSubmitting}
      />
    </AdminFormPage>

    <MenuScanModal
      isOpen={scanModalOpen}
      onClose={() => setScanModalOpen(false)}
      onImported={() => router.push("/admin/listmenu")}
      industryId={industryId}
      categories={categories}
      types={types}
      defaultCategory={selectedCategory}
      defaultType={selectedType}
    />
    </>
  );
}
