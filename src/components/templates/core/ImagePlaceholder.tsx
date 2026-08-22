"use client";

import { PiImageBold } from "react-icons/pi";

const ASPECT_CLASS: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

/**
 * Wireframe-stage placeholder for any decorative image slot (hero art, category
 * banners, gallery tiles) a new layout structure needs but has no real tenant
 * data image for yet. Real per-tenant images (gallery uploads, dish photos,
 * logo) always take priority over this — it's only a stand-in for genuinely
 * empty slots so layouts can be swapped for real art later without code changes.
 */
export function ImagePlaceholder({
  aspect = "video",
  label,
  className = "",
}: {
  aspect?: "square" | "video" | "portrait" | "wide";
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-current/20 bg-current/5 text-current/40 ${ASPECT_CLASS[aspect]} ${className}`}
    >
      <PiImageBold className="text-2xl" />
      {label && <span className="px-2 text-center text-[10px] font-semibold uppercase tracking-wider">{label}</span>}
    </div>
  );
}
