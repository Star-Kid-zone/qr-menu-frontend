"use client";

import { useState, type CSSProperties } from 'react';
import Image from '@/components/ui/Image';
import { resolvePublicImageUrl } from './publicMedia';
import type { MenuImageProps } from "@/types/public/templates/MenuImage.types";

/**
 * A dish photo, or — when there isn't one (or it fails to load) — a quiet
 * monogram tile: the dish's initial set large on a tint of the menu's own
 * colours with a fine diagonal pattern, so photo-less menus still look
 * deliberate instead of showing a "No image" stamp on every card.
 */
export function MenuItemImage({ item, primary, secondary, className = '', style }: MenuImageProps) {
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
          sizes="(max-width: 768px) 100vw, 33vw"
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

export default MenuItemImage;
