import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buildPublicTenantUrlServer } from "@/utils/tenantHost";

export default async function SlugLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    "localhost:3000";
  const proto =
    headerStore.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1")
      ? "http"
      : "https");
  const targetUrl = buildPublicTenantUrlServer(slug, host, proto, "/");
  redirect(targetUrl);
}
