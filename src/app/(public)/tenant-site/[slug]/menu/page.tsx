import type { Metadata } from "next";
import { getRawLandingWithMenuBySlug, resolveMenuBySlug } from "@/services/public-site.service";
import { getTenantCanonicalUrl } from "@/config/app.constants";
import { MenuItemSchema } from "@/components/seo";
import { buildTenantMetadata, readBusinessSeo } from "@/utils/public-seo";
import { TenantMenuPage } from "@/features/public-site";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

/**
 * A restaurant's menu. Reached only through the proxy, which rewrites `/menu` on the
 * restaurant's own host here; cached (ISR) and refreshed on demand by /api/revalidate.
 */
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await resolveMenuBySlug(slug);
  const business = readBusinessSeo(payload.mapped.business, payload.mapped.settings);

  return buildTenantMetadata({
    title: `Menu — ${business.name}`,
    description: business.description || `View the digital menu for ${business.name} and order online.`,
    canonicalUrl: `${getTenantCanonicalUrl(payload.mapped.settings, payload.mapped.publicSlug)}/menu`,
    siteName: business.name,
    imageUrl: business.logoUrl,
  });
}

export default async function TenantMenuRoute({ params }: Props) {
  const { slug } = await params;
  const payload = await resolveMenuBySlug(slug);

  const menuTheme = payload.mapped.menuThemeRaw || DEFAULT_TEMPLATE_SLUG;
  const rawMenuStructure = payload.mapped.settings?.menu_structure;
  const menuStructure = typeof rawMenuStructure === "string" ? rawMenuStructure : "";

  // Prices are only published as structured data when the restaurant has set a currency;
  // defaulting to a made-up one would give search engines wrong information. (The raw portal
  // fetch is request-cached, so reading the currency here costs no extra API call.)
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
