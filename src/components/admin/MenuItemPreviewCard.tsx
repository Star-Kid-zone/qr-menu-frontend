"use client";

import { PiSparkleFill } from "react-icons/pi";
import { MenuItemGallery } from "@/components/templates/core/MenuItemGallery";
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
}: Props) {
  const priceNum = Number(price);
  const priceLabel = Number.isFinite(priceNum) && String(price).trim() !== "" ? priceNum.toFixed(2) : "0.00";

  const cleanImages = images.filter((u): u is string => Boolean(u));
  const cleanVideos = videos.filter((u): u is string => Boolean(u));

  const galleryItem: Menu = {
    id: 0,
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
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* Photo area — the same gallery/carousel used on the public detail view */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <MenuItemGallery item={galleryItem} primary="#171717" secondary="#64748b" className="h-full w-full" />

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
          {popular && (
            <span className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-xs backdrop-blur-xs">
              <PiSparkleFill size={10} />
              Popular
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute right-2.5 top-2.5">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-xs",
              available ? "bg-emerald-500 text-white" : "bg-black/60 text-white/90",
            )}
          >
            {available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-3.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
            {category || "Category"}
          </span>
          {type && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground truncate">
              {type}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-foreground">
          {name || "Item name"}
        </h3>

        {description ? (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{description}</p>
        ) : null}

        <p className="mt-2 text-base font-bold tabular-figures text-foreground">${priceLabel}</p>
      </div>
    </div>
  );
}
