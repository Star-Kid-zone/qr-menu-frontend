"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { PromptDialog } from "@/components/ui/PromptDialog";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import {
  PiCheckCircleFill,
  PiCircle,
  PiImageBold,
  PiVideoCameraBold,
  PiTrashBold,
  PiSparkleBold,
  PiClockBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { Industry, IndustryCategory, IndustryType } from "@/types";
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

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [types, setTypes] = useState<IndustryType[]>([]);

  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    industryService.getIndustries().then((res) => {
      setIndustries(res.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedIndustry) {
      industryService.getCategories(selectedIndustry).then(res => setCategories(res.data || [])).catch(console.error);
      industryService.getTypes(selectedIndustry).then(res => setTypes(res.data || [])).catch(console.error);
    } else {
      setCategories([]);
      setTypes([]);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setImagePreviews(urls);
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [images]);

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
    if (!selectedIndustry) return toast.error("Please select an industry first");
    setCategoryDialogOpen(true);
  };

  const handleCreateType = () => {
    if (!selectedIndustry) return toast.error("Please select an industry first");
    setTypeDialogOpen(true);
  };

  const handleSubmitCategory = async (name: string) => {
    setCategorySubmitting(true);
    try {
      const res = await industryService.createCategory({ industry_id: Number(selectedIndustry), name });
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
    setTypeSubmitting(true);
    try {
      const res = await industryService.createType({ industry_id: Number(selectedIndustry), name });
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
    if (!itemName || !price || !description || !selectedCategory || !selectedType) {
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
    <AdminFormPage
      title="New Menu Item"
      onBack={() => router.push("/admin/listmenu")}
      onCancel={() => router.push("/admin/listmenu")}
      onSubmit={handleCreateItem}
      submitLabel="Create Item"
      submitting={submitting}
    >
      {/* Two-column layout filling available height */}
      <div className="grid h-full grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-12 lg:overflow-hidden">

        {/* ── Left column (8/12) ── */}
        <div className="flex flex-col gap-4 lg:col-span-8 lg:overflow-y-auto lg:pb-1">

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
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPopular}
                  onClick={() => setIsPopular(!isPopular)}
                  className={cn(
                    "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border px-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                    isPopular
                      ? "border-primary/30 bg-primary/8 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <PiSparkleBold size={14} />
                    <span className="text-xs font-semibold">Popular Item</span>
                  </div>
                  {isPopular ? (
                    <PiCheckCircleFill size={16} className="text-primary" />
                  ) : (
                    <PiCircle size={16} className="text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="md:col-span-2">
                {fieldLabel("Description", true)}
                <Textarea
                  id="item-description"
                  rows={3}
                  placeholder="Ingredients, dietary notes, allergens..."
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
              <div className="flex flex-col gap-4">
                <div>
                  {fieldLabel("Industry")}
                  <Select
                    id="industry"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  {fieldLabel("Category", true)}
                  <Select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="mt-1 self-end text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none"
                  >
                    + Create New
                  </button>
                </div>

                <div>
                  {fieldLabel("Type", true)}
                  <Select
                    id="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    {types.map(typ => (
                      <option key={typ.id} value={typ.name}>{typ.name}</option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={handleCreateType}
                    className="mt-1 self-end text-[11px] font-semibold text-primary hover:underline focus-visible:outline-none"
                  >
                    + Create New
                  </button>
                </div>
              </div>
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
        </div>

        {/* ── Right column (4/12) ── */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:overflow-y-auto lg:pb-1">

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

          {/* Tips card */}
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tips</p>
            <ul className="space-y-1.5">
              {[
                "Use a square image for best results",
                "Keep names short and clear",
                "Add allergen info in description",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
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
  );
}
