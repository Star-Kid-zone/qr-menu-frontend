import type { Metadata } from "next";
import { resolveLandingBySlug } from "@/services/public-site.service";
import { getTenantCanonicalUrl } from "@/config/app.constants";
import { FaqSchema, TenantSchema } from "@/components/seo";
import { buildTenantMetadata, readBusinessSeo } from "@/utils/public-seo";
import { TenantLandingPage, toLandingData } from "@/features/public-site";

/**
 * A restaurant's landing page. Reached only through the proxy, which rewrites `/` on the
 * restaurant's own host (subdomain or verified custom domain) here. The slug comes from the URL,
 * not request headers, so the page is cached (ISR) and refreshed on demand by /api/revalidate.
 */
export const revalidate = 60;

/** Rendered on first request, then cached; no restaurant is pre-built at build time. */
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await resolveLandingBySlug(slug);
  const business = readBusinessSeo(tenant.data.business, tenant.data.settings);

  return buildTenantMetadata({
    title: business.name,
    description: business.description || `${business.name} — view the digital menu and visit us.`,
    canonicalUrl: getTenantCanonicalUrl(tenant.data.settings, tenant.slug),
    siteName: business.name,
    imageUrl: business.logoUrl,
  });
}

export default async function TenantLandingRoute({ params }: Props) {
  const { slug } = await params;
  const tenant = await resolveLandingBySlug(slug);

  return (
    <>
      <TenantSchema data={tenant.data} />
      <FaqSchema data={tenant.data} />
      {/* Only the dishes the landing sections show are sent to the browser, not the whole menu. */}
      <TenantLandingPage data={toLandingData(tenant.data)} routeSlug={tenant.slug} />
    </>
  );
}
