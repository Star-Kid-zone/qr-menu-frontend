import { notFound } from "next/navigation";
import { SkinLabClient } from "./SkinLabClient";

/**
 * DEVELOPMENT ONLY: every flagship skin with its palette, type, ornaments and
 * icons, plus the full icon sheet in all styles, for visual review
 * (docs/site-system/PLAN.md step 2). Always 404s in production.
 *   /skin-lab            flagship skins + icon sheet
 *   /skin-lab?family=x   the converted templates in one family as well
 */
export default async function SkinLabPage({ searchParams }: { searchParams: Promise<{ family?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { family } = await searchParams;
  return <SkinLabClient family={family ?? null} />;
}
