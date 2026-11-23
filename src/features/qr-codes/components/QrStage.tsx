"use client";

import React from "react";
import { PiCheckCircleBold, PiDownloadSimpleBold, PiFileSvgBold, PiPrinterBold, PiWarningBold, PiWarningCircleBold } from "react-icons/pi";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { SubTabPills } from "@/components/ui/SubTabPills";
import { QR_LAYOUT_OPTIONS, QR_PRINT_SIZES } from "@/constants/qrCodes.constants";
import type { QrLayout, QrPrintSize, QrScanReport } from "@/types";
import { cn } from "@/utils/cn";
import { scanDistanceCm } from "../lib/scan";

interface QrStageProps {
  layout: QrLayout;
  printSize: QrPrintSize;
  report: QrScanReport;
  printedQrMm: number;
  busy: boolean;
  onLayout: (layout: QrLayout) => void;
  onPrintSize: (id: string) => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onPrintSheet: () => void;
  /** The artwork itself. */
  children: React.ReactNode;
}

const TONE = {
  good: { badge: "success", label: "Scans well", icon: PiCheckCircleBold },
  warn: { badge: "warning", label: "Check before printing", icon: PiWarningBold },
  bad: { badge: "danger", label: "May not scan", icon: PiWarningCircleBold },
} as const;

/** The large preview, what is being printed, whether it will scan, and the downloads. */
export function QrStage({
  layout, printSize, report, printedQrMm, busy, onLayout, onPrintSize, onDownloadPng, onDownloadSvg, onPrintSheet, children,
}: QrStageProps) {
  const tone = TONE[report.tone];
  const ToneIcon = tone.icon;
  return (
    <div className="flex flex-col gap-4">
      <SubTabPills options={QR_LAYOUT_OPTIONS} active={layout} onChange={onLayout} />

      <div
        className="relative flex min-h-[20rem] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/60 p-6 sm:min-h-[26rem]"
        style={{ backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      >
        <div
          className={cn(
            "w-full transition-[max-width] duration-200 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:drop-shadow-[0_10px_24px_rgba(28,21,38,0.18)]",
            layout === "card" ? "max-w-[17rem] sm:max-w-[19rem]" : layout === "sticker" ? "max-w-[16rem] sm:max-w-[18rem]" : "max-w-[14rem] sm:max-w-[16rem]",
          )}
        >
          {children}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-body-medium text-foreground">Print size</p>
        <div role="radiogroup" aria-label="Print size" className="grid grid-cols-3 gap-2">
          {QR_PRINT_SIZES[layout].map((s) => {
            const selected = s.id === printSize.id;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onPrintSize(s.id)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary bg-accent/60 ring-1 ring-primary" : "border-border hover:border-primary/40",
                )}
              >
                <span className="block text-body-medium text-foreground">{s.label}</span>
                <span className="block truncate text-caption text-muted-foreground">{s.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border px-4 py-3" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={tone.badge} className="gap-1">
            <ToneIcon aria-hidden className="size-3.5" />
            {tone.label}
          </Badge>
          <span className="text-caption text-muted-foreground">
            Code prints {(printedQrMm / 10).toFixed(1)} cm wide · scans from about {scanDistanceCm(printedQrMm)} cm away
          </span>
        </div>
        {report.issues.length ? (
          <ul className="space-y-1 text-caption text-foreground">
            {report.issues.map((issue) => (
              <li key={issue.message} className="flex gap-2">
                <span aria-hidden className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", issue.tone === "bad" ? "bg-destructive" : "bg-warning")} />
                {issue.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onDownloadPng} loading={busy} leftIcon={<PiDownloadSimpleBold className="size-4" />} className="flex-1 sm:flex-none">
          Download PNG
        </Button>
        <ActionMenu
          label="More"
          items={[
            {
              label: "Print a sheet",
              description: layout === "card" ? "Several cards on A4, numbered if you like" : "Several on one A4 page",
              icon: <PiPrinterBold className="size-4" />,
              onSelect: onPrintSheet,
            },
            {
              label: "Download SVG",
              description: "Sharp at any size, for print shops",
              icon: <PiFileSvgBold className="size-4" />,
              onSelect: onDownloadSvg,
            },
          ]}
        />
      </div>
      <p className="text-caption text-muted-foreground">
        PNG is 300 dpi at {printSize.mm[0]} × {printSize.mm[1]} mm. Print at 100% scale.
      </p>
    </div>
  );
}
