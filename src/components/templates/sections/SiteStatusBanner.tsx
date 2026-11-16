import { activeSiteStatus } from "./document";
import { siteToday } from "@/components/site-system/kit/look";
import type { SiteStatusMode } from "./types";

const DEFAULT_LINES: Record<Exclude<SiteStatusMode, "open">, string> = {
  "closed-today": "We're closed today.",
  "temporarily-closed": "We're temporarily closed.",
  holiday: "We're closed for the holidays.",
  renovation: "We're closed for renovation.",
};

// Fixed locale + UTC so the server render and the browser produce the same text.
const REOPEN_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function reopenLabel(until: string): string {
  return `We reopen on ${REOPEN_FORMAT.format(new Date(`${until}T00:00:00Z`))}.`;
}

/**
 * Whole-site closure notice above the landing and menu pages. Renders nothing
 * when the site is open or the "reopen" date has arrived (evaluated in the
 * restaurant's time zone), so a forgotten closure clears itself.
 */
export function SiteStatusBanner({ settings }: { settings: Record<string, unknown> | null | undefined }) {
  const status = activeSiteStatus(settings?.site_document, siteToday(settings as Record<string, unknown> | undefined));
  if (!status || status.mode === "open") return null;

  return (
    <div
      role="status"
      data-site-status={status.mode}
      className="relative z-50 bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white"
    >
      <span>{status.message || DEFAULT_LINES[status.mode]}</span>
      {status.until ? <span className="ml-1 text-white/80">{reopenLabel(status.until)}</span> : null}
    </div>
  );
}
