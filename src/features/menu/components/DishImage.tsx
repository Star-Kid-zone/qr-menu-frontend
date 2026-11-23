"use client";

import { useState } from "react";
import Image from "@/components/ui/Image";
import { PiForkKnife } from "react-icons/pi";
import { cn } from "@/utils/cn";

/**
 * A dish photo with one consistent fallback: a missing URL and a URL that
 * fails to load both show the same neutral placeholder (never broken-image
 * alt text spilling over the card).
 */
export function DishImage({ src, alt, className, sizes = "240px" }: { src?: string | null; alt: string; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {showImage ? (
        <Image src={src!} alt={alt} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground" role="img" aria-label={`${alt} (no photo)`}>
          <PiForkKnife aria-hidden className="size-6" />
        </div>
      )}
    </div>
  );
}
