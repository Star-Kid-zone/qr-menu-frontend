"use client";

import { PiSparkleFill } from "react-icons/pi";
import { MenuItemGallery } from "@/components/templates/core/MenuItemGallery";
import { DietaryBadges } from "@/components/templates/menu/_shared/structures/DietaryBadges";
import { cn } from "@/utils/cn";
import type { Menu } from "@/types";

interface Props {
  /** Ordered media list: cover first, then any extra gallery photos (mirrors
   *  how the backend stores `imageUrl` + `images[]`). Blob/data URIs from a
   *  still-uploading file are handled fine. */
  images?: (string | null | undefined)[];
  videos?: (string | null | undefined)[];
  name: string;
  price: string | number;
  description?: string;
  category?: string;
  type?: string;
  popular?: boolean;
  available?: boolean;
  dietaryTags?: string[];
  allergens?: string[];
  spiceLevel?: number | null;
  calories?: string;
  currencySymbol?: string;
}

/**
 * Lightweight, standalone card mimicking how a dish looks on the public menu
 * grid (see listmenu/page.tsx's item card) — used to live-preview an item
 * while it's still being created/edited, without pulling in the full
 * tenant site theme/config. The photo area is the same swipeable gallery
 * customers see on the public detail view, so multiple photos/a video
 * preview exactly as they'll actually appear.
 */
export function MenuItemPreviewCard({
  images = [],
  videos = [],
  name,
  price,
  description,
  category,
  type,
  popular = false,
  available = true,
  dietaryTags = [],
  allergens = [],
  spiceLevel = null,
  calories = "",
  currencySymbol = "$",
}: Props) {
  const priceNum = Number(price);
  const priceLabel = Number.isFinite(priceNum) && String(price).trim() !== "" ? priceNum.toFixed(2) : "0.00";

  const cleanImages = images.filter((u): u is string => Boolean(u));
  const cleanVideos = videos.filter((u): u is string => Boolean(u));

  const galleryItem: Menu = {
    id: "",
    item: name,
    description: description ?? "",
    price: String(price ?? ""),
    category: category ?? "",
    type: type ?? "",
    popular: !!popular,
    availability: !!available,
    imageUrl: cleanImages[0],
    images: cleanImages.slice(1),
    videos: cleanVideos,
    dietaryTags,
    allergens,
    spiceLevel,
    calories: calories.trim() !== "" && Number.isFinite(Number(calories)) ? Number(calories) : null,
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* Photo area — the same gallery/carousel used on the public detail view */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <MenuItemGallery item={galleryItem} primary="#171717" secondary="#64748b" className="h-full w-full" />

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap items-center gap-2">
          {popular && (
            <span className="flex items-center gap-1 rounded-md bg-warning/40 px-2 py-0.5 text-caption font-bold text-warning-foreground shadow-xs backdrop-blur-xs">
              <PiSparkleFill size={10} />
              Popular
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute right-2.5 top-2.5">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-caption font-bold shadow-xs backdrop-blur-xs",
              available ? "bg-success text-white" : "bg-black/60 text-white/90",
            )}
          >
            {available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-caption font-bold text-primary truncate">
            {category || "Category"}
          </span>
          {type && (
            <span className="rounded bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground truncate">
              {type}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-foreground">
          {name || "Item name"}
        </h3>

        {description ? (
          <p className="mt-0.5 line-clamp-2 text-caption text-muted-foreground">{description}</p>
        ) : null}

        <DietaryBadges item={galleryItem} detailed className="mt-2" />

        <p className="mt-2 text-base font-bold tabular-figures text-foreground">{currencySymbol}{priceLabel}</p>
      </div>
    </div>
  );
}
