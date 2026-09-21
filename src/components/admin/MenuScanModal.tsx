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
  PiScanBold,
  PiUploadSimpleBold,
  PiSpinnerGapBold,
  PiCheckCircleFill,
  PiWarningCircleBold,
  PiTrashBold,
  PiMagicWandBold,
  PiXBold,
  PiArrowLeftBold,
} from "react-icons/pi";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
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

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative mx-4 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <PiMagicWandBold size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                AI Menu Scanner
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {step === "upload" && "Upload a menu photo to extract items automatically"}
                {step === "review" && `${rows.length} items found — review and import`}
                {step === "importing" && "Saving items to your menu…"}
                {step === "done" && "Import complete"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PiXBold size={14} />
          </button>
        </div>

        {/* Step 1 — Upload */}
        {step === "upload" && (
          <div className="flex flex-col gap-4 overflow-y-auto p-6">
            {/* Drop zone */}
            <div
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/3"
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
                <div className="relative h-56 w-full overflow-hidden rounded-lg">
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
                    className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-destructive/90 text-white"
                  >
                    <PiXBold size={11} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <PiUploadSimpleBold size={26} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Drop your menu photo here
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      or click below to browse · JPEG, PNG, WEBP, HEIC · max 10MB
                    </p>
                  </div>
                </>
              )}

              <input
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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? "Change Photo" : "Browse Photo"}
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex-1 gap-2"
                disabled={!selectedFile || scanning}
                loading={scanning}
                onClick={handleScan}
              >
                {!scanning && <PiScanBold size={15} />}
                {scanning ? "Scanning…" : "Scan with AI"}
              </Button>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Tips for best results
              </p>
              <ul className="space-y-1.5">
                {[
                  "Use a clear, well-lit photo — avoid shadows and glare",
                  "Include the full menu page in the frame",
                  "Works best with printed/physical menus",
                  "You can review and edit every item before importing",
                ].map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[11px] text-muted-foreground"
                  >
                    <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === "review" && (
          <div className="flex flex-col overflow-hidden">
            {/* No industry set — everything below is unusable until it is */}
            {!industryId && (
              <div className="mx-6 mt-4 flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-[11px] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <PiWarningCircleBold size={15} className="mt-0.5 shrink-0" />
                <span>
                  No industry set yet.{" "}
                  <Link href="/admin/listmenu" className="font-semibold underline underline-offset-2">
                    Set it on the Menu Items page
                  </Link>{" "}
                  to enable categories &amp; types.
                </span>
              </div>
            )}

            {/* Bulk selectors */}
            <div className="flex flex-wrap items-end gap-3 border-b border-border px-6 py-4">
              <div className="min-w-[9rem] flex-1">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Category <span className="text-destructive">*</span>
                </label>
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
              </div>
              <div className="min-w-[9rem] flex-1">
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Type <span className="text-destructive">*</span>
                </label>
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
              </div>
              <p className="shrink-0 pb-1 text-xs text-muted-foreground">
                {selectedCount}/{rows.length} selected
              </p>
            </div>

            {/* Item rows */}
            <div className="flex-1 overflow-y-auto px-6 py-3" style={{ maxHeight: "42vh" }}>
              <div className="flex flex-col gap-2">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      "rounded-xl border p-3 transition-all",
                      row.selected
                        ? "border-primary/20 bg-primary/3"
                        : "border-border bg-muted/30 opacity-50"
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleRow(row.id)}
                        className="shrink-0"
                        aria-label={row.selected ? "Deselect item" : "Select item"}
                      >
                        <PiCheckCircleFill
                          size={18}
                          className={row.selected ? "text-primary" : "text-muted-foreground/40"}
                        />
                      </button>

                      {/* Name + Price inline */}
                      <Input
                        value={row.item}
                        onChange={(e) => updateRow(row.id, "item", e.target.value)}
                        placeholder="Item name"
                        className="flex-1 h-7 text-xs font-semibold"
                        disabled={!row.selected}
                      />
                      <div className="w-24">
                        <Input
                          value={row.price}
                          onChange={(e) => updateRow(row.id, "price", e.target.value)}
                          placeholder="0.00"
                          className="h-7 text-xs text-right font-mono"
                          disabled={!row.selected}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteRow(row.id)}
                        className="flex size-6 shrink-0 items-center justify-center rounded-lg text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <PiTrashBold size={12} />
                      </button>
                    </div>

                    {/* Description */}
                    <textarea
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      placeholder="Description"
                      rows={2}
                      disabled={!row.selected}
                      className="w-full resize-none rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-muted-foreground outline-none focus:border-primary focus:ring-0 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setStep("upload")}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <PiArrowLeftBold size={12} />
                Back
              </button>
              <Button
                type="button"
                size="sm"
                disabled={selectedCount === 0 || !industryId || !bulkCategory || !bulkType}
                onClick={handleImport}
              >
                Import {selectedCount} Item{selectedCount !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Importing */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center gap-6 p-10">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <PiSpinnerGapBold
                size={32}
                className="animate-spin text-primary"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Saving items to your menu…
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {progress}% complete
              </p>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === "done" && result && (
          <div className="flex flex-col items-center justify-center gap-6 p-10">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl",
                result.failed === 0 ? "bg-emerald-100 dark:bg-emerald-950" : "bg-amber-100 dark:bg-amber-950"
              )}
            >
              {result.failed === 0 ? (
                <PiCheckCircleFill size={32} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <PiWarningCircleBold size={32} className="text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">
                {result.saved} item{result.saved !== 1 ? "s" : ""} imported successfully
              </p>
              {result.failed > 0 && (
                <p className="mt-0.5 text-xs text-destructive">
                  {result.failed} item{result.failed !== 1 ? "s" : ""} failed to save
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Your menu has been updated.
              </p>
            </div>
            <Button type="button" size="sm" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
