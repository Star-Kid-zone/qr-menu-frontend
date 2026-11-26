"use client";

import { useState, type CSSProperties } from 'react';
import Image from '@/components/ui/Image';
import { resolvePublicImageUrl } from './publicMedia';
import type { MenuImageProps } from "@/types/public/templates/MenuImage.types";
import { CARD_IMAGE_SIZES, REM_PX, TAILWIND_UNIT_PX } from '@/constants/theme.constants';

function thumbSizes(className: string): string {
  const width = fixedThumbWidth(className);
  return width ? `${width}px` : CARD_IMAGE_SIZES;
}

/**
 * A dish photo, or — when there isn't one (or it fails to load) — a quiet
 * monogram tile: the dish's initial set large on a tint of the menu's own
 * colours with a fine diagonal pattern, so photo-less menus still look
 * deliberate instead of showing a "No image" stamp on every card.
 */
/**
 * The width a thumbnail is drawn at, from its fixed Tailwind size (size-16, sm:h-28/w-28,
 * size-[4.5rem]); null for fluid images. Lets a 64px thumbnail request a ~64px image instead of
 * a full-viewport one (about 10x fewer bytes per dish on a phone).
 */
export function fixedThumbWidth(className: string): number | null {
  let px = 0;
  for (const m of className.matchAll(/(?:^|\s)(?:[a-z]+:)?(?:size|w)-(\d+(?:\.\d+)?|\[(\d+(?:\.\d+)?)rem\])(?=\s|$)/g)) {
    px = Math.max(px, m[2] ? Number(m[2]) * REM_PX : Number(m[1]) * TAILWIND_UNIT_PX);
  }
  return px > 0 ? Math.ceil(px) : null;
}

export function MenuItemImage({ item, primary, secondary, className = '', style, sizes }: MenuImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const raw =
    item.image_url ||
    item.imageUrl ||
    item.image ||
    (firstImage
      ? typeof firstImage === 'string'
        ? firstImage
        : firstImage?.url
      : null);
  const src = raw ? resolvePublicImageUrl({ image_url: raw, image_path: null }) ?? raw : null;

  // Reset the failure flag whenever the image source changes (adjust-state-during-render).
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setImageFailed(false);
  }

  const name = (item.item || item.name || '').trim();

  if (src && !imageFailed) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={style}>
        <Image
          src={src}
          alt={name}
          fill
          sizes={sizes ?? thumbSizes(className)}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  const initial = name.match(/\p{L}|\p{N}/u)?.[0]?.toUpperCase() ?? '·';
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${primary} 12%, transparent)`,
        ...style,
        backgroundImage: `repeating-linear-gradient(135deg, color-mix(in srgb, ${primary} 9%, transparent) 0 1px, transparent 1px 9px)`,
      }}
      aria-hidden
    >
      <span
        className="absolute inset-0 grid place-items-center font-semibold leading-none select-none"
        style={{ color: `color-mix(in srgb, ${primary} 70%, ${secondary})`, containerType: 'size' } as CSSProperties}
      >
        <span style={{ fontSize: 'min(2.6rem, 45cqmin)' }}>{initial}</span>
      </span>
    </div>
  );
}

