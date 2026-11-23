"use client";

import { useMemo, useState } from "react";
import { Button, FormField, Select, toast } from "@/components/ui";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { MODERN_TIMEZONE_NAMES } from "@/constants/app.constants";

const MODERN_ZONE_NAMES: Readonly<Record<string, string>> = MODERN_TIMEZONE_NAMES;

export const modernZone = (zone: string): string => MODERN_ZONE_NAMES[zone] ?? zone;

/** Every IANA zone the browser knows (modern names), with the current one guaranteed to be in the list. */
function zoneOptions(current: string): string[] {
  let zones: string[] = [];
  try {
    zones = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    zones = [];
  }
  const set = new Set(["UTC", ...zones.map(modernZone)]);
  if (current) set.add(current);
  return Array.from(set).sort((a, b) => (a === "UTC" ? -1 : b === "UTC" ? 1 : a.localeCompare(b)));
}

function deviceZone(): string {
  try {
    return modernZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  } catch {
    return "UTC";
  }
}

/**
 * The restaurant's time zone. Section schedules on the website and the
 * "reopens on" date of a closure notice change over at midnight in this zone.
 */
export function TimeZoneCard({ value, onSaved }: { value: string; onSaved: () => void | Promise<void> }) {
  const saved = modernZone(value || "UTC");
  const [zone, setZone] = useState(saved);
  const [saving, setSaving] = useState(false);
  const options = useMemo(() => zoneOptions(zone), [zone]);
  const device = deviceZone();
  const dirty = zone !== saved;

  const save = async () => {
    setSaving(true);
    try {
      await workspaceService.updateWorkspace({ timezone: zone });
      toast.success("Time zone saved.");
      await onSaved();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save the time zone."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="timezone-heading" className="rounded-lg border border-border bg-card p-4 md:p-6">
      <h2 id="timezone-heading" className="text-h3 text-foreground">
        Time zone
      </h2>
      <p className="mt-1 max-w-prose text-caption text-muted-foreground">
        Website sections you schedule, and the &ldquo;reopens on&rdquo; date of a closure notice, switch over at midnight in this time zone.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <FormField label="Restaurant time zone" htmlFor="restaurant-timezone" className="sm:w-80">
          <Select
            id="restaurant-timezone"
            className="h-9 text-sm"
            value={zone}
            disabled={saving}
            onChange={(e) => setZone(e.target.value)}
          >
            {options.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </FormField>
        <div className="flex gap-2">
          {device !== zone ? (
            <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => setZone(device)}>
              Use {device.replace(/_/g, " ")}
            </Button>
          ) : null}
          <Button type="button" size="sm" disabled={!dirty} loading={saving} onClick={() => void save()}>
            Save
          </Button>
        </div>
      </div>
    </section>
  );
}
