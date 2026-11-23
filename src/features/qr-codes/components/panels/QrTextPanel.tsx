"use client";

import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { QR_PRINT_SHEET, QR_TEXT_LIMITS, QR_TEXT_PRESETS } from "@/constants/qrCodes.constants";
import type { QrDesign, QrFrameSettings } from "@/types";
import { Chip, PanelSection } from "./PanelParts";

interface QrTextPanelProps {
  design: QrDesign;
  businessName: string;
  previewNumber: number;
  onPreviewNumber: (n: number) => void;
  onChange: (patch: Partial<QrFrameSettings>) => void;
}

/** The words on the card or sticker, and table numbers. */
export function QrTextPanel({ design, businessName, previewNumber, onPreviewNumber, onChange }: QrTextPanelProps) {
  const f = design.frame;
  const presets = QR_TEXT_PRESETS[design.destination];

  return (
    <div className="space-y-6">
      {f.layout === "none" ? (
        <p className="rounded-lg bg-muted/50 px-4 py-3 text-body text-muted-foreground">
          Words show on table cards and stickers. Choose one of those above to see them.
        </p>
      ) : null}

      <PanelSection title="What it says" hint="Tell guests what they get when they scan.">
        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          {presets.map((p) => (
            <Chip
              key={p.headline}
              selected={f.headline === p.headline && f.subline === p.subline}
              onClick={() => onChange({ headline: p.headline, subline: p.subline })}
            >
              {p.headline}
            </Chip>
          ))}
        </div>
        <FormField label="Headline" htmlFor="qr-headline" hint={`${f.headline.length}/${QR_TEXT_LIMITS.headline}`}>
          <Input
            id="qr-headline"
            value={f.headline}
            maxLength={QR_TEXT_LIMITS.headline}
            placeholder="Scan for our menu"
            onChange={(e) => onChange({ headline: e.target.value })}
          />
        </FormField>
        <FormField label="Small print" htmlFor="qr-subline" hint={`${f.subline.length}/${QR_TEXT_LIMITS.subline}`}>
          <Input
            id="qr-subline"
            value={f.subline}
            maxLength={QR_TEXT_LIMITS.subline}
            placeholder="Point your phone camera here"
            onChange={(e) => onChange({ subline: e.target.value })}
          />
        </FormField>
        <Checkbox
          id="qr-show-name"
          checked={f.showName}
          disabled={!businessName}
          onChange={(e) => onChange({ showName: e.target.checked })}
          label={businessName ? `Show "${businessName}"` : "Show your business name"}
          description={businessName ? undefined : "Add your business name in Business settings first."}
        />
      </PanelSection>

      <PanelSection title="Table numbers" hint="Number each card so staff and guests know which table it is.">
        <Checkbox
          id="qr-table-numbers"
          checked={f.tableNumbers}
          onChange={(e) => onChange({ tableNumbers: e.target.checked })}
          label="Print a table number on each card"
          description={`Print a numbered sheet from the download menu, up to ${QR_PRINT_SHEET.maxCopies} at a time. Every card opens the same menu.`}
        />
        {f.tableNumbers ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Label" htmlFor="qr-table-prefix">
              <Input
                id="qr-table-prefix"
                value={f.tablePrefix}
                maxLength={QR_TEXT_LIMITS.tablePrefix}
                placeholder="Table"
                onChange={(e) => onChange({ tablePrefix: e.target.value })}
              />
            </FormField>
            <FormField label="Number in preview" htmlFor="qr-table-preview" hint="Single downloads use this number.">
              <Input
                id="qr-table-preview"
                type="number"
                min={1}
                max={999}
                value={previewNumber}
                onChange={(e) => onPreviewNumber(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
              />
            </FormField>
          </div>
        ) : null}
      </PanelSection>
    </div>
  );
}
