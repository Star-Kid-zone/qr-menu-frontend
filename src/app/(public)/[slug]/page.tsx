import { Metadata } from "next";
import { TenantLandingPage } from "../TenantLandingPage";
import { TenantSchema } from "@/components/seo/TenantSchema";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { getTenantPublicUrl } from "@/config/app.constants";
import { requireRawLandingBySlug } from "@/services/public-site.service";

interface LandingBusinessMeta {
  business_name?: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await requireRawLandingBySlug(slug);
  // `data.business` is `Record<string, unknown> | null` at the type level (its
  // real shape varies per business/industry); narrow to just the fields used here.
  const b = data.business as LandingBusinessMeta | null;
  const title = b?.business_name ? `${b.business_name} - ${b.tagline || 'Menu'}` : 'Digital Menu';
  const description = b?.description || b?.tagline || 'View our digital menu and order online.';

  const canonicalUrl = getTenantPublicUrl(slug);

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
      siteName: b?.business_name || 'Business',
      images: b?.logo_url ? [{ url: b.logo_url }] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: b?.logo_url ? [b.logo_url] : [],
    },
  };
}

export default async function SlugLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await requireRawLandingBySlug(slug);

  return (
    <>
      <TenantSchema data={data} />
      <FaqSchema data={data} />
      <TenantLandingPage data={data} routeSlug={slug} />
    </>
  );
}
