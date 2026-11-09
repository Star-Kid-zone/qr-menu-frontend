"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { PiImageBold, PiTrashBold, PiUploadSimpleBold } from "react-icons/pi";

interface QrLogoCardProps {
  logo: string | null;
  setLogo: (logo: string | null) => void;
  onLogoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function QrLogoCard({ logo, setLogo, onLogoUpload }: QrLogoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <PiImageBold size={13} />
          </div>
          <div>
            <p className="text-caption font-bold text-primary">Branding</p>
            <p className="text-xs font-bold text-foreground">Center Logo</p>
          </div>
        </div>
        {logo && (
          <button
            type="button"
            onClick={() => setLogo(null)}
            className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
          >
            <PiTrashBold size={13} /> Remove
          </button>
        )}
      </div>

      {logo ? (
        <div className="flex items-center gap-3 rounded-lg border border-success/15 bg-success/10 p-2 text-xs text-success">
          <div className="relative size-8 overflow-hidden rounded border border-border bg-white shadow-xs shrink-0">
            <Image src={logo} alt="Logo preview" fill unoptimized className="object-cover" />
          </div>
          <span className="font-semibold text-caption">Logo embedded into QR center.</span>
        </div>
      ) : (
        <label className="group flex h-14 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
          <div className="flex items-center gap-2">
            <PiUploadSimpleBold
              className="text-muted-foreground transition group-hover:scale-110 group-hover:text-primary"
              size={16}
            />
            <span className="text-xs font-semibold text-muted-foreground">Upload brand logo for QR center</span>
          </div>
          <span className="text-caption text-muted-foreground/70">PNG, SVG or JPG (square format recommended)</span>
          <input type="file" className="sr-only" accept="image/*" onChange={onLogoUpload} />
        </label>
      )}
    </div>
  );
}
