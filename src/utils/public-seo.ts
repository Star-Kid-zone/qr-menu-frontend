import type { Metadata } from "next";

export interface TenantMetadataInput {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  imageUrl?: string | null;
}

/**
 * Metadata for a tenant's public pages: title, description, canonical URL and
 * Open Graph / Twitter cards. Shared by the tenant landing and menu pages so
 * link previews and search snippets stay consistent.
 */
export function buildTenantMetadata({ title, description, canonicalUrl, siteName, imageUrl }: TenantMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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

const DESCRIPTION_MAX = 160;

function clip(text: string): string {
  return text.length <= DESCRIPTION_MAX ? text : `${text.slice(0, DESCRIPTION_MAX - 1).trimEnd()}…`;
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
