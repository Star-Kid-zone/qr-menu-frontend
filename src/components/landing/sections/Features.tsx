"use client";

import type { ReactNode } from "react";
import { Reveal } from "../parallax/Reveal";
import { LoyaltyVisual, OffersVisual, PaymentVisual, QrVisual, ReviewVisual, StaffVisual } from "./FeatureVisuals";

const FEATURES = [
  {
    index: "01",
    title: "Custom QR codes",
    description:
      "Every menu comes with a QR code you can actually make look like your brand — 6 corner styles and 6 dot styles, independent colors for the pattern, the corners, and the background, plus your logo embedded in the center. Print it on table tents, doors, receipts, anywhere. Export as PNG or SVG at full resolution whenever you need it.",
    Visual: QrVisual,
  },
  {
    index: "02",
    title: "Reviews that build trust",
    description:
      "Connect your Google Business listing once — search for it by name, right inside the dashboard — and sync your latest reviews onto your site with a click. Real names, real ratings, real quotes, refreshed whenever you hit sync (rate-limited to once a minute so it doesn't hammer Google's API). No manual screenshotting.",
    Visual: ReviewVisual,
  },
  {
    index: "03",
    title: "Loyalty & rewards",
    description:
      "A 3-reel slot machine your guests can play right from your site — one spin per person per day, no name or phone number required. The outcome is decided on the server before the reels even start animating, so it's always fair, never gamed. Set a win ratio, pick an emoji and a prize, and a live \"Recent Winners\" feed keeps the energy up.",
    Visual: LoyaltyVisual,
  },
  {
    index: "04",
    title: "Payments, simplified",
    description:
      "Attach a payment link — UPI, PayPal, whatever you already use — and QRMenu turns it into a scannable QR code automatically. Or upload your own payment QR image directly. Either way, guests get a clean \"Pay bill\" button right on the menu, pointed at the payment setup you already have.",
    Visual: PaymentVisual,
  },
  {
    index: "05",
    title: "Staff & access",
    description:
      "Bring your team in without handing out your login. Staff sign in with their own phone number and password, scoped to just the menu and workspace sections — no access to analytics, payments, reviews, or marketing tools unless you're the owner. Deactivate anyone instantly without deleting their account.",
    Visual: StaffVisual,
  },
  {
    index: "06",
    title: "Offers & gallery",
    description:
      "Run simple promo cards — a title, a discount label, a photo — independent of the poster studio, for the deals you just want listed on your site. Pair it with a photo gallery so guests get a feel for the space before they ever walk in. Toggle either section on or off whenever you want.",
    Visual: OffersVisual,
  },
] as const;

function FeatureRow({
  index,
  title,
  description,
  visual,
  reverse,
}: {
  index: string;
  title: string;
  description: string;
  visual: ReactNode;
  reverse: boolean;
}) {
  return (
    <Reveal>
      <div className={`grid grid-cols-1 items-center gap-8 border-t border-white/15 py-12 sm:grid-cols-2 sm:gap-16 sm:py-16 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}>
        <div>{visual}</div>
        <div>
          <span className="font-display text-xs font-semibold text-white/40">{index}</span>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">{title}</h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">{description}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function Features() {
  return (
    <section id="index" className="relative bg-[#0d0906] px-5 py-24 text-white xs:px-8 sm:px-12 sm:py-32">
      <Reveal className="mb-4 max-w-2xl">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          ( Index — {FEATURES.length.toString().padStart(2, "0")} )
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          And everything else
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
          The essentials get the spotlight — here&apos;s what rounds the platform out.
        </p>
      </Reveal>

      <div>
        {FEATURES.map((feature, i) => (
          <FeatureRow
            key={feature.index}
            index={feature.index}
            title={feature.title}
            description={feature.description}
            visual={<feature.Visual />}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
