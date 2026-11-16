import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRawLandingWithMenuBySlug, resolveMenuFromRequestHost } from "@/services/public-site.service";
import { getTenantCanonicalUrl } from "@/config/app.constants";
import { MenuItemSchema } from "@/components/seo";
import { buildTenantMetadata, readBusinessSeo } from "@/utils/public-seo";
import { TenantMenuPage } from "./TenantMenuPage";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await resolveMenuFromRequestHost();
  if (!payload) return {};

  const business = readBusinessSeo(payload.mapped.business, payload.mapped.settings);

  return buildTenantMetadata({
    title: `Menu — ${business.name}`,
    description: business.description || `View the digital menu for ${business.name} and order online.`,
    canonicalUrl: `${getTenantCanonicalUrl(payload.mapped.settings, payload.mapped.publicSlug)}/menu`,
    siteName: business.name,
    imageUrl: business.logoUrl,
  });
}

export default async function MenuPage() {
  const payload = await resolveMenuFromRequestHost();

  if (!payload) {
    notFound();
  }

  const menuTheme = payload.mapped.menuThemeRaw || DEFAULT_TEMPLATE_SLUG;
  const rawMenuStructure = payload.mapped.settings?.menu_structure;
  const menuStructure = typeof rawMenuStructure === "string" ? rawMenuStructure : "";

  // Prices are only published as structured data when the restaurant has set a currency;
  // defaulting to a made-up one would give search engines wrong information.
  // (The mapped payload never carries the currency, so read it from the raw portal data —
  // that fetch is request-cached, so this costs no extra API call.)
  const raw = await getRawLandingWithMenuBySlug(payload.routeSlug).catch(() => null);
  const currencyCode = raw?.currency?.code;

  return (
    <>
      {currencyCode ? (
        <MenuItemSchema
          menuItems={payload.menuItems}
          businessName={readBusinessSeo(payload.mapped.business, payload.mapped.settings).name}
          url={getTenantCanonicalUrl(payload.mapped.settings, payload.mapped.publicSlug)}
          currencyCode={currencyCode}
        />
      ) : null}
      <TenantMenuPage payload={payload} menuTheme={menuTheme} menuStructure={menuStructure} />
    </>
  );
}
