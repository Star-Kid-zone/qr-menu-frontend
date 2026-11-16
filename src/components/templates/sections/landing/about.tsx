"use client";

import Image from "next/image";
import { FadeIn } from "@/components/templates/landing/_shared/animations";
import type { LandingSectionProps } from "../types";

export function StatsSection({ ctx: { c, t, sectionBg } }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <section style={{ background: sectionBg, borderColor: t.border }} className="border-y">
      <div
        className="mx-auto grid max-w-5xl grid-cols-2 divide-x sm:grid-cols-4"
        style={{ borderColor: t.border }}
      >
        {c.stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-6 px-4 text-center">
            <span style={{ color: t.accent }} className="text-3xl font-bold sm:text-4xl">
              {s.value}
            </span>
            <span style={{ color: t.textSecondary }} className="mt-1 text-xs uppercase tracking-widest">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StorySection({ ctx: { c, t, img, p } }: LandingSectionProps) {
  if (!c.story) return null;
  return (
    <section style={{ background: t.bg }} className="px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl lg:flex lg:items-center lg:gap-14">
        <div className="lg:w-1/2">
          <FadeIn>
            <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">
              Our Story
            </p>
            {c.story.headline && (
              <h2
                style={{ color: t.textPrimary }}
                className={`text-3xl font-bold leading-snug sm:text-4xl ${t.headingClass ?? ""}`}
              >
                {c.story.headline}
              </h2>
            )}
            {c.story.body && (
              <p style={{ color: t.textSecondary }} className="mt-5 leading-relaxed">
                {c.story.body}
              </p>
            )}
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              {c.cta.menuBtn && (
                <p.LinkComponent
                  to={p.menuHref}
                  style={{ background: t.accent, color: t.accentText }}
                  className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-85"
                  onClick={() => p.track("click", "menu_button", { destination: "menu" })}
                >
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
            </div>
          </FadeIn>
        </div>
        <div className="mt-10 lg:mt-0 lg:w-1/2">
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
            <Image
              src={img.scene}
              alt={c.terms.heroAlt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
