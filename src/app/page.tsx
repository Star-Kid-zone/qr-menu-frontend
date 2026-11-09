import type { Metadata } from "next";
import { MarketingLandingPage } from "@/features/marketing";

import { resolveLandingFromRequestHost } from '@/services/public-site.service';
import { getTenantPublicUrl } from "@/config/app.constants";
import { FaqSchema, TenantSchema } from "@/components/seo";
import { buildTenantMetadata, readBusinessSeo } from "@/utils/public-seo";
import { TenantLandingPage } from './(public)/TenantLandingPage';

/** Tenant subdomains get their own title/description/canonical/OG card; the bare domain keeps the platform defaults. */
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await resolveLandingFromRequestHost();
  if (!tenant) return {};

  const business = readBusinessSeo(tenant.data.business, tenant.data.settings);
  const rawSlug = tenant.data.settings?.public_slug;
  const canonicalUrl = getTenantPublicUrl(typeof rawSlug === "string" ? rawSlug : tenant.slug);

  return buildTenantMetadata({
    title: business.name,
    description: business.description || `${business.name} — view the digital menu and visit us.`,
    canonicalUrl,
    siteName: business.name,
    imageUrl: business.logoUrl,
  });
}

export default async function LandingPage() {
  const tenant = await resolveLandingFromRequestHost();

  if (tenant) {
    return (
      <>
        <TenantSchema data={tenant.data} />
        <FaqSchema data={tenant.data} />
        <TenantLandingPage data={tenant.data} routeSlug={tenant.slug} />
      </>
    );
  }

  return <MarketingLandingPage />;
}
