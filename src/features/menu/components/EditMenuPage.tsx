"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "@/components/ui/Image";
import Link from "next/link";
import { BUSINESS_TYPE_HREF } from "@/constants/site.constants";
import { useRouter } from "next/navigation";
import {
  AdminFormPage,
  MediaRemoveButton,
  Input,
  Textarea,
  Select,
  ToggleCard,
  PromptDialog,
  toast,
} from "@/components/ui";
import {
  MenuItemPreviewCard,
  DietaryNutritionFields,
} from "@/features/menu";
import {
  PiImageBold,
  PiVideoCameraBold,
  PiClockBold,
  PiPlusBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { workspaceService } from "@/services/workspace.service";
import { IndustryCategory, IndustryType } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";
import { resolveBusinessType } from "@/components/site-system/business-types";
import type { BusinessTypeDefinition } from "@/components/site-system/types";
import {
  ItemDetailsFields,
  cleanAttributes,
  cleanPriceOptions,
  lowestOptionPrice,
  type ItemAttributes,
  type PriceOptionRow,
} from "./ItemDetailsFields";

export function EditMenuPage({ menuId }: { menuId: string }) {
  const router = useRouter();

  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["All Day"]);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [mediaKeysToDelete, setMediaKeysToDelete] = useState<string[]>([]);

  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [types, setTypes] = useState<IndustryType[]>([]);

  // Industry is a business-level setting (managed once from the Menu Items
  // page) — read it here, never asked for on this form.
  const [industryId, setIndustryId] = useState<number | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [industryLoading, setIndustryLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number | null>(null);
  const [calories, setCalories] = useState("");
  const [business, setBusiness] = useState<BusinessTypeDefinition>(() => resolveBusinessType(null));
  const [attributes, setAttributes] = useState<ItemAttributes>({});
  const [priceOptions, setPriceOptions] = useState<PriceOptionRow[]>([]);
  const fromPrice = lowestOptionPrice(priceOptions);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  useEffect(() => {
    workspaceService.getWorkspace()
      .then((res) => {
        const id = res.data.business?.industryId;
        setIndustryId(id != null ? Number(id) : null);
        setCurrencySymbol(res.data.currency?.symbol?.trim() || "$");
        setBusiness(resolveBusinessType({ business_type: res.data.theme?.businessType, site_document: res.data.siteDocument }));
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
        if (data.attributes && typeof data.attributes === "object" && !Array.isArray(data.attributes)) {
          setAttributes(data.attributes as ItemAttributes);
        }
        if (Array.isArray(data.priceOptions)) {
          setPriceOptions((data.priceOptions as Array<{ label?: unknown; price?: unknown }>).map((o) => ({ label: String(o.label ?? ""), price: String(o.price ?? "") })));
        }
      }
    }).catch(console.error);
  }, [menuId]);

  useEffect(() => {
    if (industryId) {
      industryService.getCategories(industryId).then(res => setCategories(res.data || [])).catch(console.error);
      industryService.getTypes(industryId).then(res => setTypes(res.data || [])).catch(console.error);
    }
  }, [industryId]);

  // Object URLs are derived from the selected files; the effect only releases
  // the previous set when the selection changes or the page unmounts.
  const newImagePreviews = useMemo(() => images.map((img) => URL.createObjectURL(img)), [images]);
  useEffect(() => {
    return () => { newImagePreviews.forEach((url) => URL.revokeObjectURL(url)); };
  }, [newImagePreviews]);

  const newVideoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : null), [videoFile]);
  useEffect(() => {
    if (!newVideoPreviewUrl) return;
    return () => URL.revokeObjectURL(newVideoPreviewUrl);
  }, [newVideoPreviewUrl]);

  const toggleTime = (time: string) => {
    if (time === "All Day") { setSelectedTimes(["All Day"]); return; }
    let newTimes = selectedTimes.filter(t => t !== "All Day");
    if (newTimes.includes(time)) newTimes = newTimes.filter(t => t !== time);
    else newTimes.push(time);
    setSelectedTimes(newTimes.length === 0 ? ["All Day"] : newTimes);
  };

  const handleCreateCategory = () => {
    if (!industryId) return toast.error("Choose your business type on the Website page first");
    setCategoryDialogOpen(true);
  };

  const handleCreateType = () => {
    if (!industryId) return toast.error("Choose your business type on the Website page first");
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
    try {
      setSubmitting(true);
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
      formData.append("spiceLevel", spiceLevel !== null ? String(spiceLevel) : "");
      formData.append("calories", calories);
      if (mediaKeysToDelete.length > 0) {
        formData.append("mediaKeysToDelete", JSON.stringify(mediaKeysToDelete));
      }
      if (images.length > 0) images.forEach((img) => formData.append("images", img));
      if (videoFile) formData.append("videos", videoFile);
      await menuService.updateMenu(menuId, formData);
      toast.success("Changes saved");
      router.push("/admin/listmenu");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't save the dish. Try again."));
      setSubmitting(false);
    }
  };

  const fieldLabel = (text: string, required = false, htmlFor?: string) => (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-1 text-body-medium text-foreground">
      {text}
      {required && (
        <>
          <span aria-hidden className="text-destructive">*</span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  );
  const fieldError = (id: string) =>
    fieldErrors[id] ? (
      <p id={`${id}-error`} className="mt-2 text-caption text-destructive">
        Enter {fieldErrors[id] === "Price" ? "a price" : fieldErrors[id] === "Dish name" ? "the dish name" : `a ${fieldErrors[id].toLowerCase()}`}
      </p>
    ) : null;

  const sectionLabel = (text: string) => (
    <p className="mb-3 text-caption font-bold text-muted-foreground">{text}</p>
  );

  const TIME_SLOTS = ["Morning", "Lunch", "Evening", "Dinner"];
  const totalPhotos = existingImages.length + images.length;

  return (
    <>
    <AdminFormPage
      title="Edit dish"
      onBack={() => router.push("/admin/listmenu")}
      backLabel="Menu"
      onCancel={() => router.push("/admin/listmenu")}
      onSubmit={handleUpdateItem}
      submitLabel="Save changes"
      submitting={submitting}
    >
      <div className="flex flex-col gap-4">
      {/* Two-column layout: form fields + live preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

        {/* ── Left column (8/12) ── */}
        <div className="flex flex-col gap-4 lg:col-span-8">

          {/* Basic Information */}
          <div className="rounded-xl border border-border bg-card p-6">
            {sectionLabel("Basic Information")}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                {fieldLabel("Dish name", true, "item-name")}
                <Input
                  id="item-name"
                  invalid={Boolean(fieldErrors["item-name"])}
                  aria-describedby={fieldErrors["item-name"] ? "item-name-error" : undefined}
                  placeholder="e.g. House Burger"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              {fieldError("item-name")}
              </div>

              <div>
                {fieldLabel(`Price (${currencySymbol})`, true, "item-price")}
                <Input
                  id="item-price"
                  invalid={Boolean(fieldErrors["item-price"])}
                  aria-describedby={fromPrice ? "item-price-from" : fieldErrors["item-price"] ? "item-price-error" : undefined}
                  type="number"
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="0.00"
                  step="any"
                  min="0"
                  value={fromPrice ?? price}
                  disabled={Boolean(fromPrice)}
                  onChange={(e) => setPrice(e.target.value)}
                />
              {fromPrice && (
                <p id="item-price-from" className="mt-1.5 text-xs text-muted-foreground">Set by the sizes below: the lowest one shows as the starting price.</p>
              )}
              {fieldError("item-price")}
              </div>

              <div>
                {fieldLabel("Highlight")}
                <ToggleCard
                  checked={isPopular}
                  onChange={setIsPopular}
                  label="Popular item"
                  className="h-10 rounded-md border-input bg-card px-3 py-0"
                />
              </div>

              <div className="md:col-span-2">
                {fieldLabel("Description", false, "item-description")}
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
            <div className="rounded-xl border border-border bg-card p-6">
              {sectionLabel("Categorization")}

              {!industryLoading && !industryId ? (
                <div className="flex items-start gap-2 rounded-lg border border-warning/60 bg-warning/10 p-3 text-caption text-warning-foreground dark:border-warning/60 dark:bg-warning/40 dark:text-warning">
                  <PiWarningCircleBold size={15} className="mt-0.5 shrink-0" />
                  <span>
                    No business type chosen yet.{" "}
                    <Link href={BUSINESS_TYPE_HREF} className="font-semibold underline underline-offset-2">
                      Choose your business type
                    </Link>{" "}
                    to choose categories and dish types.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    {fieldLabel("Category", true, "category")}
                    <div className="flex items-start gap-2">
                      <Select
                        id="category"
                        invalid={Boolean(fieldErrors["category"])}
                        aria-describedby={fieldErrors["category"] ? "category-error" : undefined}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        disabled={industryLoading}
                      >
                        <option value="">Select category</option>
                        {categories.map(x => (
                          <option key={x.id} value={x.name}>{x.name}</option>
                        ))}
                      </Select>
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        aria-label="Add a new category"
                        title="Add a new category"
                        className="flex h-10 shrink-0 items-center gap-1 rounded-md border border-border bg-card px-3 text-caption font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                      >
                        <PiPlusBold size={12} aria-hidden />
                        New
                      </button>
                    </div>
                    {fieldError("category")}
                  </div>

                  <div>
                    {fieldLabel("Dish type", true, "type")}
                    <div className="flex items-start gap-2">
                      <Select
                        id="type"
                        invalid={Boolean(fieldErrors["type"])}
                        aria-describedby={fieldErrors["type"] ? "type-error" : undefined}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        disabled={industryLoading}
                      >
                        <option value="">Select dish type</option>
                        {types.map(x => (
                          <option key={x.id} value={x.name}>{x.name}</option>
                        ))}
                      </Select>
                      <button
                        type="button"
                        onClick={handleCreateType}
                        aria-label="Add a new dish type"
                        title="Add a new dish type"
                        className="flex h-10 shrink-0 items-center gap-1 rounded-md border border-border bg-card px-3 text-caption font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                      >
                        <PiPlusBold size={12} aria-hidden />
                        New
                      </button>
                    </div>
                    {fieldError("type")}
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between">
                {sectionLabel("Availability")}
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "-mt-3 rounded-full px-3 py-0.5 text-caption font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                    isActive
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isActive ? "Active" : "Hidden"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
                          "h-10 rounded-md border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
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
                      "col-span-2 h-10 rounded-md border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
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

          <ItemDetailsFields
            business={business}
            attributes={attributes}
            onAttributesChange={setAttributes}
            priceOptions={priceOptions}
            onPriceOptionsChange={setPriceOptions}
            currencySymbol={currencySymbol}
          />
        </div>

        {/* ── Right column (4/12): Live Preview only ── */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-0">
            {sectionLabel("Live Preview")}
            <MenuItemPreviewCard
              images={[...existingImages, ...newImagePreviews]}
              videos={[...existingVideos, ...(newVideoPreviewUrl ? [newVideoPreviewUrl] : [])]}
              name={itemName}
              price={fromPrice ?? price}
              description={description}
              category={selectedCategory}
              type={selectedType}
              popular={isPopular}
              available={isActive}
              dietaryTags={dietaryTags}
              allergens={allergens}
              spiceLevel={spiceLevel}
              calories={calories}
              currencySymbol={currencySymbol}
            />
          </div>
        </div>
      </div>

      {/* ── Media row: Photos, Video ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Photos */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center justify-between">
              {sectionLabel("Photos")}
              <span className="-mt-3 text-caption font-semibold text-muted-foreground">
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
                  <MediaRemoveButton
                    label="Remove photo"
                    onClick={() => {
                      setMediaKeysToDelete(prev => [...prev, imgUrl]);
                      setExistingImages(prev => prev.filter(u => u !== imgUrl));
                    }}
                  />
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
                  <MediaRemoveButton
                    label="Remove photo"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  />
                </div>
              ))}

              {/* Upload slot */}
              {totalPhotos < 5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                  <PiImageBold size={18} className="text-muted-foreground" />
                  <span className="text-caption font-semibold text-muted-foreground">Add</span>
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
          <div className="rounded-xl border border-border bg-card p-6">
            {sectionLabel("Video Promotion")}
            <div className="flex flex-col gap-2">
              {existingVideos.map((vidUrl, idx) => (
                <div
                  key={`ext-vid-${idx}`}
                  className="group relative overflow-hidden rounded-lg border border-border bg-black"
                >
                  <video
                    src={vidUrl}
                    controls
                    preload="metadata"
                    className="aspect-video w-full object-contain"
                  />
                  <MediaRemoveButton
                    label="Remove video"
                    onClick={() => {
                      setMediaKeysToDelete(prev => [...prev, vidUrl]);
                      setExistingVideos(prev => prev.filter(u => u !== vidUrl));
                    }}
                  />
                </div>
              ))}

              {videoFile && newVideoPreviewUrl && existingVideos.length === 0 && (
                <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                  <video
                    key={newVideoPreviewUrl}
                    src={newVideoPreviewUrl}
                    controls
                    preload="metadata"
                    className="aspect-video w-full object-contain"
                  />
                  <MediaRemoveButton label="Remove video" onClick={() => setVideoFile(null)} />
                </div>
              )}

              {existingVideos.length === 0 && !videoFile && (
                <label className="relative flex h-20 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                  <PiVideoCameraBold size={18} className="text-muted-foreground" />
                  <span className="text-caption font-semibold text-muted-foreground">
                    Upload Video
                  </span>
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
                <p className="truncate text-caption text-muted-foreground">{videoFile.name}</p>
              )}
            </div>
          </div>
      </div>
      </div>
    </AdminFormPage>

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
    </>
  );
}

