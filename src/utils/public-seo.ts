import type { Metadata } from "next";
import { DESCRIPTION_MAX_LENGTH } from "@/constants/site.constants";
import type { TenantMetadataInput } from "@/types/public/publicSite.types";

export type { TenantMetadataInput };

/**
 * Metadata for a tenant's public pages: title, description, canonical URL and
 * Open Graph / Twitter cards. Shared by the tenant landing and menu pages so
 * link previews and search snippets stay consistent.
 */
export function buildTenantMetadata({ title, description, canonicalUrl, siteName, imageUrl }: TenantMetadataInput): Metadata {
  return {
    // `absolute` skips the root "%s | FeastOwl" template: the tab shows the restaurant only.
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    // A restaurant's site is its own brand: its logo is the tab icon (FeastOwl's
    // only when it has none) and it doesn't offer the FeastOwl dashboard app.
    applicationName: siteName,
    appleWebApp: { title: siteName },
    manifest: null,
    ...(imageUrl ? { icons: { icon: imageUrl, apple: imageUrl } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      images: imageUrl ? [{ url: imageUrl }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

function clip(text: string): string {
  return text.length <= DESCRIPTION_MAX_LENGTH ? text : `${text.slice(0, DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`;
}

/**
 * Reads the fields the SEO helpers need from a tenant's public data.
 *
 * The public API puts the logo and the tenant-written copy in `settings`
 * (`logo_url`, `hero_tagline`, `story_body`), while the name lives on
 * `business`, so both records are consulted.
 */
export function readBusinessSeo(
  business: Record<string, unknown> | null | undefined,
  settings?: Record<string, unknown> | null,
) {
  return {
    name: str(business?.business_name) || "Restaurant",
    description: clip(
      str(business?.description) || str(business?.tagline) || str(settings?.hero_tagline) || str(settings?.story_body),
    ),
    logoUrl: str(settings?.logo_url) || str(business?.logo_url) || undefined,
  };
}
