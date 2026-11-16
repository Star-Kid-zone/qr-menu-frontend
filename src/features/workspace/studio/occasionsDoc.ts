import type { SiteDocument } from "@/components/templates/sections/types";
import type { OccasionEntry } from "@/components/site-system/types";

/**
 * Turn the site's occasion on (an entry) or off (null). Returns a new site
 * document so the form tracks the change and the preview updates; it is
 * saved with the normal Save.
 */
export function setOccasion(d: SiteDocument | null, occasion: OccasionEntry | null): SiteDocument {
  const next: SiteDocument = { ...(d ?? {}), version: 1 };
  if (occasion) next.occasion = occasion;
  else delete next.occasion;
  return next;
}
