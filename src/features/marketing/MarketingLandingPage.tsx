import Link from "next/link";
import { PiCaretDownBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { BRAND, DASHBOARD_AREAS, FAQS, GUEST_FEATURES, STEPS } from "./content";
import { TableCardScene } from "./components/TableCardScene";

/**
 * The main marketing site's landing page, shown when a request doesn't resolve
 * to a restaurant's own domain (see `app/page.tsx`). Restaurant sites render
 * `TenantLandingPage` instead and are unaffected by anything here.
 *
 * Content lives in `./content.ts`; keep it to what the product actually does.
 */

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const primaryButton = `inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${focusRing}`;
const secondaryButton = `inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted ${focusRing}`;

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-3 text-lg text-muted-foreground">{intro}</p>}
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className={`sr-only rounded-md bg-card px-3 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 ${focusRing}`}>
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className={`text-lg font-bold tracking-tight ${focusRing} rounded`}>
            {BRAND}
          </Link>
          <nav aria-label="Page sections" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#guests" className={`rounded hover:text-foreground ${focusRing}`}>What guests see</a>
            <a href="#dashboard" className={`rounded hover:text-foreground ${focusRing}`}>What you manage</a>
            <a href="#how" className={`rounded hover:text-foreground ${focusRing}`}>How it works</a>
            <a href="#faq" className={`rounded hover:text-foreground ${focusRing}`}>Questions</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href={routes.public.login} className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-foreground hover:bg-muted ${focusRing}`}>
              Sign in
            </Link>
            <Link href={routes.public.register} className={`${primaryButton} h-10 px-4`}>
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Your menu, website and Google reviews behind one QR code.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Put the code on your tables. Guests scan it with their phone camera to see your menu with photos and
              prices, pay the bill with your payment link and leave you a Google review. You keep all of it up to date
              from one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={routes.public.register} className={primaryButton}>
                Create your restaurant account
              </Link>
              <Link href={routes.public.login} className={secondaryButton}>
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sign up with your mobile number. Guests don&apos;t install anything.
            </p>
          </div>
          <TableCardScene />
        </section>

        <Section id="guests" title="What guests see when they scan" intro="One code opens everything a guest needs at the table, in their phone's browser.">
          <dl className="grid gap-x-10 gap-y-8 md:grid-cols-3">
            {GUEST_FEATURES.map((f) => (
              <div key={f.title} className="border-t-2 border-foreground pt-4">
                <dt className="text-lg font-semibold text-foreground">{f.title}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{f.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="dashboard" title="What you manage from the dashboard" intro="Each part of the restaurant has its own page. Give your team access to only the parts they need.">
          <dl className="divide-y divide-border border-y border-border">
            {DASHBOARD_AREAS.map((a) => (
              <div key={a.title} className="grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="text-lg font-semibold text-foreground">{a.title}</dt>
                <dd className="max-w-2xl leading-relaxed text-muted-foreground">{a.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="how" title="From sign-up to your tables in four steps">
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground tabular-nums" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="faq" title="Questions">
          <div className="max-w-3xl divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <details key={f.question} className="group">
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden ${focusRing} rounded`}>
                  {f.question}
                  <PiCaretDownBold className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="max-w-2xl pb-5 leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </Section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Set up your restaurant</h2>
              <p className="mt-2 text-lg text-muted-foreground">Add your dishes, pick a look and print your QR code.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={routes.public.register} className={primaryButton}>
                Create your restaurant account
              </Link>
              <Link href={routes.public.login} className={secondaryButton}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <p>{BRAND}</p>
          <nav aria-label="Account" className="flex gap-6">
            <Link href={routes.public.login} className={`rounded hover:text-foreground ${focusRing}`}>Sign in</Link>
            <Link href={routes.public.register} className={`rounded hover:text-foreground ${focusRing}`}>Create account</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
