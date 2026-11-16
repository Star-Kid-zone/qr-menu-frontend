"use client";

import { preconnect } from "react-dom";
import type { SiteLook } from "../types";
import { googleFontsHrefs } from "./look";

/**
 * The look's Google Fonts. Connects to both font hosts early (the stylesheet
 * on googleapis, the font files on gstatic) so the stylesheets, which block
 * the first paint, arrive sooner.
 */
export function SiteFonts({ look }: { look: Pick<SiteLook, "fonts"> }) {
  const hrefs = googleFontsHrefs(look);
  if (hrefs.length === 0) return null;
  preconnect("https://fonts.googleapis.com");
  preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });
  return (
    <>
      {hrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}
    </>
  );
}
