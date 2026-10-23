"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { toast } from "@/components/ui/toast";
import { menuService } from "@/services/menu.service";
import { getApiErrorMessage } from "@/utils/errors";

interface BulkPriceAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onApplied: () => void;
}

export function BulkPriceAdjustModal({ isOpen, onClose, categories, onApplied }: BulkPriceAdjustModalProps) {
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState<"percent" | "delta">("percent");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount !== 0;

  const handleApply = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const res = await menuService.bulkPriceAdjust({
        category: category || undefined,
        percent: mode === "percent" ? numericAmount : undefined,
        delta: mode === "delta" ? numericAmount : undefined,
        roundTo: 2,
      });
      toast.success(res.data.message);
      onApplied();
      onClose();
      setAmount("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to adjust prices."));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={onClose} disabled={submitting}>
        Cancel
      </Button>
      <Button onClick={handleApply} loading={submitting} disabled={!isValid}>
        Apply to {category || "all items"}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Price Adjustment" maxWidth="max-w-md" footer={footer}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Apply to</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Adjustment type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={mode === "percent"}
              onClick={() => setMode("percent")}
              className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                mode === "percent" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"
              }`}
            >
              Percentage (%)
            </button>
            <button
              type="button"
              aria-pressed={mode === "delta"}
              onClick={() => setMode("delta")}
              className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                mode === "delta" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"
              }`}
            >
              Flat amount
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            {mode === "percent" ? "Percent change (e.g. 10 for +10%, -10 for -10%)" : "Amount to add (negative to subtract)"}
          </label>
          <Input
            type="number"
            step="any"
            placeholder={mode === "percent" ? "e.g. 10" : "e.g. 5.00"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <p className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground">
          This updates prices immediately for every matching item and cannot be undone automatically — double-check the category and amount before applying.
        </p>
      </div>
    </Modal>
  );
}
