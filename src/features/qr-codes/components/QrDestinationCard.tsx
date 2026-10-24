"use client";

import React from "react";
import { PiBookOpenBold, PiQrCodeBold, PiStorefrontBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { toast } from "@/components/ui/toast";

interface QrDestinationCardProps {
  qrValue: string;
  setQrValue: (val: string) => void;
  landingUrl?: string;
  menuUrl?: string;
}

export function QrDestinationCard({
  qrValue,
  setQrValue,
  landingUrl,
  menuUrl,
}: QrDestinationCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <PiQrCodeBold size={14} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Destination</p>
          <p className="text-sm font-bold text-foreground">QR Target URL</p>
        </div>
      </div>

      {(landingUrl || menuUrl) && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {landingUrl && (
            <button
              type="button"
              onClick={() => {
                setQrValue(landingUrl);
                toast.success("Set to Storefront landing page");
              }}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all",
                qrValue === landingUrl
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
              )}
            >
              <div className="flex w-full items-center gap-1.5">
                <PiStorefrontBold
                  size={13}
                  className={qrValue === landingUrl ? "text-primary" : "text-muted-foreground"}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    qrValue === landingUrl ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Storefront
                </span>
                {qrValue === landingUrl && (
                  <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                    Active
                  </span>
                )}
              </div>
              <span
                className="max-w-full truncate font-mono text-[10px] text-foreground"
                title={landingUrl}
              >
                {landingUrl}
              </span>
            </button>
          )}

          {menuUrl && (
            <button
              type="button"
              onClick={() => {
                setQrValue(menuUrl);
                toast.success("Set to Digital Menu page");
              }}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-all",
                qrValue === menuUrl
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
              )}
            >
              <div className="flex w-full items-center gap-1.5">
                <PiBookOpenBold
                  size={13}
                  className={qrValue === menuUrl ? "text-primary" : "text-muted-foreground"}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    qrValue === menuUrl ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Digital Menu
                </span>
                {qrValue === menuUrl && (
                  <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                    Active
                  </span>
                )}
              </div>
              <span
                className="max-w-full truncate font-mono text-[10px] text-foreground"
                title={menuUrl}
              >
                {menuUrl}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
