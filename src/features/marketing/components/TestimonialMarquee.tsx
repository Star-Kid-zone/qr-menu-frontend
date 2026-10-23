"use client";

import React from "react";
import { LuStar, LuQuote } from "react-icons/lu";

const REVIEWS = [
  {
    name: "Chef Marco Valenti",
    role: "Owner & Executive Chef",
    restaurant: "Osteria Del Porto",
    city: "San Francisco",
    stars: 5,
    quote:
      "We eliminated 15 minutes of card machine running per table. Our Friday night turn counts increased by 22% on week one.",
  },
  {
    name: "Elena Rostova",
    role: "General Manager",
    restaurant: "Velvet & Vine Bistro",
    city: "New York",
    stars: 5,
    quote:
      "The live theme customization is jaw-dropping. Our guests constantly compliment how elegant our mobile menu looks.",
  },
  {
    name: "Samir Patel",
    role: "Founder",
    restaurant: "Spice Symphony",
    city: "London",
    stars: 5,
    quote:
      "Updating 86'd items takes 5 seconds from my phone. No more awkward moments where servers have to apologize for sold-out dishes.",
  },
  {
    name: "Chloe Dupont",
    role: "Operations Director",
    restaurant: "Café Lumière",
    city: "Paris",
    stars: 5,
    quote:
      "Our Google review rating jumped from 4.3 to 4.9 in two months because satisfied guests are prompted right after their meal.",
  },
  {
    name: "Liam O'Connor",
    role: "Beverage Director",
    restaurant: "The Copper Still",
    city: "Chicago",
    stars: 5,
    quote:
      "The search analytics blew my mind. We noticed 40+ people searching for mezcal cocktails, added two specials, and sold out immediately.",
  },
];

export function TestimonialMarquee() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-12 px-4">
        <div className="inline-flex items-center gap-1.5 text-amber-400 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <LuStar key={i} className="h-4 w-4 fill-amber-400" />
          ))}
          <span className="text-xs font-bold text-zinc-300 ml-2">4.9/5 from 850+ Restaurants</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Loved by independent restaurateurs worldwide.
        </h3>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative flex w-full overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-marquee gap-6 whitespace-nowrap py-4">
          {[...REVIEWS, ...REVIEWS].map((item, idx) => (
            <div
              key={idx}
              className="w-[340px] sm:w-[380px] shrink-0 whitespace-normal rounded-3xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-xl shadow-lg transition-transform hover:-translate-y-1 hover:border-indigo-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {Array.from({ length: item.stars }).map((_, s) => (
                    <LuStar key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <LuQuote className="h-5 w-5 text-zinc-600" />
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed italic">
                “{item.quote}”
              </p>

              <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{item.name}</p>
                  <p className="text-[11px] text-zinc-400">{item.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-indigo-400">{item.restaurant}</p>
                  <p className="text-[10px] text-zinc-400">{item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
