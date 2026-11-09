import React from 'react';
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import { getTenantPublicUrl } from "@/config/app.constants";
import { readBusinessSeo } from "@/utils/public-seo";

/** Converts a raw `HH:mm`/`H:mm AM|PM`-ish time string into schema.org's `HH:MM` 24h format. Returns null if unparsable. */
function toSchemaTime(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const s = raw.trim().toUpperCase();
  const match = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3];
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  if (hour < 0 || hour > 23) return null;
  return `${String(hour).padStart(2, '0')}:${minute}`;
}

const DAY_TO_SCHEMA_CODE: Record<string, string> = {
  monday: 'Mo', tuesday: 'Tu', wednesday: 'We', thursday: 'Th',
  friday: 'Fr', saturday: 'Sa', sunday: 'Su',
  mon: 'Mo', tue: 'Tu', wed: 'We', thu: 'Th', fri: 'Fr', sat: 'Sa', sun: 'Su',
};

/** Builds schema.org `openingHours` strings (e.g. `"Mo 09:00-21:00"`) from `businesses.availability`. */
function buildOpeningHours(availability: unknown): string[] {
  if (!Array.isArray(availability)) return [];
  const rows: string[] = [];
  for (const row of availability as Array<Record<string, unknown>>) {
    const dayRaw = typeof row?.day === 'string' ? row.day.trim().toLowerCase() : '';
    const dayCode = DAY_TO_SCHEMA_CODE[dayRaw];
    const start = toSchemaTime(row?.startTime);
    const end = toSchemaTime(row?.endTime);
    if (dayCode && start && end) {
      rows.push(`${dayCode} ${start}-${end}`);
    }
  }
  return rows;
}

export function TenantSchema({ data }: { data: RawPublicSiteData }) {
  if (!data || !data.business) return null;

  const b = data.business;
  const seo = readBusinessSeo(b, data.settings);
  const rawSlug = data.settings?.public_slug;
  const url = getTenantPublicUrl(typeof rawSlug === 'string' ? rawSlug : undefined);

  const openingHours = buildOpeningHours(b.availability);

  const telephone = (b.phone as string | undefined)?.trim();
  const streetAddress = (b.address as string | undefined)?.trim();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": seo.name,
    "url": url,
    "menu": `${url}/menu`,
  };

  // Empty values are flagged by Google's structured-data validators, so every
  // optional field is only emitted when the tenant actually filled it in.
  if (seo.logoUrl) schema.image = [seo.logoUrl];
  if (telephone) schema.telephone = telephone;
  if (seo.description) schema.description = seo.description;
  // Only `streetAddress` is populated — the underlying business record has
  // no separate city/region/postalCode/country fields to draw from; adding
  // those here would mean fabricating data that doesn't exist.
  if (streetAddress) schema.address = { "@type": "PostalAddress", streetAddress };

  if (openingHours.length > 0) schema.openingHours = openingHours;

  // JSON.stringify does not escape `<`, so a tenant-controlled field containing
  // `</script><script>...` would otherwise break out of this tag and execute.
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
