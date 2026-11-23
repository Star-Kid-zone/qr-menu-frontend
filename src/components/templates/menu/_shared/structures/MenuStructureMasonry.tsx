"use client";

import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryBadges } from "./DietaryBadges";
import { EmptyResults, PhotoMenuHeader, StarIcon, hasPhoto, mix, priceLabel } from "./MenuStructureGrid";

/** Varied photo heights so it reads as a wall, not a grid. Stable per position. */
const RATIOS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[5/4]", "aspect-[2/3]"];

function PhotoTile({ p, t, item, i }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu; i: number }) {
  const unavailable = item.availability === false;
  return (
    <div className={`relative w-full overflow-hidden ${RATIOS[i % RATIOS.length]}`}>
      <div className={`absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04] ${unavailable ? "grayscale" : ""}`}>
        <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3.5 pb-3 pt-14 text-white sm:px-4">
        <h3 className="text-[15px] font-semibold leading-snug [text-wrap:balance]">{item.item}</h3>
        <p className="mt-0.5 text-sm font-medium tabular-nums text-white/90">
          {priceLabel(p, item)}
          {unavailable && <span className="font-normal text-white/75"> — not available today</span>}
        </p>
      </div>
      {item.popular && (
        <span style={{ background: t.accent, color: t.accentText }} className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
          <StarIcon className="size-2.5" /> Popular
        </span>
      )}
    </div>
  );
}

/** A dish without a photo becomes a typographic card: the name set large, the description as the picture. */
function TextTile({ p, t, item }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu }) {
  const unavailable = item.availability === false;
  return (
    <div className="px-4 pb-1 pt-5 sm:px-5">
      <span aria-hidden="true" style={{ background: t.accent }} className="mb-4 block h-0.5 w-8 rounded-full" />
      {item.popular && (
        <span style={{ color: t.accent }} className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold">
          <StarIcon className="size-3" /> Popular
        </span>
      )}
      <h3 style={{ color: t.textPrimary }} className="text-xl font-semibold leading-tight tracking-tight [text-wrap:balance]">
        {item.item}
      </h3>
      {item.description && (
        <p style={{ color: t.textSecondary }} className="mt-2 line-clamp-5 text-[13px] leading-relaxed">
          {item.description}
        </p>
      )}
      <p style={{ color: t.accent }} className="mt-4 text-base font-semibold tabular-nums">
        {priceLabel(p, item)}
      </p>
      {unavailable && <p style={{ color: t.textSecondary }} className="text-xs">Not available today</p>}
    </div>
  );
}

/** Masonry: an editorial wall — photos with soft captions, typographic cards for dishes without one. */
export default function MenuStructureMasonry({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const allItems = p.grouped.flatMap(([, items]) => items);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-clip pb-32">
      <PhotoMenuHeader p={p} t={t} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {allItems.length === 0 ? (
          <EmptyResults p={p} t={t} />
        ) : (
          <div className="columns-1 gap-3 min-[360px]:columns-2 sm:gap-4 lg:columns-3 xl:columns-4 xl:gap-5">
            {allItems.map((item, i) => {
              const photo = hasPhoto(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => p.openItem(item)}
                  style={{
                    background: photo ? t.sectionBg : mix(t.accent, t.sectionBg, 7),
                    borderColor: photo ? "transparent" : mix(t.accent, t.border, 25),
                    outlineColor: t.accent,
                    opacity: item.availability === false && !photo ? 0.7 : 1,
                  }}
                  className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border text-left focus-visible:outline-2 focus-visible:outline-offset-2 sm:mb-4 xl:mb-5 motion-safe:transition-shadow motion-safe:hover:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.4)]"
                >
                  {photo ? <PhotoTile p={p} t={t} item={item} i={i} /> : <TextTile p={p} t={t} item={item} />}
                  <DietaryBadges item={item} className={photo ? "px-3.5 py-2 empty:hidden sm:px-4" : "px-4 pb-4 pt-2 empty:hidden sm:px-5"} />
                </button>
              );
            })}
          </div>
        )}
      </main>
      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
