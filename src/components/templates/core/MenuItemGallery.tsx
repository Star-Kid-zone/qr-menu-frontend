"use client";

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { PiArrowLeftBold, PiArrowRightBold } from 'react-icons/pi';
import { resolvePublicImageUrl } from './publicMedia';
import { NoImagePlaceholder } from './NoImagePlaceholder';
import type { MenuImageProps } from "@/types/components/templates/MenuImage.types";

type MediaSlide = { type: 'image' | 'video'; url: string };

function normalizeUrl(entry: unknown): string | null {
  if (!entry) return null;
  const raw = typeof entry === 'string' ? entry : (entry as { url?: string })?.url;
  if (!raw) return null;
  return resolvePublicImageUrl({ image_url: raw, image_path: null }) ?? raw;
}

// Local file previews (blob:/data: URIs, e.g. while an admin is mid-upload)
// can't go through next/image's optimizer — it can only fetch real URLs.
const isLocalPreviewUrl = (url: string) => /^(blob|data):/i.test(url);

/**
 * Full media gallery for a menu item's detail view — a cover image plus any
 * extra photos/videos, swipeable via native scroll-snap (no carousel library
 * in this project). Degrades to a single static image when there's nothing
 * else to browse, matching the old `MenuItemImage` behavior exactly.
 *
 * Callers should render this with `key={item.id}` (see MenuItemDetailModal)
 * so switching items remounts it with fresh slide/error state, rather than
 * reconciling stale state from the previous item via an effect.
 */
export function MenuItemGallery({ item, primary, secondary, className = '' }: MenuImageProps) {
  const slides = useMemo<MediaSlide[]>(() => {
    const anyItem = item as unknown as { images?: unknown[]; videos?: unknown[] };
    const seen = new Set<string>();
    const out: MediaSlide[] = [];

    const pushImage = (raw: unknown) => {
      const url = normalizeUrl(raw);
      if (url && !seen.has(url)) {
        seen.add(url);
        out.push({ type: 'image', url });
      }
    };

    pushImage(item.image_url || item.imageUrl || item.image);
    if (Array.isArray(anyItem.images)) anyItem.images.forEach(pushImage);
    if (Array.isArray(anyItem.videos)) {
      anyItem.videos.forEach((raw) => {
        const url = normalizeUrl(raw);
        if (url && !seen.has(url)) {
          seen.add(url);
          out.push({ type: 'video', url });
        }
      });
    }
    return out;
  }, [item]);

  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((prev) => (prev === i ? prev : i));
  };

  if (slides.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <NoImagePlaceholder primary={primary} secondary={secondary} />
      </div>
    );
  }

  // Nothing to browse — render exactly like the old single-image view (no carousel chrome).
  if (slides.length === 1 && slides[0].type === 'image') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {!failed[0] ? (
          <Image
            src={slides[0].url}
            alt={item.item || item.name || ""}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized={isLocalPreviewUrl(slides[0].url)}
            onError={() => setFailed((f) => ({ ...f, 0: true }))}
          />
        ) : (
          <NoImagePlaceholder primary={primary} secondary={secondary} />
        )}
      </div>
    );
  }

  return (
    <div className={`group/gallery relative overflow-hidden bg-black/5 ${className}`}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div key={slide.url + i} className="relative h-full w-full shrink-0 snap-center">
            {slide.type === 'video' ? (
              <video
                src={slide.url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full bg-black object-contain"
              />
            ) : !failed[i] ? (
              <Image
                src={slide.url}
                alt={item.item || item.name || ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized={isLocalPreviewUrl(slide.url)}
                onError={() => setFailed((f) => ({ ...f, [i]: true }))}
              />
            ) : (
              <NoImagePlaceholder primary={primary} secondary={secondary} />
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollToIndex(index - 1)}
        disabled={index === 0}
        className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity focus-visible:opacity-100 group-hover/gallery:opacity-100 disabled:pointer-events-none disabled:opacity-0"
      >
        <PiArrowLeftBold size={13} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollToIndex(index + 1)}
        disabled={index === slides.length - 1}
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity focus-visible:opacity-100 group-hover/gallery:opacity-100 disabled:pointer-events-none disabled:opacity-0"
      >
        <PiArrowRightBold size={13} />
      </button>

      {/* Counter (bottom-right, so it doesn't collide with a caller's own
          top-corner overlay badges — e.g. Popular/Available pills) */}
      <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        {index + 1}/{slides.length}
      </div>

      {/* Dots */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.url + i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`pointer-events-auto h-1.5 rounded-full shadow-sm transition-all ${
              i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MenuItemGallery;
