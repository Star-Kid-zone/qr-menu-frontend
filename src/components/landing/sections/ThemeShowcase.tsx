import { HorizontalScroll } from "../parallax/HorizontalScroll";
import { Reveal } from "../parallax/Reveal";

// A real, verified sample of the 113 visual themes available for both menus
// and sites (exact labels from components/templates/landing/constants.ts) —
// not an exhaustive list, just enough to make the range obvious.
const THEMES = [
  "Swiss",
  "Neumorphism",
  "Glassmorphism",
  "Claymorphism",
  "Bauhaus",
  "Neo Brutalism",
  "Y2k Frutiger Aero",
  "Retro Futurism",
  "Dark Mode Noir",
  "Pop Art",
  "Maximalism",
  "Sci Fi Ui",
  "Editorial Magazine",
  "Luxury Minimal",
] as const;

// Every width below is in vw so the horizontal-scroll distance can be computed
// exactly (see HorizontalScroll's contentWidthVw) — mixing vw panels with px/rem
// gaps would make that math approximate and risk clipping the last panel.
const PANEL_WIDTH_VW = 26;
const TRAILING_PANEL_VW = 20;
const LEADING_SPACER_VW = 6;
const GAP_VW = 2;
const ITEM_COUNT = THEMES.length + 2; // + leading spacer + trailing "more" panel
const CONTENT_WIDTH_VW =
  LEADING_SPACER_VW + THEMES.length * PANEL_WIDTH_VW + TRAILING_PANEL_VW + (ITEM_COUNT - 1) * GAP_VW;

export function ThemeShowcase() {
  return (
    <section className="relative bg-[#0d0906] pb-24 pt-4 text-white sm:pb-32">
      <Reveal className="mx-auto mb-4 max-w-2xl px-5 text-center xs:px-8 sm:px-12">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">113 visual themes</span>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Pick a look. Any look.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
          A sample of what&apos;s on the shelf — scroll to browse the rest inside your dashboard.
        </p>
      </Reveal>

      <HorizontalScroll contentWidthVw={CONTENT_WIDTH_VW} className="items-center gap-[2vw]">
        <div style={{ width: `${LEADING_SPACER_VW}vw` }} className="shrink-0" aria-hidden="true" />

        {THEMES.map((theme, i) => (
          <div
            key={theme}
            data-cursor-hover
            style={{ width: `${PANEL_WIDTH_VW}vw` }}
            className="flex aspect-[4/5] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 transition-colors hover:border-primary/50 sm:p-8"
          >
            <span className="font-display text-xs font-semibold text-white/30">{(i + 1).toString().padStart(2, "0")}</span>
            <h3 className="font-display text-2xl font-bold uppercase leading-[0.95] tracking-tight sm:text-4xl">{theme}</h3>
          </div>
        ))}

        <div
          style={{ width: `${TRAILING_PANEL_VW}vw` }}
          className="flex aspect-[4/5] shrink-0 flex-col justify-center rounded-3xl border border-dashed border-white/15 p-6"
        >
          <p className="font-display text-lg font-semibold uppercase leading-tight text-white/40">+99 more inside</p>
        </div>
      </HorizontalScroll>
    </section>
  );
}
