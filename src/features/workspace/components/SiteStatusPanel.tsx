"use client";

import React from "react";
import { FormField, Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { SITE_STATUS_MODES } from "@/constants/site.constants";
import type { SiteDocument, SiteStatus, SiteStatusMode } from "@/components/templates/sections/types";

const MODES: readonly { mode: SiteStatusMode; label: string; description: string; defaultLine: string }[] = SITE_STATUS_MODES;

export interface SiteStatusPanelProps {
  formId: string;
  value: SiteDocument | null;
  disabled: boolean;
  onChange: (doc: SiteDocument | null) => void;
}

/**
 * Open / closed notice shown at the top of the landing and menu pages.
 * Stored as `site_document.status`; "Open" removes it.
 */
export function SiteStatusPanel({ formId, value, disabled, onChange }: SiteStatusPanelProps) {
  const status: SiteStatus = value?.status ?? { mode: "open" };
  const current = MODES.find((m) => m.mode === status.mode) ?? MODES[0];

  const write = (next: SiteStatus) => {
    const base: SiteDocument = { ...(value ?? {}), version: 1 };
    if (next.mode === "open") {
      delete base.status;
      onChange(base.landing || base.menu ? base : null);
      return;
    }
    const clean: SiteStatus = {
      mode: next.mode,
      ...(next.message?.trim() ? { message: next.message } : {}),
      ...(next.until ? { until: next.until } : {}),
    };
    onChange({ ...base, status: clean });
  };

  return (
    <div className="space-y-4">
      <p className="text-caption text-muted-foreground max-w-prose">
        Tell guests when you&apos;re closed. The notice appears at the top of your landing page and menu, and disappears by
        itself on the date you reopen.
      </p>

      <div role="radiogroup" aria-label="Restaurant status" className="grid gap-2 sm:grid-cols-2">
        {MODES.map((m) => {
          const selected = m.mode === status.mode;
          return (
            <button
              key={m.mode}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => write({ ...status, mode: m.mode })}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
                selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
              )}
            >
              <span className="block text-body-medium text-foreground">{m.label}</span>
              <span className="block text-caption text-muted-foreground">{m.description}</span>
            </button>
          );
        })}
      </div>

      {status.mode !== "open" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Message (optional)" htmlFor={`${formId}-status-message`}>
            <Input
              id={`${formId}-status-message`}
              maxLength={200}
              disabled={disabled}
              placeholder={current.defaultLine}
              value={status.message ?? ""}
              onChange={(e) => write({ ...status, message: e.target.value })}
            />
          </FormField>
          <FormField label="Reopens on (optional)" htmlFor={`${formId}-status-until`}>
            <Input
              id={`${formId}-status-until`}
              type="date"
              disabled={disabled}
              value={status.until ?? ""}
              onChange={(e) => write({ ...status, until: e.target.value || undefined })}
            />
          </FormField>
        </div>
      ) : null}
    </div>
  );
}
