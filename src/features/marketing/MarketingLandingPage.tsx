import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { BRAND, FAQS, LOOK_COUNT, ROOT_DOMAIN, STEPS } from "./content";
import { SiteHeader } from "./components/SiteHeader";
import { HeroScene } from "./components/HeroScene";
import { LooksBand } from "./components/LooksBand";
import { GuestJourney } from "./components/GuestJourney";
import { DashboardBento } from "./components/DashboardBento";
import { FeastOwlLogo } from "@/components/brand";
import "./marketing.css";

/**
 * The main marketing site's landing page, shown when a request doesn't resolve
 * to a restaurant's own domain (see `app/page.tsx`). Restaurant sites render
 * `TenantLandingPage` instead and are unaffected by anything here.
 *
 * Content lives in `./content.ts`; keep it to what the product actually does.
 * Styling is scoped under `.mkt` (see `./marketing.css`).
 */

function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 id={`${id}-title`} className="mkt-h2">
        {title}
      </h2>
      {intro && <p className="mkt-lede mt-4">{intro}</p>}
    </div>
  );
}

export function MarketingLandingPage() {
  return (
    <div className="mkt min-h-screen">
      <a href="#main" className="sr-only rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50" style={{ background: "var(--m-paper)" }}>
        Skip to content
      </a>

      <SiteHeader brand={BRAND} />

      <main id="main">
        {/* Hero ------------------------------------------------------------ */}
        <section className="mkt-plum-light relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
          <div className="mkt-dots pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
            <div>
              <p className="mkt-rise text-sm font-medium" style={{ color: "var(--m-on-plum-mute)" }}>
                For restaurants, cafes and bars
              </p>
              <h1 className="mkt-display mkt-rise mkt-rise-2 mt-4 max-w-2xl text-[2.75rem] text-white sm:text-6xl lg:text-[4.125rem]">
                One QR code on the table. Your menu, website and reviews behind it.
              </h1>
              <p className="mkt-rise mkt-rise-3 mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "var(--m-on-plum-mute)" }}>
                Guests scan with their phone camera and see your dishes with photos and prices, pay the bill with your
                payment link and leave you a Google review. You update all of it from one dashboard, and the table never
                needs a reprint.
              </p>
              <div className="mkt-rise mkt-rise-4 mt-8 flex flex-wrap items-center gap-3">
                <Link href={routes.public.register} className="mkt-btn mkt-btn-saffron">
                  Create your restaurant account
                </Link>
                <Link href={routes.public.login} className="mkt-btn mkt-btn-ghost-dark">
                  Sign in
                </Link>
              </div>
              <p className="mkt-rise mkt-rise-4 mt-5 text-sm" style={{ color: "var(--m-on-plum-mute)" }}>
                Sign up with your email. Guests install nothing.
              </p>
            </div>
            <HeroScene />
          </div>
        </section>

        {/* Looks band ------------------------------------------------------ */}
        <section id="looks" aria-labelledby="looks-title" className="scroll-mt-20 overflow-hidden py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              id="looks"
              title={`${LOOK_COUNT} looks, one of them is yours`}
              intro="A fine-dining room and a street-food stall should not get the same website. Pick a look for your website and menu, set your colours, and check it on a phone preview before guests see it."
            />
          </div>
          <div className="mt-14">
            <LooksBand />
          </div>
        </section>

        {/* Guest journey --------------------------------------------------- */}
        <section id="guests" aria-labelledby="guests-title" className="scroll-mt-20 py-20 sm:py-28" style={{ background: "var(--m-paper)", borderTop: "1px solid var(--m-line)", borderBottom: "1px solid var(--m-line)" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              id="guests"
              title="What a guest gets from one scan"
              intro="Everything opens in the phone's browser, in the order a guest needs it: look at the menu, visit your website, pay, then review."
            />
            <div className="mt-16">
              <GuestJourney />
            </div>
          </div>
        </section>

        {/* Dashboard ------------------------------------------------------- */}
        <section id="dashboard" aria-labelledby="dashboard-title" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              id="dashboard"
              title="Run the restaurant from one dashboard"
              intro="Each part of the business has its own page. Owners see all of it; managers and staff get only the pages they need."
            />
            <div className="mt-14">
              <DashboardBento />
            </div>
          </div>
        </section>

        {/* Steps ----------------------------------------------------------- */}
        <section id="how" aria-labelledby="how-title" className="mkt-plum scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading id="how" title="From sign-up to your tables in four steps" />
            <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative border-t pt-6" style={{ borderColor: "rgb(255 255 255 / 0.18)" }}>
                  <span className="mkt-display text-4xl" style={{ color: "var(--m-saffron)" }} aria-hidden>
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-relaxed" style={{ color: "var(--m-on-plum-mute)" }}>
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ ------------------------------------------------------------- */}
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading id="faq" title="Questions restaurants ask us" />
            <div className="divide-y" style={{ borderColor: "var(--m-line)" }}>
              {FAQS.map((f) => (
                <details key={f.question} className="mkt-faq group" style={{ borderColor: "var(--m-line)" }}>
                  <summary className="flex items-center justify-between gap-4 py-5 text-lg font-semibold">
                    {f.question}
                    <PiPlusBold className="mkt-faq-icon size-4 shrink-0" style={{ color: "var(--m-brand)" }} aria-hidden />
                  </summary>
                  <p className="mkt-body max-w-2xl pb-6">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA ----------------------------------------------------- */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="mkt-plum-light relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-20">
            <div className="mkt-dots pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="mkt-h2 text-white">Put a code on the table tonight.</h2>
                <p className="mt-4 max-w-lg text-lg" style={{ color: "var(--m-on-plum-mute)" }}>
                  Add your dishes, pick a look and print your QR code. Your website is live at your-restaurant.{ROOT_DOMAIN} as soon as you save.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={routes.public.register} className="mkt-btn mkt-btn-saffron">
                  Create your restaurant account
                </Link>
                <Link href={routes.public.login} className="mkt-btn mkt-btn-ghost-dark">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--m-line)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm sm:px-6" style={{ color: "var(--m-mute)" }}>
          <p>
            <FeastOwlLogo className="text-lg" markClassName="size-7" />
          </p>
          <nav aria-label="Account" className="flex gap-6">
            <Link href={routes.public.login} className="mkt-link">Sign in</Link>
            <Link href={routes.public.register} className="mkt-link">Create account</Link>
            <Link href={routes.public.privacy} className="mkt-link">Privacy</Link>
            <Link href={routes.public.terms} className="mkt-link">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
