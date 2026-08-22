"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromptDialog } from "@/components/ui/PromptDialog";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import {
  PiCheckCircleFill,
  PiCircle,
  PiImageBold,
  PiVideoCameraBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { Industry, IndustryCategory, IndustryType } from "@/types";
import { getApiErrorMessage } from "@/utils/errors";


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

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const toggleTime = (time: string) => {
    if (time === "All Day") {
      setSelectedTimes(["All Day"]);
      return;
    }

    let newTimes = selectedTimes.filter(t => t !== "All Day");
    if (newTimes.includes(time)) {
      newTimes = newTimes.filter(t => t !== time);
    } else {
      newTimes.push(time);
    }

    if (newTimes.length === 0) {
      setSelectedTimes(["All Day"]);
    } else {
      setSelectedTimes(newTimes);
    }
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

  const [submitting, setSubmitting] = useState(false);

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

      if (images.length > 0) {
        images.forEach((img) => formData.append("images", img));
      }
      if (videoFile) {
        formData.append("videos", videoFile);
      }

      await menuService.createMenu(formData);
      toast.success("Menu item created!");
      router.push("/admin/listmenu");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create menu item."));
      setSubmitting(false);
    }
  };

  return (
    <AdminFormPage
      title="New Menu Item"
      onBack={() => router.push("/admin/listmenu")}
      onCancel={() => router.push("/admin/listmenu")}
      onSubmit={handleCreateItem}
      submitLabel="Create Item"
      submitting={submitting}
    >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left Column */}
          <div className="animate-fade-in-up space-y-4 lg:col-span-8">
            {/* Basic Information */}
            <Card>
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-caption uppercase tracking-widest text-muted-foreground">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="item-name" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Item Name *</label>
                    <Input id="item-name" placeholder="e.g. House Burger" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                  </div>

                  <div>
                    <label htmlFor="item-price" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Price ($) *</label>
                    <Input id="item-price" type="number" placeholder="0.00" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>

                  <div>
                    <span className="mb-1.5 block text-caption font-semibold text-muted-foreground">Highlight</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPopular}
                      onClick={() => setIsPopular(!isPopular)}
                      className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-md border px-3 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97] ${
                        isPopular ? "border-primary/30 bg-primary/10" : "border-border bg-muted hover:bg-accent"
                      }`}
                    >
                      <span className={`text-caption font-semibold uppercase tracking-wider ${isPopular ? "text-primary" : "text-muted-foreground"}`}>
                        Popular Item
                      </span>
                      {isPopular ? (
                        <PiCheckCircleFill className="text-primary" size={18} />
                      ) : (
                        <PiCircle className="text-muted-foreground" size={18} />
                      )}
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="item-description" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Description *</label>
                    <Textarea
                      id="item-description"
                      rows={3}
                      placeholder="Ingredients, dietary notes..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Categorization */}
              <Card>
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-caption uppercase tracking-widest text-muted-foreground">
                    Categorization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label htmlFor="industry" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Industry</label>
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
                    <label htmlFor="category" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Category *</label>
                    <div className="flex flex-col gap-1">
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
                      <button type="button" onClick={handleCreateCategory} className="self-end rounded text-caption font-semibold uppercase tracking-widest text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                        + Create New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Type *</label>
                    <div className="flex flex-col gap-1">
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
                      <button type="button" onClick={handleCreateType} className="self-end rounded text-caption font-semibold uppercase tracking-widest text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                        + Create New
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-caption uppercase tracking-widest text-muted-foreground">
                    Availability
                  </CardTitle>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setIsActive(!isActive)}
                    className={`rounded-full px-3 py-1 text-caption font-semibold uppercase tracking-wider transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97] ${
                      isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "Active" : "Hidden"}
                  </button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {["Morning", "Lunch", "Evening", "Dinner"].map(time => {
                      const isSelected = selectedTimes.includes(time);
                      return (
                        <button
                          type="button"
                          key={time}
                          aria-pressed={isSelected}
                          onClick={() => toggleTime(time)}
                          className={`rounded-md border p-2 text-caption font-semibold uppercase tracking-wider transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97] ${
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      aria-pressed={selectedTimes.includes("All Day")}
                      onClick={() => toggleTime("All Day")}
                      className={`col-span-2 rounded-md border p-2 text-caption font-semibold uppercase tracking-wider transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.97] ${
                        selectedTimes.includes("All Day") ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      Available All Day
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="animate-fade-in-up space-y-4 lg:col-span-4">
            <Card>
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-caption uppercase tracking-widest text-muted-foreground">
                  Media Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">

                {/* Photos */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
                      Photos ({images.length}/5)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {imagePreviews.map((previewUrl, idx) => (
                      <div key={previewUrl} className="animate-scale-in relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                         {/* blob preview, cannot be optimized */}
                         <Image src={previewUrl} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted transition-colors duration-150 ease-out hover:bg-accent focus-within:ring-2 focus-within:ring-ring/40">
                        <PiImageBold className="mb-2 text-muted-foreground" size={22} />
                        <span className="text-caption font-semibold text-muted-foreground">Upload</span>
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

                <div className="border-t border-border pt-6">
                  <span className="mb-3 block text-caption font-semibold uppercase tracking-widest text-muted-foreground">
                    Video Promotion
                  </span>

                  <label className="relative flex h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted transition-colors duration-150 ease-out hover:bg-accent focus-within:ring-2 focus-within:ring-ring/40">
                    {videoFile ? (
                      <span className="z-10 text-caption font-semibold text-success">{videoFile.name}</span>
                    ) : (
                      <>
                        <PiVideoCameraBold className="mb-2 text-muted-foreground" size={24} />
                        <span className="text-caption font-semibold uppercase tracking-widest text-muted-foreground">
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
                </div>

              </CardContent>
            </Card>
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
