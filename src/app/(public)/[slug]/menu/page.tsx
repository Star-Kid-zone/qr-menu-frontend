import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buildPublicTenantUrlServer } from "@/utils/tenantHost";
import { requireMenuBySlug } from "@/services/public-site.service";
import { TenantMenuPage } from "../../menu/TenantMenuPage";

export default async function SlugMenuPage({
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

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    // Unknown address: follow a redirect rule if there is one, otherwise the friendly not-found page.
    const payload = await requireMenuBySlug(slug);
    const menuTheme = payload.mapped.menuThemeRaw ?? "swiss";
    const rawMenuStructure = payload.mapped.settings?.menu_structure;
    const menuStructure = typeof rawMenuStructure === "string" ? rawMenuStructure : "";
    return <TenantMenuPage payload={payload} menuTheme={menuTheme} menuStructure={menuStructure} />;
  }

  const proto =
    headerStore.get("x-forwarded-proto") || "https";
  const targetUrl = buildPublicTenantUrlServer(slug, host, proto, "/menu");
  redirect(targetUrl);
}
