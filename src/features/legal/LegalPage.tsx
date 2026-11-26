import Link from "next/link";
import { routes } from "@/config/routes";
import { FeastOwlLogo } from "@/components/brand";
import { LEGAL_UPDATED, type LegalDocument } from "./content";
import "../marketing/marketing.css";

/** Shared layout for the Privacy Policy and Terms pages. Styling comes from the `.mkt` scope. */
export function LegalPage({ doc, other }: { doc: LegalDocument; other: { href: string; label: string } }) {
  return (
    <div className="mkt min-h-screen">
      <header style={{ borderBottom: "1px solid var(--m-line)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={routes.public.home} aria-label="FeastOwl home" className="flex items-center">
            <FeastOwlLogo tone="light" className="text-[1.375rem]" markClassName="size-9" />
          </Link>
          <Link href={routes.public.login} className="mkt-btn mkt-btn-sm mkt-btn-ghost">
            Sign in
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <h1 className="mkt-h2">{doc.title}</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--m-mute)" }}>
            Last updated {LEGAL_UPDATED}
          </p>
          <p className="mkt-lede mt-6" style={{ maxWidth: "none" }}>
            {doc.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <ol className="sticky top-8 space-y-2 text-sm" style={{ color: "var(--m-mute)" }}>
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="mkt-link">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-8">
                <h2 id={`${s.id}-title`} className="mkt-h3">
                  {i + 1}. {s.title}
                </h2>
                {s.body?.map((p) => (
                  <p key={p} className="mkt-body mt-3">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mkt-body mt-3 list-disc space-y-2 pl-5">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--m-line)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm sm:px-6" style={{ color: "var(--m-mute)" }}>
          <p>
            <FeastOwlLogo className="text-lg" markClassName="size-7" />
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href={other.href} className="mkt-link">
              {other.label}
            </Link>
            <Link href={routes.public.home} className="mkt-link">
              Home
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
