"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  Select,
  ToggleCard,
  PageHeader,
  PromptDialog,
  toast,
} from "@/shared/components";
import {
  MenuItemPreviewCard,
  DietaryNutritionFields,
} from "@/features/menu";
import {
  PiImageBold,
  PiVideoCameraBold,
  PiTrashBold,
  PiClockBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { workspaceService } from "@/services/workspace.service";
import { IndustryCategory, IndustryType } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const menuId = resolvedParams.id;

  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["All Day"]);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [newVideoPreviewUrl, setNewVideoPreviewUrl] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [mediaKeysToDelete, setMediaKeysToDelete] = useState<string[]>([]);

  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [types, setTypes] = useState<IndustryType[]>([]);

  // Industry is a business-level setting (managed once from the Menu Items
  // page) — read it here, never asked for on this form.
  const [industryId, setIndustryId] = useState<number | null>(null);
  const [industryLoading, setIndustryLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number | null>(null);
  const [calories, setCalories] = useState("");

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  useEffect(() => {
    workspaceService.getWorkspace()
      .then((res) => {
        const id = res.data.business?.industryId;
        setIndustryId(id != null ? Number(id) : null);
      })
      .catch(console.error)
      .finally(() => setIndustryLoading(false));

    menuService.getMenu(menuId).then((res) => {
      if (res.data) {
        setItemName(res.data.item || "");
        setPrice(res.data.price?.toString() || "");
        setDescription(res.data.description || "");
        setIsPopular(res.data.popular || false);
        setIsActive(res.data.availability !== false);
        setSelectedCategory(res.data.category || "");
        setSelectedType(res.data.type || "");

        let times: string[] = [];
        if (res.data.availabilityTime) times = res.data.availabilityTime.split(",");
        else if (res.data.availability_time) times = res.data.availability_time.split(",");
        if (times.length > 0) setSelectedTimes(times);

        const imgs: string[] = [];
        if (res.data.imageUrl) imgs.push(res.data.imageUrl);
        if (res.data.images && Array.isArray(res.data.images)) {
          imgs.push(...res.data.images.filter((i: string) => i !== res.data.imageUrl));
        }
        setExistingImages(imgs);

        if (res.data.videos && Array.isArray(res.data.videos)) {
          setExistingVideos(res.data.videos);
        }

        const data = res.data as unknown as Record<string, unknown>;
        if (Array.isArray(data.dietaryTags)) setDietaryTags(data.dietaryTags as string[]);
        if (Array.isArray(data.allergens)) setAllergens(data.allergens as string[]);
        if (typeof data.spiceLevel === "number") setSpiceLevel(data.spiceLevel);
        if (typeof data.calories === "number") setCalories(String(data.calories));
      }
    }).catch(console.error);
  }, [menuId]);

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
    setNewImagePreviews(urls);
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [images]);

  useEffect(() => {
    if (!videoFile) {
      setNewVideoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setNewVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const toggleTime = (time: string) => {
    if (time === "All Day") { setSelectedTimes(["All Day"]); return; }
    let newTimes = selectedTimes.filter(t => t !== "All Day");
    if (newTimes.includes(time)) newTimes = newTimes.filter(t => t !== time);
    else newTimes.push(time);
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
    } catch (err) {
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
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create type"));
    } finally {
      setTypeSubmitting(false);
    }
  };

  const handleUpdateItem = async () => {
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
      formData.append("spiceLevel", spiceLevel !== null ? String(spiceLevel) : "");
      formData.append("calories", calories);
      if (mediaKeysToDelete.length > 0) {
        formData.append("mediaKeysToDelete", JSON.stringify(mediaKeysToDelete));
      }
      if (images.length > 0) images.forEach((img) => formData.append("images", img));
      if (videoFile) formData.append("videos", videoFile);
      await menuService.updateMenu(menuId, formData);
      toast.success("Menu item updated!");
      router.push("/admin/listmenu");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update menu item."));
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
  const totalPhotos = existingImages.length + images.length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <PageHeader
        title="Edit Menu Item"
        onBack={() => router.push("/admin/listmenu")}
        backLabel="Back"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/listmenu")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpdateItem}
              loading={submitting}
            >
              Save Changes
            </Button>
          </div>
        }
      />

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 pb-4">
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

          {/* Categorization + Availability */}
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
              images={[...existingImages, ...newImagePreviews]}
              videos={[...existingVideos, ...(newVideoPreviewUrl ? [newVideoPreviewUrl] : [])]}
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
                {totalPhotos}/5
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Existing images */}
              {existingImages.map((imgUrl, idx) => (
                <div
                  key={`ext-${idx}`}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image src={imgUrl} alt="preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaKeysToDelete(prev => [...prev, imgUrl]);
                      setExistingImages(prev => prev.filter(u => u !== imgUrl));
                    }}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive/90 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <PiTrashBold size={9} />
                  </button>
                </div>
              ))}

              {/* New images */}
              {images.map((img, idx) => (
                <div
                  key={`new-${idx}`}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {/* blob preview, cannot be optimized */}
                  <Image
                    src={newImagePreviews[idx] ?? URL.createObjectURL(img)}
                    alt="preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive/90 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <PiTrashBold size={9} />
                  </button>
                </div>
              ))}

              {/* Upload slot */}
              {totalPhotos < 5 && (
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
                        setImages(prev => [...prev, ...newImages].slice(0, 5 - existingImages.length));
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
            <div className="flex flex-col gap-2">
              {existingVideos.map((vidUrl, idx) => (
                <div
                  key={`ext-vid-${idx}`}
                  className="group relative flex h-20 items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <PiVideoCameraBold size={16} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Existing Video</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaKeysToDelete(prev => [...prev, vidUrl]);
                      setExistingVideos(prev => prev.filter(u => u !== vidUrl));
                    }}
                    aria-label="Remove video"
                    className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-destructive/90 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <PiTrashBold size={11} />
                  </button>
                </div>
              ))}

              {existingVideos.length === 0 && (
                <label className="relative flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                  {videoFile ? (
                    <div className="flex items-center gap-2 px-3">
                      <PiVideoCameraBold size={14} className="shrink-0 text-emerald-600" />
                      <span className="max-w-[140px] truncate text-xs font-semibold text-foreground">
                        {videoFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <PiVideoCameraBold size={18} className="text-muted-foreground" />
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
              )}

              {videoFile && existingVideos.length === 0 && (
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
                >
                  <PiTrashBold size={10} />
                  Remove video
                </button>
              )}
            </div>
          </div>
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
    </div>
  );
}
