"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  PiCheckCircleFill,
  PiCircle,
  PiImageBold,
  PiVideoCameraBold,
  PiTrashBold,
} from "react-icons/pi";
import { toast } from "@/components/ui/toast";
import industryService from "@/services/industry.service";
import { menuService } from "@/services/menu.service";
import { Industry, IndustryCategory, IndustryType } from "@/types";

import { getApiErrorMessage } from "@/utils/errors";

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const menuId = resolvedParams.id;

  // Mock pre-filled state for the "Edit" scenario
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

    // Attempt to load the item
    menuService.getMenu(menuId).then((res) => {
      if (res.data) {
        setItemName(res.data.item || "");
        setPrice(res.data.price?.toString() || "");
        setDescription(res.data.description || "");
        setIsPopular(res.data.popular || false);
        setIsActive(res.data.availability !== false);
        setSelectedCategory(res.data.category || "");
        setSelectedType(res.data.type || "");

        let times = [];
        if (res.data.availabilityTime) {
          times = res.data.availabilityTime.split(",");
        } else if (res.data.availability_time) {
          times = res.data.availability_time.split(",");
        }
        if (times.length > 0) setSelectedTimes(times);

        const imgs = [];
        if (res.data.imageUrl) imgs.push(res.data.imageUrl);
        if (res.data.images && Array.isArray(res.data.images)) {
           imgs.push(...res.data.images.filter((i: string) => i !== res.data.imageUrl));
        }
        setExistingImages(imgs);

        if (res.data.videos && Array.isArray(res.data.videos)) {
           setExistingVideos(res.data.videos);
        }
      }
    }).catch(console.error);
  }, [menuId]);

  useEffect(() => {
    if (selectedIndustry) {
      industryService.getCategories(selectedIndustry).then(res => setCategories(res.data || [])).catch(console.error);
      industryService.getTypes(selectedIndustry).then(res => setTypes(res.data || [])).catch(console.error);
    } else {
      setCategories([]);
      setTypes([]);
    }
  }, [selectedIndustry]);

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

  const handleCreateCategory = async () => {
    if (!selectedIndustry) return toast.error("Please select an industry first");
    const name = window.prompt("Enter new category name:");
    if (!name) return;
    try {
      const res = await industryService.createCategory({ industry_id: Number(selectedIndustry), name });
      setCategories([...categories, res.data]);
      setSelectedCategory(res.data.name);
      toast.success("Category created");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create category"));
    }
  };

  const handleCreateType = async () => {
    if (!selectedIndustry) return toast.error("Please select an industry first");
    const name = window.prompt("Enter new type name:");
    if (!name) return;
    try {
      const res = await industryService.createType({ industry_id: Number(selectedIndustry), name });
      setTypes([...types, res.data]);
      setSelectedType(res.data.name);
      toast.success("Type created");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create type"));
    }
  };

  const handleUpdateItem = async () => {
    if (!itemName || !price || !description || !selectedCategory || !selectedType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("item", itemName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("popular", isPopular.toString());
      formData.append("availability", isActive.toString());
      formData.append("availabilityTime", selectedTimes.join(","));
      formData.append("category", selectedCategory);
      formData.append("type", selectedType);

      if (mediaKeysToDelete.length > 0) {
        formData.append("mediaKeysToDelete", JSON.stringify(mediaKeysToDelete));
      }

      if (images.length > 0) {
        images.forEach((img) => formData.append("images", img));
      }
      if (videoFile) {
        formData.append("videos", videoFile);
      }

      await menuService.updateMenu(menuId, formData);
      toast.success("Menu item updated!");
      router.push("/admin/listmenu");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update menu item."));
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Edit Menu Item"
        onBack={() => router.push("/admin/listmenu")}
        backLabel="Back"
        actions={
          <>
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => router.push("/admin/listmenu")}>
              Cancel
            </Button>
            <Button type="button" className="w-full sm:w-auto" onClick={handleUpdateItem}>
              Save Changes
            </Button>
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
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
                    <Input id="item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. House Burger" />
                  </div>

                  <div>
                    <label htmlFor="item-price" className="mb-1.5 block text-caption font-semibold text-muted-foreground">Price ($) *</label>
                    <Input id="item-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" step="any" min="0" />
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ingredients, dietary notes..."
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
                      Photos ({existingImages.length + images.length}/5)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {existingImages.map((imgUrl, idx) => (
                      <div key={`ext-${idx}`} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                         <Image src={imgUrl} alt="preview" fill className="object-cover" />
                         <button
                           type="button"
                           onClick={() => {
                             setMediaKeysToDelete(prev => [...prev, imgUrl]);
                             setExistingImages(prev => prev.filter(u => u !== imgUrl));
                           }}
                           aria-label="Remove photo"
                           className="absolute inset-0 flex items-center justify-center bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
                         >
                            <PiTrashBold size={18} />
                         </button>
                      </div>
                    ))}
                    {images.map((img, idx) => (
                      <div key={`new-${idx}`} className="animate-scale-in group relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                         {/* blob preview, cannot be optimized */}
                         <Image src={URL.createObjectURL(img)} alt="preview" fill className="object-cover" unoptimized />
                         <button
                           type="button"
                           onClick={() => {
                             setImages(prev => prev.filter((_, i) => i !== idx));
                           }}
                           aria-label="Remove photo"
                           className="absolute inset-0 flex items-center justify-center bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
                         >
                            <PiTrashBold size={18} />
                         </button>
                      </div>
                    ))}
                    {(existingImages.length + images.length) < 5 && (
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
                              setImages(prev => [...prev, ...newImages].slice(0, 5 - existingImages.length));
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

                  <div className="flex flex-col gap-3">
                    {existingVideos.map((vidUrl, idx) => (
                      <div key={`ext-vid-${idx}`} className="group relative flex h-28 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
                         <span className="text-caption font-semibold text-muted-foreground">Existing Video</span>
                         <button
                           type="button"
                           onClick={() => {
                             setMediaKeysToDelete(prev => [...prev, vidUrl]);
                             setExistingVideos(prev => prev.filter(u => u !== vidUrl));
                           }}
                           aria-label="Remove video"
                           className="absolute inset-0 flex items-center justify-center bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
                         >
                            <PiTrashBold size={18} />
                         </button>
                      </div>
                    ))}

                    {existingVideos.length === 0 && (
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
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
