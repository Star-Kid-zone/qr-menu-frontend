import { notFound } from "next/navigation";
import { LayoutLabClient } from "./LayoutLabClient";
import { getRawLandingWithMenuBySlug } from "@/services/public-site.service";

/**
 * DEVELOPMENT ONLY: renders a designed layout with realistic sample content so
 * layouts can be designed and screenshot-checked without touching any real
 * restaurant's saved settings. Always 404s in production.
 *   /layout-lab/<key>?theme=<style-slug>&palette=dark&slug=<real restaurant slug>
 */
export default async function LayoutLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ theme?: string; palette?: string; slug?: string; skin?: string; business?: string; occasion?: string; intensity?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { key } = await params;
  const { theme, palette, slug, skin, business, occasion, intensity } = await searchParams;
  // ?slug=<public slug>: render a real restaurant's saved content in this layout (dev only).
  const real = slug ? await getRawLandingWithMenuBySlug(slug).catch(() => null) : null;
  return (
    <LayoutLabClient
      layoutKey={key}
      theme={theme ?? (typeof real?.settings?.landing_theme === "string" ? real.settings.landing_theme : "swiss-international")}
      dark={palette === "dark"}
      data={real ?? undefined}
      skin={skin}
      business={business}
      occasion={occasion}
      intensity={intensity}
    />
  );
}
