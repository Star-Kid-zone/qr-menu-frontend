"use client";

import React, { ChangeEvent, forwardRef } from "react";
import Image from "next/image";
import { ReactQRCode, type ReactQRCodeRef } from "@lglab/react-qr-code";
import { PiImageBold, PiTrashBold, PiUploadSimpleBold } from "react-icons/pi";
import {
  toFinderOuterStyle,
  toReactQrModuleStyle,
  type DataModuleStyle,
  type FinderPatternStyle,
} from "../types";

interface QrPreviewCardProps {
  qrValue: string;
  size: number;
  margin: number;
  bgColor: string;
  moduleStyle: DataModuleStyle;
  moduleColor: string;
  finderStyle: FinderPatternStyle;
  finderColor: string;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  printSizeCm: string;
  printSizeInches: string;
  onLogoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const QrPreviewCard = forwardRef<ReactQRCodeRef, QrPreviewCardProps>(
  function QrPreviewCard(
    {
      qrValue,
      size,
      margin,
      bgColor,
      moduleStyle,
      moduleColor,
      finderStyle,
      finderColor,
      logo,
      setLogo,
      printSizeCm,
      printSizeInches,
      onLogoUpload,
    },
    ref
  ) {
    return (
      <div className="min-h-0 overflow-hidden flex flex-col gap-2.5 lg:col-span-5 xl:col-span-4">
        {/* Live QR Preview Card */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-sm flex flex-col items-center">
          <div className="mb-2.5 flex w-full items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Live Print Preview
            </p>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {size}&times;{size}px
            </span>
          </div>

          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-2.5">
            <div
              className="relative flex aspect-square w-full max-w-[185px] sm:max-w-[205px] items-center justify-center overflow-hidden rounded-xl border border-border shadow-md transition-all duration-200 [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
              style={{ backgroundColor: bgColor }}
            >
              <ReactQRCode
                ref={ref}
                value={qrValue || "https://example.com"}
                size={size}
                marginSize={margin}
                background={bgColor}
                dataModulesSettings={{
                  style: toReactQrModuleStyle(moduleStyle),
                  color: moduleColor,
                }}
                finderPatternInnerSettings={{
                  style: finderStyle,
                  color: finderColor,
                }}
                finderPatternOuterSettings={{
                  style: toFinderOuterStyle(finderStyle),
                  color: finderColor,
                }}
                imageSettings={
                  logo
                    ? { src: logo, width: 44, height: 44, excavate: true, opacity: 1 }
                    : undefined
                }
              />
            </div>
            <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">
              Scan with smartphone camera
            </p>
          </div>

          {/* Print Spec Details */}
          <div className="mt-2.5 w-full space-y-1 border-t border-border pt-2 text-[11px] text-muted-foreground">
            <div className="flex justify-between">
              <span>Resolution</span>
              <span className="font-semibold text-foreground">
                {size}&times;{size}px
              </span>
            </div>
            <div className="flex justify-between">
              <span>Physical Size</span>
              <span className="font-semibold text-foreground">
                ~{printSizeCm}&times;{printSizeCm}cm ({printSizeInches}&quot;)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quiet Zone</span>
              <span className="font-semibold text-foreground">
                {margin} {margin === 1 ? "block" : "blocks"}
              </span>
            </div>
          </div>
        </div>

        {/* Logo Upload Card */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <PiImageBold size={13} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Branding
                </p>
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
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <div className="relative size-8 overflow-hidden rounded border border-border bg-white shadow-xs shrink-0">
                <Image src={logo} alt="Logo preview" fill unoptimized className="object-cover" />
              </div>
              <span className="font-semibold text-[11px]">Logo embedded into QR center.</span>
            </div>
          ) : (
            <label className="group flex h-14 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
              <div className="flex items-center gap-1.5">
                <PiUploadSimpleBold
                  className="text-muted-foreground transition group-hover:scale-110 group-hover:text-primary"
                  size={16}
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  Upload brand logo for QR center
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/70">
                PNG, SVG or JPG (square format recommended)
              </span>
              <input type="file" className="sr-only" accept="image/*" onChange={onLogoUpload} />
            </label>
          )}
        </div>
      </div>
    );
  }
);
