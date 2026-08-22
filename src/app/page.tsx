import { MarketingLandingPage } from "@/components/landing/MarketingLandingPage";

import { resolveLandingFromRequestHost } from '@/services/public-site.service';
import { TenantLandingPage } from './(public)/TenantLandingPage';

export default async function LandingPage() {
  const tenant = await resolveLandingFromRequestHost();

  if (tenant) {
    return <TenantLandingPage data={tenant.data} routeSlug={tenant.slug} />;
  }

  return <MarketingLandingPage />;
}
