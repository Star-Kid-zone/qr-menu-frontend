"use client";

import { useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { toast } from "@/components/ui/toast";
import { menuService, type MenuImportPreviewResult, type MenuImportRow } from "@/services/menu.service";
import { getApiErrorMessage } from "@/utils/errors";
import { PiUploadSimpleBold, PiWarningCircleBold } from "react-icons/pi";

interface MenuImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}

/** CSV bulk menu import: upload -> server-validated preview -> confirm commit.
 *  Expected header row (case-insensitive): item (or name), price, description,
 *  category, type, dietaryTags, allergens, spiceLevel, calories. */
export function MenuImportModal({ isOpen, onClose, onImported }: MenuImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [preview, setPreview] = useState<MenuImportPreviewResult | null>(null);

  const reset = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setPreview(null);
    try {
      const res = await menuService.importPreview(file);
      setPreview(res.data);
      if (res.data.valid.length === 0) {
        toast.error("No valid rows found in that file.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to parse CSV file."));
    } finally {
      setUploading(false);
    }
  };

  const handleCommit = async () => {
    if (!preview || preview.valid.length === 0) return;
    setCommitting(true);
    try {
      const res = await menuService.importCommit(preview.valid as MenuImportRow[]);
      toast.success(res.data.message);
      reset();
      onImported();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to import menu items."));
    } finally {
      setCommitting(false);
    }
  };

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={() => { reset(); onClose(); }} disabled={committing}>
        Cancel
      </Button>
      <Button onClick={handleCommit} loading={committing} disabled={!preview || preview.valid.length === 0}>
        Import {preview ? `${preview.valid.length} items` : ""}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }} title="Bulk Import Menu (CSV)" maxWidth="max-w-2xl" footer={footer}>
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">
          Header row (case-insensitive): <code className="rounded bg-muted px-1 py-0.5">item, price, description, category, type</code>{" "}
          — optionally <code className="rounded bg-muted px-1 py-0.5">dietaryTags, allergens, spiceLevel, calories</code>{" "}
          (dietaryTags/allergens separated by <code className="rounded bg-muted px-1 py-0.5">;</code> or <code className="rounded bg-muted px-1 py-0.5">|</code>).
        </p>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
          <PiUploadSimpleBold size={22} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">
            {uploading ? "Parsing..." : "Click to choose a .csv file"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>

        {preview && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-md bg-success/10 px-2 py-1 font-bold text-success dark:bg-success dark:text-success">
                {preview.valid.length} ready to import
              </span>
              {preview.errors.length > 0 && (
                <span className="rounded-md bg-destructive/10 px-2 py-1 font-bold text-destructive">
                  {preview.errors.length} row{preview.errors.length === 1 ? "" : "s"} skipped
                </span>
              )}
            </div>

            {preview.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                {preview.errors.map((e, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-0.5 text-caption text-destructive">
                    <PiWarningCircleBold size={12} className="mt-0.5 shrink-0" />
                    <span>Row {e.row}: {e.message}</span>
                  </div>
                ))}
              </div>
            )}

            {preview.valid.length > 0 && (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-left text-caption">
                  <thead className="sticky top-0 bg-muted/60">
                    <tr>
                      <th className="px-3 py-2 font-bold text-muted-foreground">Item</th>
                      <th className="px-3 py-2 font-bold text-muted-foreground">Category</th>
                      <th className="px-3 py-2 font-bold text-muted-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.valid.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-semibold text-foreground">{row.item}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.category}</td>
                        <td className="px-3 py-2 tabular-figures text-foreground">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
