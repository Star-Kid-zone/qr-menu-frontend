"use client";

import type { ReactNode } from "react";
import Image from "@/components/ui/Image";
import Link from "next/link";
import { AdminFormPage, MediaRemoveButton, Input, Textarea, Select, ToggleCard, PromptDialog } from "@/components/ui";
import { PiImageBold, PiVideoCameraBold, PiClockBold, PiPlusBold, PiWarningCircleBold } from "react-icons/pi";
import { BUSINESS_TYPE_HREF } from "@/constants/site.constants";
import { cn } from "@/utils/cn";
import { DietaryNutritionFields } from "./DietaryNutritionFields";
import { MenuItemPreviewCard } from "./MenuItemPreviewCard";
import { ItemDetailsFields } from "./ItemDetailsFields";
import type { MenuItemFormState } from "../hooks/useMenuItemForm";
import { MAX_DISH_PHOTOS, MENU_NEW_BUTTON_CLASS, MENU_TIME_SLOTS } from "@/constants/menu.constants";

function timeButtonClass(selected: boolean, extra = "") {
  return cn(
    "h-10 rounded-md border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
    extra,
    selected
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : "border-border bg-muted text-muted-foreground hover:bg-muted/70",
  );
}

function FieldLabel({ text, required = false, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
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
}

function SectionLabel({ text }: { text: string }) {
  return <p className="mb-3 text-caption font-bold text-muted-foreground">{text}</p>;
}

/** The add-dish / edit-dish form: fields, live preview, media and the new category/type dialogs. */
export function MenuItemForm({
  form,
  title,
  submitLabel,
  headerExtra,
  children,
}: {
  form: MenuItemFormState;
  title: string;
  submitLabel: string;
  headerExtra?: ReactNode;
  /** Extra dialogs rendered next to the form (e.g. the menu scanner on the add page). */
  children?: ReactNode;
}) {
  const f = form;
  const fieldError = (id: string) =>
    f.fieldErrors[id] ? (
      <p id={`${id}-error`} className="mt-2 text-caption text-destructive">
        Enter {f.fieldErrors[id] === "Price" ? "a price" : f.fieldErrors[id] === "Dish name" ? "the dish name" : `a ${f.fieldErrors[id].toLowerCase()}`}
      </p>
    ) : null;
  const totalPhotos = f.existingImages.length + f.images.length;
  const hasVideo = f.existingVideos.length > 0 || Boolean(f.videoFile);

  return (
    <>
      <AdminFormPage
        title={title}
        onBack={f.backToList}
        backLabel="Menu"
        onCancel={f.backToList}
        onSubmit={f.submit}
        submitLabel={submitLabel}
        submitting={f.submitting}
        headerExtra={headerExtra}
      >
        <div className="flex flex-col gap-4">
          {/* Two-column layout: form fields + live preview */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              {/* Basic Information */}
              <div className="rounded-xl border border-border bg-card p-6">
                <SectionLabel text="Basic Information" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FieldLabel text="Dish name" required htmlFor="item-name" />
                    <Input
                      id="item-name"
                      invalid={Boolean(f.fieldErrors["item-name"])}
                      aria-describedby={f.fieldErrors["item-name"] ? "item-name-error" : undefined}
                      placeholder="e.g. House Burger"
                      value={f.itemName}
                      onChange={(e) => f.setItemName(e.target.value)}
                    />
                    {fieldError("item-name")}
                  </div>

                  <div>
                    <FieldLabel text={`Price (${f.currencySymbol})`} required htmlFor="item-price" />
                    <Input
                      id="item-price"
                      invalid={Boolean(f.fieldErrors["item-price"])}
                      aria-describedby={f.fromPrice ? "item-price-from" : f.fieldErrors["item-price"] ? "item-price-error" : undefined}
                      type="number"
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="0.00"
                      step="any"
                      min="0"
                      value={f.fromPrice ?? f.price}
                      disabled={Boolean(f.fromPrice)}
                      onChange={(e) => f.setPrice(e.target.value)}
                    />
                    {f.fromPrice && (
                      <p id="item-price-from" className="mt-1.5 text-xs text-muted-foreground">
                        Set by the sizes below: the lowest one shows as the starting price.
                      </p>
                    )}
                    {fieldError("item-price")}
                  </div>

                  <div>
                    <FieldLabel text="Highlight" />
                    <ToggleCard
                      checked={f.isPopular}
                      onChange={f.setIsPopular}
                      label="Popular item"
                      className="h-10 rounded-md border-input bg-card px-3 py-0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel text="Description" htmlFor="item-description" />
                    <Textarea
                      id="item-description"
                      rows={3}
                      placeholder="Ingredients, dietary notes, allergens... (optional)"
                      value={f.description}
                      onChange={(e) => f.setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Categorization + Availability */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                  <SectionLabel text="Categorization" />
                  {!f.industryLoading && !f.industryId ? (
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
                        <FieldLabel text="Category" required htmlFor="category" />
                        <div className="flex items-start gap-2">
                          <Select
                            id="category"
                            invalid={Boolean(f.fieldErrors["category"])}
                            aria-describedby={f.fieldErrors["category"] ? "category-error" : undefined}
                            value={f.selectedCategory}
                            onChange={(e) => f.setSelectedCategory(e.target.value)}
                            disabled={f.industryLoading}
                          >
                            <option value="">Select category</option>
                            {f.categories.map((x) => (
                              <option key={x.id} value={x.name}>{x.name}</option>
                            ))}
                          </Select>
                          <button type="button" onClick={f.openCategoryDialog} aria-label="Add a new category" title="Add a new category" className={MENU_NEW_BUTTON_CLASS}>
                            <PiPlusBold size={12} aria-hidden />
                            New
                          </button>
                        </div>
                        {fieldError("category")}
                      </div>

                      <div>
                        <FieldLabel text="Dish type" required htmlFor="type" />
                        <div className="flex items-start gap-2">
                          <Select
                            id="type"
                            invalid={Boolean(f.fieldErrors["type"])}
                            aria-describedby={f.fieldErrors["type"] ? "type-error" : undefined}
                            value={f.selectedType}
                            onChange={(e) => f.setSelectedType(e.target.value)}
                            disabled={f.industryLoading}
                          >
                            <option value="">Select dish type</option>
                            {f.types.map((x) => (
                              <option key={x.id} value={x.name}>{x.name}</option>
                            ))}
                          </Select>
                          <button type="button" onClick={f.openTypeDialog} aria-label="Add a new dish type" title="Add a new dish type" className={MENU_NEW_BUTTON_CLASS}>
                            <PiPlusBold size={12} aria-hidden />
                            New
                          </button>
                        </div>
                        {fieldError("type")}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <SectionLabel text="Availability" />
                    <button
                      type="button"
                      aria-pressed={f.isActive}
                      onClick={() => f.setIsActive(!f.isActive)}
                      className={cn(
                        "-mt-3 rounded-full px-3 py-0.5 text-caption font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                        f.isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {f.isActive ? "Active" : "Hidden"}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <PiClockBold size={13} />
                      Serving times
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {MENU_TIME_SLOTS.map((time) => {
                        const selected = f.selectedTimes.includes(time);
                        return (
                          <button type="button" key={time} aria-pressed={selected} onClick={() => f.toggleTime(time)} className={timeButtonClass(selected)}>
                            {time}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        aria-pressed={f.selectedTimes.includes("All Day")}
                        onClick={() => f.toggleTime("All Day")}
                        className={timeButtonClass(f.selectedTimes.includes("All Day"), "col-span-2")}
                      >
                        Available All Day
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <DietaryNutritionFields
                dietaryTags={f.dietaryTags}
                onDietaryTagsChange={f.setDietaryTags}
                allergens={f.allergens}
                onAllergensChange={f.setAllergens}
                spiceLevel={f.spiceLevel}
                onSpiceLevelChange={f.setSpiceLevel}
                calories={f.calories}
                onCaloriesChange={f.setCalories}
              />

              <ItemDetailsFields
                business={f.business}
                attributes={f.attributes}
                onAttributesChange={f.setAttributes}
                priceOptions={f.priceOptions}
                onPriceOptionsChange={f.setPriceOptions}
                currencySymbol={f.currencySymbol}
              />
            </div>

            {/* Right column: live preview */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-0">
                <SectionLabel text="Live Preview" />
                <MenuItemPreviewCard
                  images={[...f.existingImages, ...f.imagePreviews]}
                  videos={[...f.existingVideos, ...(f.videoPreviewUrl ? [f.videoPreviewUrl] : [])]}
                  name={f.itemName}
                  price={f.fromPrice ?? f.price}
                  description={f.description}
                  category={f.selectedCategory}
                  type={f.selectedType}
                  popular={f.isPopular}
                  available={f.isActive}
                  dietaryTags={f.dietaryTags}
                  allergens={f.allergens}
                  spiceLevel={f.spiceLevel}
                  calories={f.calories}
                  currencySymbol={f.currencySymbol}
                />
              </div>
            </div>
          </div>

          {/* Media row: photos, video */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <SectionLabel text="Photos" />
                <span className="-mt-3 text-caption font-semibold text-muted-foreground">
                  {totalPhotos}/{MAX_DISH_PHOTOS}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {f.existingImages.map((url) => (
                  <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    <Image src={url} alt="Dish photo" fill className="object-cover" />
                    <MediaRemoveButton label="Remove photo" onClick={() => f.removeExistingImage(url)} />
                  </div>
                ))}
                {f.imagePreviews.map((previewUrl, idx) => (
                  <div key={previewUrl} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    {/* blob preview, cannot be optimized */}
                    <Image src={previewUrl} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                    <MediaRemoveButton label="Remove photo" onClick={() => f.removeNewImage(idx)} />
                  </div>
                ))}
                {totalPhotos < MAX_DISH_PHOTOS && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                    <PiImageBold size={18} className="text-muted-foreground" />
                    <span className="text-caption font-semibold text-muted-foreground">Add</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) f.addImages(Array.from(e.target.files));
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <SectionLabel text="Video Promotion" />
              <div className="flex flex-col gap-2">
                {f.existingVideos.map((url) => (
                  <div key={url} className="group relative overflow-hidden rounded-lg border border-border bg-black">
                    <video src={url} controls preload="metadata" className="aspect-video w-full object-contain" />
                    <MediaRemoveButton label="Remove video" onClick={() => f.removeExistingVideo(url)} />
                  </div>
                ))}
                {f.videoFile && f.videoPreviewUrl && f.existingVideos.length === 0 && (
                  <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                    <video key={f.videoPreviewUrl} src={f.videoPreviewUrl} controls preload="metadata" className="aspect-video w-full object-contain" />
                    <MediaRemoveButton label="Remove video" onClick={() => f.setVideoFile(null)} />
                  </div>
                )}
                {!hasVideo && (
                  <label className="relative flex h-20 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                    <PiVideoCameraBold size={18} className="text-muted-foreground" />
                    <span className="text-caption font-semibold text-muted-foreground">Upload Video</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) f.setVideoFile(e.target.files[0]);
                      }}
                    />
                  </label>
                )}
                {f.videoFile && f.existingVideos.length === 0 && (
                  <p className="truncate text-caption text-muted-foreground">{f.videoFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminFormPage>

      <PromptDialog
        isOpen={f.categoryDialogOpen}
        onClose={f.closeCategoryDialog}
        onSubmit={f.createCategory}
        title="New Category"
        label="Category Name"
        placeholder="e.g. Beverages"
        confirmLabel="Create"
        loading={f.categorySubmitting}
      />
      <PromptDialog
        isOpen={f.typeDialogOpen}
        onClose={f.closeTypeDialog}
        onSubmit={f.createType}
        title="New Type"
        label="Type Name"
        placeholder="e.g. Vegetarian"
        confirmLabel="Create"
        loading={f.typeSubmitting}
      />
      {children}
    </>
  );
}
