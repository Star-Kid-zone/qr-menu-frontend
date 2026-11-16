"use client";

import React from "react";
import { PiCheckCircleBold, PiWarningBold, PiWarningCircleBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { contrastRatio, readability, type Readability } from "@/utils/contrast";

type Values = Record<string, unknown>;
const v = (values: Values, k: string, fallback: string) =>
  typeof values[k] === "string" && values[k] ? (values[k] as string) : fallback;

/** Which page the colours belong to: the landing page and the menu page have separate colour sets. */
export type ColourPage = "landing" | "menu";

/** Form field for each colour role, per page. */
const FIELDS: Record<ColourPage, Record<string, string>> = {
  landing: {
    top: "accent_color", // page background (hero area)
    middle: "section_bg_color", // section bands
    footer: "footer_bg_color",
    card: "secondary_color",
    border: "border_color",
    text: "text_primary_color",
    muted: "text_secondary_color",
    accent: "primary_color",
    onAccent: "accent_text_color",
    font: "font_family",
    cardStyle: "card_style",
  },
  menu: {
    top: "menu_secondary_color", // header & category bars
    middle: "menu_accent_color", // page background behind the dishes
    footer: "menu_footer_bg_color",
    card: "menu_section_bg_color",
    border: "menu_border_color",
    text: "menu_text_primary_color",
    muted: "menu_text_secondary_color",
    accent: "menu_primary_color",
    onAccent: "menu_accent_text_color",
    font: "menu_font_family",
    cardStyle: "menu_card_style",
  },
};

function palette(values: Values, page: ColourPage) {
  const f = FIELDS[page];
  const middle = v(values, f.middle, "#ffffff");
  return {
    top: v(values, f.top, middle),
    middle,
    footer: v(values, f.footer, middle),
    card: v(values, f.card, "#ffffff"),
    border: v(values, f.border, "#e5e5e5"),
    text: v(values, f.text, "#111111"),
    muted: v(values, f.muted, "#555555"),
    accent: v(values, f.accent, "#333333"),
    onAccent: v(values, f.onAccent, "#ffffff"),
    font: v(values, f.font, "inherit"),
    cardStyle: v(values, f.cardStyle, "rounded-md"),
  };
}

/** Which area of the mini-page a part edits (for the outline). */
type Area = "top" | "middle" | "footer" | "card" | "button" | "text";

/** Part ids of both studios → the areas they change. */
const PART_AREAS: Record<string, Area[]> = {
  // landing
  page: ["top", "middle", "footer"],
  cards: ["card"],
  // menu
  header: ["top"],
  card: ["card"],
  // both
  text: ["text"],
  accent: ["button"],
};

/** The text/background pairs that matter for each part, in the owner's words. */
export function readabilityChecks(part: string, values: Values, page: ColourPage = "landing"): { label: string; fg: string; bg: string }[] {
  const p = palette(values, page);
  const menu = page === "menu";
  const top = menu ? "Text on the header bar" : "Text on the page";
  const middle = menu ? "Text on the page" : "Text on section bands";
  switch (part) {
    case "page":
      return menu
        ? [
            { label: middle, fg: p.text, bg: p.middle },
            { label: "Text in the footer", fg: p.text, bg: p.footer },
          ]
        : [
            { label: top, fg: p.text, bg: p.top },
            { label: "Supporting text on the page", fg: p.muted, bg: p.top },
            { label: middle, fg: p.text, bg: p.middle },
            { label: "Text in the footer", fg: p.text, bg: p.footer },
          ];
    case "header":
      return [
        { label: top, fg: p.text, bg: p.top },
        { label: "Supporting text on the header bar", fg: p.muted, bg: p.top },
      ];
    case "cards":
    case "card":
      return [
        { label: menu ? "Dish names on cards" : "Text on cards", fg: p.text, bg: p.card },
        { label: menu ? "Descriptions on cards" : "Supporting text on cards", fg: p.muted, bg: p.card },
        ...(menu ? [{ label: "Prices on cards", fg: p.accent, bg: p.card }] : []),
      ];
    case "text":
      return [
        { label: menu ? "Dish names" : "Headings on the page", fg: p.text, bg: menu ? p.card : p.top },
        { label: menu ? "Descriptions" : "Supporting text on the page", fg: p.muted, bg: menu ? p.card : p.top },
        { label: menu ? "Text on the header bar" : "Text on cards", fg: p.text, bg: menu ? p.top : p.card },
      ];
    case "accent":
      return [
        { label: menu ? "Pay bill button label" : "Button labels", fg: p.onAccent, bg: p.accent },
        { label: menu ? "Prices on cards" : "Highlights and links on the page", fg: p.accent, bg: menu ? p.card : p.top },
      ];
    default:
      return [];
  }
}

const VERDICT: Record<Readability, { text: string; icon: React.ReactNode; cls: string }> = {
  good: { text: "Easy to read", icon: <PiCheckCircleBold className="size-4" aria-hidden />, cls: "text-success" },
  "large-only": { text: "OK for big text only", icon: <PiWarningBold className="size-4" aria-hidden />, cls: "text-warning-foreground" },
  poor: { text: "Hard to read", icon: <PiWarningCircleBold className="size-4" aria-hidden />, cls: "text-destructive" },
};

const RANK: Record<Readability, number> = { good: 0, "large-only": 1, poor: 2 };

/**
 * A small live picture of the page (landing or menu) in the owner's current
 * colours, with the area being edited outlined, plus plain-language
 * readability checks for the text that sits on those colours (WCAG AA).
 */
export function ColourPartPreview({ part, values, page = "landing" }: { part: string; values: Values; page?: ColourPage }) {
  const p = palette(values, page);
  const areas = PART_AREAS[part] ?? [];
  const ring = (area: Area) => (areas.includes(area) ? "outline outline-2 outline-offset-[-2px] outline-primary" : "");
  const menu = page === "menu";

  const checks = readabilityChecks(part, values, page)
    .map((c) => ({ ...c, ratio: contrastRatio(c.fg, c.bg) }))
    .filter((c): c is typeof c & { ratio: number } => c.ratio !== null);
  const worst = checks.reduce<Readability>((w, c) => {
    const r = readability(c.ratio);
    return RANK[r] > RANK[w] ? r : w;
  }, "good");

  const button = (
    <span
      className={cn("inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold", ring("button"))}
      style={{ background: p.accent, color: p.onAccent }}
    >
      {menu ? "Pay bill" : "View menu"}
    </span>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <figure className={cn("overflow-hidden rounded-lg border border-border", ring("text"))} style={{ fontFamily: p.font }}>
        <div className={cn("space-y-1 p-3", ring("top"))} style={{ background: p.top }}>
          <p className="text-sm font-semibold" style={{ color: p.text }}>
            Your restaurant
          </p>
          {menu ? (
            <p className="rounded-full border px-2 py-0.5 text-[10px]" style={{ color: p.muted, borderColor: p.border }}>
              Search menu…
            </p>
          ) : (
            <>
              <p className="text-[11px]" style={{ color: p.muted }}>
                Fresh food, made with care
              </p>
              <div className="pt-1">{button}</div>
            </>
          )}
        </div>
        <div className={cn("p-3", ring("middle"))} style={{ background: p.middle }}>
          {/* Uses the chosen card shape (corners/shadow) so the shape picker shows here too. */}
          <div className={cn("border p-2", p.cardStyle, ring("card"))} style={{ background: p.card, borderColor: p.border }}>
            <p className="flex justify-between gap-2 text-[11px] font-semibold" style={{ color: p.text }}>
              <span>Signature dish</span>
              <span style={{ color: p.accent }}>₹420</span>
            </p>
            <p className="text-[10px]" style={{ color: p.muted }}>
              A short description
            </p>
          </div>
          {menu ? <div className="pt-2 text-center">{button}</div> : null}
        </div>
        <div className={cn("px-3 py-2", ring("footer"))} style={{ background: p.footer }}>
          <p className="text-[10px]" style={{ color: p.text }}>
            Footer · opening hours · contact
          </p>
        </div>
        <figcaption className="border-t border-border bg-card px-3 py-1.5 text-caption text-muted-foreground">
          Live preview · outlined: what you&apos;re changing
        </figcaption>
      </figure>

      {checks.length ? (
        <div className="space-y-1.5" aria-live="polite">
          <p className={cn("flex items-center gap-1.5 text-body-medium", VERDICT[worst].cls)}>
            {VERDICT[worst].icon}
            {worst === "good" ? "All text is easy to read" : worst === "large-only" ? "Some text is hard to read when small" : "Some text is hard to read"}
          </p>
          <ul className="space-y-1">
            {checks.map((c) => {
              const r = readability(c.ratio);
              return (
                <li key={c.label} className="flex items-center justify-between gap-2 text-caption">
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span
                      aria-hidden
                      className="inline-flex size-5 shrink-0 items-center justify-center rounded border border-border text-[10px] font-bold"
                      style={{ background: c.bg, color: c.fg }}
                    >
                      Aa
                    </span>
                    <span className="truncate">{c.label}</span>
                  </span>
                  <span className={cn("flex shrink-0 items-center gap-1", VERDICT[r].cls)}>
                    {VERDICT[r].icon}
                    {VERDICT[r].text}
                  </span>
                </li>
              );
            })}
          </ul>
          {worst !== "good" ? (
            <p className="text-caption text-muted-foreground">
              Tip: choose a darker text colour on light backgrounds, or a lighter one on dark backgrounds.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
