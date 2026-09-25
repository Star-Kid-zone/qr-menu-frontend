import { Metadata } from "next";
import { requireMenuBySlug } from "@/services/public-site.service";
import { getTenantPublicUrl } from "@/config/app.constants";
import { TenantMenuPage } from "../../menu/TenantMenuPage";
import { MenuItemSchema } from "@/components/seo/MenuItemSchema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await requireMenuBySlug(slug);
    const b = payload.mapped.business;
    const businessName = (b?.business_name as string) || "Restaurant";
    const description =
      (b?.description as string) ||
      (b?.tagline as string) ||
      `View the digital menu for ${businessName} and order online.`;
    const logoUrl = b?.logo_url as string | undefined;
    const title = `Menu — ${businessName}`;
    const canonicalUrl = `${getTenantPublicUrl(slug)}/menu`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
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
  } catch {
    return {};
  }
}

export default async function SlugMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // requireMenuBySlug throws notFound() if the slug doesn't exist
  const payload = await requireMenuBySlug(slug);

  const menuTheme = payload.mapped.menuThemeRaw ?? "swiss";
  const rawMenuStructure = payload.mapped.settings?.menu_structure;
  const menuStructure = typeof rawMenuStructure === "string" ? rawMenuStructure : "";
  const businessName = (payload.mapped.business?.business_name as string) || "Restaurant";

  return (
    <>
      <MenuItemSchema
        menuItems={payload.menuItems}
        businessName={businessName}
        url={getTenantPublicUrl(slug)}
        currencyCode={payload.mapped.currency?.code || "USD"}
      />
      <TenantMenuPage
        payload={payload}
        menuTheme={menuTheme}
        menuStructure={menuStructure}
      />
    </>
  );
}
