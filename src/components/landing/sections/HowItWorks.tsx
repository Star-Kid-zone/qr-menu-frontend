import { Marquee } from "../parallax/Marquee";
import { Reveal } from "../parallax/Reveal";

const STEPS = [
  {
    index: "01",
    title: "Build your menu",
    description: "Add dishes, prices, and photos in minutes. Organize by category, mark specials, pick a layout.",
  },
  {
    index: "02",
    title: "Get your QR",
    description: "A custom-styled code, ready to print on table cards, doors, receipts — anywhere guests look.",
  },
  {
    index: "03",
    title: "Guests scan & explore",
    description: "A fast, beautiful menu on any phone. No app. Update anytime, every table sees it instantly.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#0d0906] py-16 text-white sm:py-24">
      <Marquee text="Scan · Order · Repeat" className="text-primary/70" durationS={22} />

      <div className="mx-auto mt-20 max-w-6xl px-5 xs:px-8 sm:px-12">
        <Reveal className="mb-16 sm:mb-20">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">How it works</span>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Live in three steps
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => (
            <Reveal key={step.index} delay={index * 0.1} className="border-t border-white/15 pt-6">
              <span className="font-display text-6xl font-bold text-white/15">{step.index}</span>
              <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-white">{step.title}</h3>
              <p className="mt-3 max-w-xs text-body leading-relaxed text-white/60">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
