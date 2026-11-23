"use client";

import React from "react";
import { PiBookOpenBold, PiCheckCircleFill, PiStorefrontBold } from "react-icons/pi";
import type { QrDestination } from "@/types";
import { cn } from "@/utils/cn";
import { PanelSection } from "./PanelParts";

interface QrLinkPanelProps {
  destination: QrDestination;
  urls: { menu: string; website: string };
  onChange: (destination: QrDestination) => void;
}

/** Where a scan lands. Stored as menu/website so a new web address follows through. */
export function QrLinkPanel({ destination, urls, onChange }: QrLinkPanelProps) {
  const options = [
    { id: "menu" as const, title: "Your menu", body: "Guests go straight to your dishes and prices.", url: urls.menu, Icon: PiBookOpenBold },
    { id: "website" as const, title: "Your website", body: "Your home page, with hours, directions and the menu.", url: urls.website, Icon: PiStorefrontBold },
  ];
  return (
    <PanelSection title="When guests scan, open" hint="If you change your web address, the code follows. Reprint after changing it.">
      <div role="radiogroup" aria-label="Scan destination" className="grid gap-3 sm:grid-cols-2">
        {options.map(({ id, title, body, url, Icon }) => {
          const selected = destination === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!url}
              onClick={() => onChange(id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
                selected ? "border-primary bg-accent/60 ring-1 ring-primary" : "border-border hover:border-primary/40",
              )}
            >
              <span className="flex w-full items-center gap-2">
                <Icon aria-hidden className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
                <span className="text-body-medium text-foreground">{title}</span>
                {selected ? <PiCheckCircleFill aria-hidden className="ml-auto size-5 text-primary" /> : null}
              </span>
              <span className="text-caption text-muted-foreground">{body}</span>
              <span className="max-w-full truncate font-mono text-caption text-foreground" title={url}>{url}</span>
            </button>
          );
        })}
      </div>
    </PanelSection>
  );
}
