"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { resolvePublicImageUrl } from './publicMedia';
import { NoImagePlaceholder } from './NoImagePlaceholder';
import type { MenuImageProps } from "@/types/components/templates/MenuImage.types";

export function MenuItemImage({ item, primary, secondary, className = '' }: MenuImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const anyItem = item as any;
  const raw =
    item.image_url ||
    item.imageUrl ||
    item.image ||
    (anyItem?.images && anyItem.images.length > 0
      ? typeof anyItem.images[0] === 'string'
        ? anyItem.images[0]
        : anyItem.images[0]?.url
      : null);
  const src = raw ? resolvePublicImageUrl({ image_url: raw, image_path: null }) ?? raw : null;

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

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
