import { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMenuFromRequestHost } from "@/services/public-site.service";
import { getTenantPublicUrl } from "@/config/app.constants";
import { TenantMenuPage } from "./TenantMenuPage";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await resolveMenuFromRequestHost();
  if (!payload) return {};

  const b = payload.mapped.business;
  const businessName = (b?.business_name as string) || "Restaurant";
  const description = (b?.description as string) || (b?.tagline as string) || `View the digital menu for ${businessName} and order online.`;
  const logoUrl = b?.logo_url as string | undefined;
  const title = `Menu — ${businessName}`;
  const canonicalUrl = `${getTenantPublicUrl(payload.mapped.publicSlug)}/menu`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: businessName,
      images: logoUrl ? [{ url: logoUrl }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

export default async function MenuPage() {
  const payload = await resolveMenuFromRequestHost();

  if (!payload) {
    notFound();
  }

  const menuTheme = payload.mapped.menuThemeRaw ?? "swiss";
  const rawMenuStructure = payload.mapped.settings?.menu_structure;
  const menuStructure = typeof rawMenuStructure === "string" ? rawMenuStructure : "";

  return <TenantMenuPage payload={payload} menuTheme={menuTheme} menuStructure={menuStructure} />;
}
