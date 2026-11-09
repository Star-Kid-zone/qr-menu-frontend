"use client";

import { useState } from 'react';
import Image from 'next/image';
import { resolvePublicImageUrl } from './publicMedia';
import { NoImagePlaceholder } from './NoImagePlaceholder';
import type { MenuImageProps } from "@/types/components/templates/MenuImage.types";

export function MenuItemImage({ item, primary, secondary, className = '' }: MenuImageProps) {
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

  if (src && !imageFailed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={item.item || item.name || ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NoImagePlaceholder primary={primary} secondary={secondary} />
    </div>
  );
}

export default MenuItemImage;
