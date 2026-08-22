"use client";

import { PiForkKnifeBold, PiQrCodeBold } from "react-icons/pi";
import { Reveal } from "../parallax/Reveal";
import { TiltCard } from "../parallax/TiltCard";

const MENU_ROWS = [
  { name: "Grilled Salmon Bowl", price: "$14.99", tint: "bg-clay-orange/30" },
  { name: "Truffle Butter Steak", price: "$28.00", tint: "bg-clay-violet/30" },
  { name: "Wild Mushroom Risotto", price: "$18.00", tint: "bg-clay-gold/30" },
  { name: "Strawberry Matcha Latte", price: "$6.50", tint: "bg-clay-coral/30" },
];

export function Showcase() {
  return (
    <section className="relative overflow-hidden bg-[#0d0906] px-5 py-24 text-white xs:px-8 sm:px-12 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">See it in action</span>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            One dashboard.
            <br />
            Every table.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            A guest-ready menu and a marketing-ready poster, generated from the
            same dish photos and prices you already have. Move your cursor over
            the card — everything here really does tilt in 3D.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto w-full max-w-sm">
          <TiltCard strength={12}>
            <div className="w-full rounded-[2rem] border border-white/10 bg-[#1a140f] p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <PiForkKnifeBold size={16} />
                </span>
                <span className="font-display text-xs font-semibold uppercase tracking-widest text-white/50">Today&apos;s Menu</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                  <PiQrCodeBold size={16} />
                </span>
              </div>
              <div className="space-y-2">
                {MENU_ROWS.map((row) => (
                  <div key={row.name} className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
                    <span className={`h-10 w-10 shrink-0 rounded-lg ${row.tint}`} />
                    <span className="flex-1 truncate text-caption font-semibold text-white">{row.name}</span>
                    <span className="text-caption font-bold text-primary">{row.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
