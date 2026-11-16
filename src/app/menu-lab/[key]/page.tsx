import { notFound } from "next/navigation";
import { MenuLabClient } from "./MenuLabClient";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

/**
 * DEVELOPMENT ONLY: renders a menu layout with a realistic, fully-populated
 * sample menu so menu layouts can be designed and screenshot-checked without
 * touching a real restaurant's settings. Always 404s in production.
 *   /menu-lab/<key>?palette=dark      (<key> = "default" or a menu structure key)
 */
export default async function MenuLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ palette?: string; theme?: string; skin?: string; business?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { key } = await params;
  const { palette, theme, skin, business } = await searchParams;
  // ?skin=<skin id> renders with that skin's palette; ?business=pub | wine-shop swaps in a drinks / shop menu.
  return <MenuLabClient structure={key === "default" ? "" : key} dark={palette === "dark"} theme={theme ?? DEFAULT_TEMPLATE_SLUG} skin={skin} business={business} />;
}
