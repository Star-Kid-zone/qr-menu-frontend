import { PiCheckBold } from "react-icons/pi";
import { Reveal } from "../parallax/Reveal";
import { buttonVariants } from "@/components/ui/button";

const INCLUDED = [
  "Unlimited menu items & categories",
  "10 menu layouts × 113 visual themes",
  "10 site layouts × 113 visual themes",
  "Custom-styled QR codes with logo embedding",
  "14 poster templates for the marketing studio",
  "Google reviews sync",
  "Guest loyalty & rewards",
  "Full analytics dashboard with CSV export",
];

export function Pricing() {
  return (
    <section className="relative bg-[#0d0906] px-5 py-24 text-white xs:px-8 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Pricing</span>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Simple, fair pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            Plans and pricing are being finalized ahead of launch. Everything below is included from day one — no
            feature paywalls, no per-table fees.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <PiCheckBold className="shrink-0 text-primary" size={16} />
              <span className="text-caption font-medium text-white/80">{item}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.25} className="mt-12 text-center">
          <a href="#waitlist" data-cursor-hover className={buttonVariants({ size: "lg" })}>
            Get early-access pricing
          </a>
        </Reveal>
      </div>
    </section>
  );
}
