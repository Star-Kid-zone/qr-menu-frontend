"use client";

import React, { ChangeEvent, forwardRef } from "react";
import { ReactQRCode, type ReactQRCodeRef } from "@lglab/react-qr-code";
import { QrLogoCard } from "./QrLogoCard";
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
  /** Just the QR itself: hides print specs and the logo uploader. */
  compact?: boolean;
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
      compact = false,
    },
    ref
  ) {
    const qr = (
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
    );

    if (compact) {
      return (
        <div className="size-24 shrink-0 overflow-hidden rounded-lg border border-border lg:size-48 [&>div]:max-w-none [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
          {qr}
        </div>
      );
    }

    return (
      <div
        className={
          compact
            ? "flex flex-col gap-2 lg:col-span-12 lg:max-w-sm"
            : "min-h-0 overflow-hidden flex flex-col gap-2 lg:col-span-5 xl:col-span-4"
        }
      >
        {/* Live QR Preview Card */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col items-center">
          <div className="mb-2 flex w-full items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground">
              Live Print Preview
            </p>
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-caption font-bold text-primary">
              {size}&times;{size}px
            </span>
          </div>

          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-border bg-muted/30 p-3">
            {qr}
            <p className="mt-2 text-caption font-semibold text-muted-foreground">
              Scan with smartphone camera
            </p>
          </div>

          {/* Print Spec Details */}
          {!compact && (
          <div className="mt-2 w-full space-y-1 border-t border-border pt-2 text-caption text-muted-foreground">
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
          )}
        </div>

        {!compact && <QrLogoCard logo={logo} setLogo={setLogo} onLogoUpload={onLogoUpload} />}
      </div>
    );
  }
);
