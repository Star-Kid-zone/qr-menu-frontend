"use client";

import React, { useState } from "react";
import { PiPrinterBold } from "react-icons/pi";
import { Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { QR_PRINT_SHEET } from "@/constants/qrCodes.constants";
import type { QrLayout, QrPrintSize } from "@/types";
import { sheetLayout } from "../lib/print";

interface QrPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  layout: QrLayout;
  printSize: QrPrintSize;
  tableNumbers: boolean;
  tablePrefix: string;
  busy: boolean;
  /** Labels for each copy: table numbers, or blanks for plain copies. */
  onPrint: (labels: string[]) => void;
}

const clampCount = (n: number) => Math.max(1, Math.min(QR_PRINT_SHEET.maxCopies, Math.floor(n) || 1));

export function QrPrintDialog({ isOpen, onClose, layout, printSize, tableNumbers, tablePrefix, busy, onPrint }: QrPrintDialogProps) {
  const { columns, rows } = sheetLayout(layout, printSize);
  const perPage = columns * rows;
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(Math.max(perPage, 4));
  const [copies, setCopies] = useState(perPage);

  const count = tableNumbers ? Math.max(0, to - from + 1) : copies;
  const valid = tableNumbers ? from >= 1 && to >= from && count <= QR_PRINT_SHEET.maxCopies : copies >= 1;
  const pages = Math.ceil(count / perPage);
  const what = layout === "card" ? "cards" : layout === "sticker" ? "stickers" : "codes";

  const submit = () => {
    if (!valid) return;
    const labels = tableNumbers
      ? Array.from({ length: count }, (_, i) => String(from + i))
      : Array.from({ length: copies }, () => "");
    onPrint(labels);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print a sheet"
      maxWidth="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={!valid} loading={busy} leftIcon={<PiPrinterBold className="size-4" />}>
            Print {count} {what}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          {perPage} {printSize.label} {what} fit on each A4 page.
          {layout === "card" ? " Cut along the dashed lines." : ""}
        </p>
        {tableNumbers ? (
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`First ${tablePrefix.trim().toLowerCase() || "number"}`} htmlFor="qr-print-from">
              <Input id="qr-print-from" type="number" min={1} max={999} value={from} onChange={(e) => setFrom(Math.max(1, Number(e.target.value) || 1))} />
            </FormField>
            <FormField label="Last" htmlFor="qr-print-to">
              <Input id="qr-print-to" type="number" min={1} max={999} value={to} onChange={(e) => setTo(Math.max(1, Number(e.target.value) || 1))} />
            </FormField>
          </div>
        ) : (
          <FormField label="Copies" htmlFor="qr-print-copies">
            <Input id="qr-print-copies" type="number" min={1} max={QR_PRINT_SHEET.maxCopies} value={copies} onChange={(e) => setCopies(clampCount(Number(e.target.value)))} />
          </FormField>
        )}
        {valid ? (
          <p className="text-caption text-muted-foreground">
            {count} {what} on {pages} {pages === 1 ? "page" : "pages"}. In the print window, set scale to 100% (turn off &quot;Fit to page&quot;).
          </p>
        ) : (
          <p className="text-caption text-destructive">
            {to < from ? "The last number must be after the first." : `Print up to ${QR_PRINT_SHEET.maxCopies} at a time.`}
          </p>
        )}
      </div>
    </Modal>
  );
}
