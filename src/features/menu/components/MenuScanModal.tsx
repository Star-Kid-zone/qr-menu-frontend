"use client";

/**
 * MenuScanModal.tsx
 *
 * 3-step AI menu scanning modal:
 *   Step 1 — Upload: user picks a menu photo and clicks "Scan with AI"
 *   Step 2 — Review: extracted items shown in an editable table; user
 *             picks category/type, edits any rows, deselects unwanted items
 *   Step 3 — Importing: items saved one-by-one via POST /menu with a
 *             progress indicator; summary shown on completion
 */

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PiUploadSimpleBold,
  PiSpinnerGapBold,
  PiTrashBold,
  PiXBold,
} from "react-icons/pi";
import { Modal } from "@/components/Modal";
import { FormField } from "@/components/ui/FormField";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { menuService } from "@/services/menu.service";
import { menuScanService, type ScannedItem } from "@/services/menuScan.service";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";
import type { IndustryCategory, IndustryType } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ReviewRow extends ScannedItem {
  id: string; // local key for React rendering
  selected: boolean;
}

type Step = "upload" | "review" | "importing" | "done";

interface ImportResult {
  saved: number;
  failed: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void; // called when items have been saved so parent can refresh
  /** The business's fixed industry (set once on the Menu Items page) — null if not set yet. */
  industryId: number | null;
  categories: IndustryCategory[];
  types: IndustryType[];
  defaultCategory?: string;
  defaultType?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MenuScanModal({
  isOpen,
  onClose,
  onImported,
  industryId,
  categories,
  types,
  defaultCategory = "",
  defaultType = "",
}: Props) {
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [bulkCategory, setBulkCategory] = useState(defaultCategory);
  const [bulkType, setBulkType] = useState(defaultType);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── helpers ────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setStep("upload");
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setScanning(false);
    setRows([]);
    setBulkCategory(defaultCategory);
    setBulkType(defaultType);
    setProgress(0);
    setResult(null);
    setDragOver(false);
  }, [previewUrl, defaultCategory, defaultType]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const acceptFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, WEBP, HEIC).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB.");
      return;
    }
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── Step 1: Scan ───────────────────────────────────────────────────────────

  const handleScan = async () => {
    if (!selectedFile) return;
    setScanning(true);
    try {
      const res = await menuScanService.scan(selectedFile);
      const items: ScannedItem[] = res.data.items ?? [];
      if (items.length === 0) {
        toast.error(
          res.data.message ||
            "No menu items found. Try a clearer, well-lit photo of a printed menu."
        );
        setScanning(false);
        return;
      }
      setRows(
        items.map((it, i) => ({
          ...it,
          id: `row-${i}`,
          selected: true,
        }))
      );
      setStep("review");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "AI scan failed. Try again."));
    } finally {
      setScanning(false);
    }
  };

  // ── Step 2: Row editing helpers ────────────────────────────────────────────

  const updateRow = (id: string, field: keyof ScannedItem, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const toggleRow = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const selectedCount = rows.filter((r) => r.selected).length;

  // ── Step 3: Import ─────────────────────────────────────────────────────────

  const handleImport = async () => {
    if (!industryId) {
      toast.error("Set your industry on the Menu Items page before importing.");
      return;
    }
    if (!bulkCategory || !bulkType) {
      toast.error("Please select a Category and Type before importing.");
      return;
    }
    const toImport = rows.filter((r) => r.selected);
    if (toImport.length === 0) {
      toast.error("No items selected for import.");
      return;
    }

    setStep("importing");
    let saved = 0;
    let failed = 0;

    for (let i = 0; i < toImport.length; i++) {
      const row = toImport[i];
      try {
        const formData = new FormData();
        formData.append("item", row.item);
        formData.append("price", row.price);
        formData.append("description", row.description);
        formData.append("category", bulkCategory);
        formData.append("type", bulkType);
        formData.append("availability", "true");
        formData.append("availabilityTime", "All Day");
        formData.append("popular", "false");
        await menuService.createMenu(formData);
        saved++;
      } catch {
        failed++;
      }
      setProgress(Math.round(((i + 1) / toImport.length) * 100));
    }

    setResult({ saved, failed });
    setStep("done");
    if (saved > 0) onImported();
  };

  // ─────────────────────────────────────────────────────────────────────────

  const stepDescription =
    step === "upload"
      ? "Upload a photo of your menu and we'll pull out the items for you."
      : step === "review"
        ? `${rows.length} item${rows.length !== 1 ? "s" : ""} found. Check them, then import.`
        : step === "importing"
          ? "Saving items to your menu…"
          : "Import complete.";

  const footer =
    step === "upload" ? (
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          {selectedFile ? "Change photo" : "Choose photo"}
        </Button>
        <Button
          type="button"
          disabled={!selectedFile || scanning}
          loading={scanning}
          onClick={handleScan}
        >
          {scanning ? "Scanning…" : "Scan with AI"}
        </Button>
      </ModalFooter>
    ) : step === "review" ? (
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={() => setStep("upload")}>
          Back
        </Button>
        <Button
          type="button"
          disabled={selectedCount === 0 || !industryId || !bulkCategory || !bulkType}
          onClick={handleImport}
        >
          Import {selectedCount} item{selectedCount !== 1 ? "s" : ""}
        </Button>
      </ModalFooter>
    ) : step === "done" ? (
      <ModalFooter>
        <Button type="button" onClick={handleClose}>
          Done
        </Button>
      </ModalFooter>
    ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Scan a menu with AI"
      maxWidth="max-w-2xl"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-body text-muted-foreground" aria-live="polite">
          {stepDescription}
        </p>

        {/* Step 1 — Upload */}
        {step === "upload" && (
          <>
            <div
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) acceptFile(file);
              }}
            >
              {previewUrl ? (
                <div className="relative h-56 w-full overflow-hidden rounded-md">
                  <Image
                    src={previewUrl}
                    alt="Menu preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <PiXBold className="size-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <>
                  <PiUploadSimpleBold className="size-8 text-muted-foreground" aria-hidden />
                  <div className="text-center">
                    <p className="text-body-medium text-foreground">Drop your menu photo here</p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      Or choose a photo below. JPEG, PNG, WEBP or HEIC, up to 10 MB.
                    </p>
                  </div>
                </>
              )}

              <label htmlFor="menu-scan-file" className="sr-only">
                Menu photo
              </label>
              <input
                id="menu-scan-file"
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) acceptFile(file);
                }}
              />
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-4">
              <p className="mb-2 text-body-medium text-foreground">Tips for best results</p>
              <ul className="list-disc space-y-1 pl-6 text-caption text-muted-foreground">
                <li>Use a clear, well-lit photo without shadows or glare.</li>
                <li>Include the full menu page in the frame.</li>
                <li>Works best with printed menus.</li>
                <li>You can review and edit every item before importing.</li>
              </ul>
            </div>
          </>
        )}

        {/* Step 2 — Review */}
        {step === "review" && (
          <>
            {!industryId && (
              <Notice tone="warning" title="No industry set yet">
                <Link href={routes.admin.listMenu} className="font-medium underline underline-offset-2">
                  Set it on the Menu Items page
                </Link>{" "}
                to enable categories and types.
              </Notice>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category" htmlFor="scan-category" required>
                <Select
                  id="scan-category"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  disabled={!industryId}
                >
                  <option value="">{!industryId ? "Set industry first" : "Select category"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Type" htmlFor="scan-type" required>
                <Select
                  id="scan-type"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value)}
                  disabled={!industryId}
                >
                  <option value="">{!industryId ? "Set industry first" : "Select type"}</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <p className="text-caption text-muted-foreground">
              {selectedCount} of {rows.length} selected
            </p>

            <ul className="flex flex-col gap-2">
              {rows.map((row, index) => {
                const label = row.item || `item ${index + 1}`;
                return (
                  <li
                    key={row.id}
                    className={cn(
                      "rounded-md border p-3 transition-colors",
                      row.selected ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <input
                        id={`${row.id}-selected`}
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Include ${label}`}
                        className="size-4 shrink-0 accent-primary"
                      />
                      <label htmlFor={`${row.id}-item`} className="sr-only">
                        Item name
                      </label>
                      <Input
                        id={`${row.id}-item`}
                        value={row.item}
                        onChange={(e) => updateRow(row.id, "item", e.target.value)}
                        placeholder="Item name"
                        className="flex-1"
                        disabled={!row.selected}
                      />
                      <label htmlFor={`${row.id}-price`} className="sr-only">
                        Price for {label}
                      </label>
                      <Input
                        id={`${row.id}-price`}
                        value={row.price}
                        onChange={(e) => updateRow(row.id, "price", e.target.value)}
                        placeholder="0.00"
                        inputMode="decimal"
                        className="w-24 shrink-0 text-right tabular-nums"
                        fullWidth={false}
                        disabled={!row.selected}
                      />
                      <button
                        type="button"
                        onClick={() => deleteRow(row.id)}
                        aria-label={`Remove ${label}`}
                        className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <PiTrashBold className="size-4" aria-hidden />
                      </button>
                    </div>

                    <label htmlFor={`${row.id}-description`} className="sr-only">
                      Description for {label}
                    </label>
                    <Textarea
                      id={`${row.id}-description`}
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      placeholder="Description"
                      rows={2}
                      disabled={!row.selected}
                      className="min-h-0 resize-none"
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Step 3 — Importing */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <PiSpinnerGapBold className="size-8 animate-spin text-primary" aria-hidden />
            <p className="text-body text-muted-foreground">{progress}% complete</p>
            <div
              role="progressbar"
              aria-label="Import progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === "done" && result && (
          <Notice
            tone={result.failed === 0 ? "success" : "warning"}
            title={`${result.saved} item${result.saved !== 1 ? "s" : ""} imported`}
          >
            {result.failed > 0
              ? `${result.failed} item${result.failed !== 1 ? "s" : ""} couldn't be saved. Your menu has been updated with the rest.`
              : "Your menu has been updated."}
          </Notice>
        )}
      </div>
    </Modal>
  );
}
