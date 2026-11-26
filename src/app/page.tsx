import { MarketingLandingPage } from "@/features/marketing";

/**
 * The platform's own marketing page on the apex / app host. Static: restaurant hosts never reach
 * this route — the proxy rewrites their `/` to the tenant-site route.
 */
export default function LandingPage() {
  return <MarketingLandingPage />;
}
