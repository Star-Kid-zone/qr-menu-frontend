"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { menuService } from "@/services/menu.service";
import { getApiErrorMessage } from "@/utils/errors";
import { BULK_PRICE_ADJUST_PREVIEW_COUNT } from "@/constants/menu.constants";
import type { MenuItem } from "../types";
import { getItemDisplayName } from "../utils";

interface BulkPriceAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  /** Used to show exactly which prices change before anything is saved. */
  items: MenuItem[];
  onApplied: () => void;
}

const PREVIEW_COUNT = BULK_PRICE_ADJUST_PREVIEW_COUNT;

// Mirrors the API's rounding (roundTo: 2) so the preview matches what is saved.
// The API sends prices as decimal strings (e.g. "12.49"), so coerce first.
function adjust(price: number | string, mode: "percent" | "delta", amount: number) {
  const base = Number(price) || 0;
  const next = mode === "percent" ? base * (1 + amount / 100) : base + amount;
  return Math.max(0, Math.round(next * 100) / 100);
}

export function BulkPriceAdjustModal({ isOpen, onClose, categories, items, onApplied }: BulkPriceAdjustModalProps) {
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState<"percent" | "delta">("percent");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount !== 0;

  const affected = useMemo(
    () => items.filter((item) => !category || item.category === category),
    [items, category]
  );

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleApply = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      await menuService.bulkPriceAdjust({
        category: category || undefined,
        percent: mode === "percent" ? numericAmount : undefined,
        delta: mode === "delta" ? numericAmount : undefined,
        roundTo: 2,
      });
      toast.success(`${affected.length} price${affected.length === 1 ? "" : "s"} changed`);
      onApplied();
      onClose();
      setAmount("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't change the prices. Nothing was saved."));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={handleClose} disabled={submitting}>
        Cancel
      </Button>
      <Button onClick={handleApply} loading={submitting} disabled={!isValid || affected.length === 0}>
        {`Change ${affected.length} price${affected.length === 1 ? "" : "s"}`}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change prices in bulk" maxWidth="max-w-md" footer={footer}>
      <div className="space-y-4">
        <FormField label="Dishes" htmlFor="bulk-category">
          <Select id="bulk-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </FormField>

        <fieldset className="space-y-2">
          <legend className="text-body-medium text-foreground">Change by</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {(
              [
                ["percent", "Percentage"],
                ["delta", "Fixed amount"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                onClick={() => setMode(value)}
                className={`h-10 rounded-md border text-body-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  mode === value ? "border-primary bg-accent text-accent-foreground" : "border-input bg-background text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <FormField
          label={mode === "percent" ? "Percentage" : "Amount"}
          htmlFor="bulk-amount"
          hint={mode === "percent" ? "Use 10 to raise prices by 10%, or -10 to lower them." : "Use a negative number to lower prices."}
        >
          <Input id="bulk-amount" type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FormField>

        {isValid && affected.length > 0 ? (
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-body-medium text-foreground">
              {affected.length} dish{affected.length === 1 ? "" : "es"} will change, for example:
            </p>
            <ul className="mt-2 space-y-1 text-body text-muted-foreground">
              {affected.slice(0, PREVIEW_COUNT).map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="truncate">{getItemDisplayName(item)}</span>
                  <span className="shrink-0 tabular-figures">
                    {(Number(item.price) || 0).toFixed(2)} → <span className="text-foreground">{adjust(item.price, mode, numericAmount).toFixed(2)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="text-caption text-muted-foreground">
          Prices change for guests straight away. To undo, apply the opposite change.
        </p>

        {error ? <Notice tone="error">{error}</Notice> : null}
      </div>
    </Modal>
  );
}
