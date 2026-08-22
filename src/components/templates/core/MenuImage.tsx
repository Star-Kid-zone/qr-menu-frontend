import Image from 'next/image';
import type { Menu } from '@/types';
import { resolvePublicImageUrl } from './publicMedia';
import { MenuImageProps } from "@/types/components/templates/MenuImage.types";

export function MenuItemImage({ item, primary, secondary, className = '' }: MenuImageProps) {
  const raw = item.image_url || item.image;
  const src = raw ? resolvePublicImageUrl({ image_url: raw, image_path: null }) ?? raw : null;
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(145deg, ${primary}40, ${secondary}65)`,
      }}
      aria-hidden
    />
  );
}

export default MenuItemImage;
