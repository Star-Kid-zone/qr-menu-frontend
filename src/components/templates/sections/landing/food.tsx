"use client";

import Image from "@/components/ui/Image";
import { FadeIn, StaggerGroup, StaggerItem, TiltCard } from "@/components/templates/landing/_shared/animations";
import type { LandingSectionContext, LandingSectionProps } from "../types";

interface GridItem {
  name: string;
  description?: string;
  price?: string;
  image?: string | null;
}

interface ItemGridProps {
  ctx: LandingSectionContext;
  items: GridItem[];
  label: string;
  heading: string;
  sectionStyle: React.CSSProperties;
  sectionClassName: string;
  cardBg: string;
  /** Signature cards always render the description line; popular cards only when there is one. */
  alwaysShowDescription: boolean;
  linkLabel: string;
  trackTarget: string;
  trackKey: string;
}

function ItemGrid({
  ctx: { c, t, img, p, cardStyle },
  items,
  label,
  heading,
  sectionStyle,
  sectionClassName,
  cardBg,
  alwaysShowDescription,
  linkLabel,
  trackTarget,
  trackKey,
}: ItemGridProps) {
  return (
    <section style={sectionStyle} className={sectionClassName}>
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]">
            {label}
          </p>
          <h2
            style={{ color: t.textPrimary }}
            className={`text-center text-3xl font-bold sm:text-4xl ${t.headingClass ?? ""}`}
          >
            {heading}
          </h2>
        </FadeIn>
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((item, i) => (
            <StaggerItem key={`${item.name}-${i}`}>
              <TiltCard>
                <div
                  style={{ background: cardBg, borderColor: t.border }}
                  className={`flex h-full flex-col overflow-hidden rounded-xl border p-5 ${cardStyle}`}
                >
                  <div className="relative mb-4 h-36 overflow-hidden rounded-lg">
                    <Image
                      src={item.image || img.dish}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  {item.price && (
                    <span
                      style={{ background: t.accent, color: t.accentText }}
                      className="mb-2 self-start rounded-full px-3 py-0.5 text-xs font-bold"
                    >
                      {item.price}
                    </span>
                  )}
                  <h3 style={{ color: t.textPrimary }} className="font-bold">
                    {item.name}
                  </h3>
                  {(alwaysShowDescription || item.description) && (
                    <p style={{ color: t.textSecondary }} className="mt-1 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {c.cta.menuBtn && (
                    <p.LinkComponent
                      to={p.menuHref}
                      style={{ color: t.accent }}
                      className="mt-auto pt-3 text-xs font-bold uppercase tracking-wider hover:underline"
                      onClick={() => p.track("click", trackTarget, { [trackKey]: item.name })}
                    >
                      {linkLabel}
                    </p.LinkComponent>
                  )}
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function SignatureDishesSection({ ctx }: LandingSectionProps) {
  const { c, t, sectionBg } = ctx;
  if (c.signatureDishes.length === 0) return null;
  return (
    <ItemGrid
      ctx={ctx}
      items={c.signatureDishes}
      label={c.terms.featuredSectionLabel}
      heading={c.terms.featuredSectionSubhead}
      sectionStyle={{ background: sectionBg, borderColor: t.border }}
      sectionClassName="border-y px-5 py-20 sm:px-10"
      cardBg={t.bg}
      alwaysShowDescription
      linkLabel={`${c.terms.ctaLabel} →`}
      trackTarget="dish_card"
      trackKey="dish"
    />
  );
}

export function PopularItemsSection({ ctx }: LandingSectionProps) {
  const { c, t, sectionBg } = ctx;
  if (c.popularItems.length === 0) return null;
  return (
    <ItemGrid
      ctx={ctx}
      items={c.popularItems}
      label={c.terms.popularSectionLabel}
      heading={c.terms.popularSectionSubhead}
      sectionStyle={{ background: t.bg }}
      sectionClassName="px-5 py-20 sm:px-10"
      cardBg={sectionBg}
      alwaysShowDescription={false}
      linkLabel="Order This →"
      trackTarget="popular_item"
      trackKey="item"
    />
  );
}
