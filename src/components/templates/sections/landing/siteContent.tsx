"use client";

import { useOptionalSiteLook } from "@/components/site-system/SiteLookContext";
import { AmenityGrid, AwardList, Container, EventList, MenuCta, Photo, PlainHeading, SectionShell, TeamGrid } from "@/components/site-system/kit/blocks";
import { curatedList } from "@/components/site-system/kit/content";
import { mixv, tv } from "@/components/site-system/kit/tokens";
import type { LandingSectionProps } from "../types";

/**
 * The five owner-content sections added by the site system (PLAN §2.3), in a
 * plain design that works on any page: the default page and the older
 * layouts use these; the new layouts draw their own. Each renders nothing
 * until the owner has added content.
 */

export function AwardsSection({ ctx, section }: LandingSectionProps) {
  if (ctx.site.awards.length === 0) return null;
  const id = `${section.id}-title`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <PlainHeading id={id} title="Awards and press" />
        <AwardList awards={ctx.site.awards} className="mt-12" />
      </Container>
    </SectionShell>
  );
}

export function TeamSection({ ctx, section }: LandingSectionProps) {
  if (ctx.site.team.length === 0) return null;
  const id = `${section.id}-title`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <PlainHeading id={id} title="The people behind the food" />
        <TeamGrid team={ctx.site.team} className="mt-12" />
      </Container>
    </SectionShell>
  );
}

export function AmenitiesSection({ ctx, section }: LandingSectionProps) {
  if (ctx.site.amenities.length === 0) return null;
  const id = `${section.id}-title`;
  return (
    <SectionShell labelledBy={id} pad="sm">
      <Container>
        <PlainHeading id={id} title="Good to know" align="left" />
        <AmenityGrid amenities={ctx.site.amenities} className="mt-8" />
      </Container>
    </SectionShell>
  );
}

export function EventsSection({ ctx, section }: LandingSectionProps) {
  if (ctx.site.events.length === 0) return null;
  const id = `${section.id}-title`;
  const hasImages = ctx.site.events.some((e) => Boolean(e.imageUrl));
  return (
    <SectionShell labelledBy={id}>
      <Container size="md">
        <PlainHeading id={id} title="What's on" align="left" />
        <EventList events={ctx.site.events} variant={hasImages ? "cards" : "programme"} className="mt-8" />
      </Container>
    </SectionShell>
  );
}

/** Title for the curated list: the owner's, else the business type's ("On tap this week"). */
export function useCuratedList(ctx: LandingSectionProps["ctx"], props: Record<string, unknown> | undefined) {
  const look = useOptionalSiteLook();
  return curatedList(props, ctx.c.menuItems, ctx.c.currencySymbol, look?.business.terms.curatedListTitle ?? "Our picks");
}

export function CuratedListSection({ ctx, section }: LandingSectionProps) {
  const list = useCuratedList(ctx, section.props);
  if (list.items.length === 0) return null;
  const id = `${section.id}-title`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="md">
        <PlainHeading id={id} title={list.title} />
        <ul className="mt-10 grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {list.items.map((d) => (
            <li key={d.id} className="flex gap-4 border-b py-5" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
              {d.image ? <Photo src={d.image} alt="" frame="rounded" className="size-16 shrink-0" sizes="64px" /> : null}
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-3">
                  <span className="min-w-0 flex-1 font-medium" style={{ color: tv.text }}>{d.name}</span>
                  <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.options.length ? d.options.map((o) => `${o.label} ${o.price}`).join(" / ") : d.price}</span>
                </p>
                {d.description ? <p className="mt-1 line-clamp-2 text-sm" style={{ color: tv.muted }}>{d.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <MenuCta ctx={ctx} variant="outline" />
        </div>
      </Container>
    </SectionShell>
  );
}

/** For the older layouts' section tables until Step 6 gives them their own designs. */
export const SITE_CONTENT_SECTIONS = {
  awards: AwardsSection,
  team: TeamSection,
  amenities: AmenitiesSection,
  events: EventsSection,
  "curated-list": CuratedListSection,
} as const;
