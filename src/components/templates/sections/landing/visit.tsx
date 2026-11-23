"use client";

import Image from "@/components/ui/Image";
import { FadeIn } from "@/components/templates/landing/_shared/animations";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import type { LandingSectionProps } from "../types";

function ContactLabel({ color, children, className = "mb-1" }: { color: string; children: React.ReactNode; className?: string }) {
  return (
    <p style={{ color }} className={`${className} text-xs font-bold uppercase tracking-wider`}>
      {children}
    </p>
  );
}

/** Opening hours + address/phone/email/WhatsApp/social + pay & review buttons. */
export function VisitSection({ ctx: { c, t, p, sectionBg } }: LandingSectionProps) {
  return (
    <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-14">
        {c.hours.length > 0 && (
          <FadeIn>
            <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">
              Opening Hours
            </p>
            <h2 style={{ color: t.textPrimary }} className={`mb-6 text-2xl font-bold ${t.headingClass ?? ""}`}>
              When We&apos;re Open
            </h2>
            <div className="space-y-2">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between border-b pb-2 text-sm" style={{ borderColor: t.border }}>
                  <span style={{ color: t.textPrimary }} className="font-medium">
                    {h.day}
                  </span>
                  <span style={{ color: t.textSecondary }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.2}>
          <div className="mt-12 lg:mt-0">
            <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">
              Find Us
            </p>
            <h2 style={{ color: t.textPrimary }} className={`mb-6 text-2xl font-bold ${t.headingClass ?? ""}`}>
              Come Say Hello
            </h2>
            <div className="space-y-4">
              {c.address && (
                <div>
                  <ContactLabel color={t.accent}>Address</ContactLabel>
                  <p style={{ color: t.textSecondary }} className="text-sm">
                    {c.address}
                  </p>
                  {c.locationUrl && (
                    <a
                      href={c.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: t.accent }}
                      className="mt-1 inline-block text-xs font-bold uppercase tracking-wider hover:underline"
                    >
                      Get Directions →
                    </a>
                  )}
                </div>
              )}
              {c.phone && (
                <div>
                  <ContactLabel color={t.accent}>Phone</ContactLabel>
                  <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">
                    {c.phone}
                  </a>
                </div>
              )}
              {c.email && (
                <div>
                  <ContactLabel color={t.accent}>Email</ContactLabel>
                  <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">
                    {c.email}
                  </a>
                </div>
              )}
              {c.whatsapp && (
                <div>
                  <ContactLabel color={t.accent}>WhatsApp</ContactLabel>
                  <a
                    href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: t.textPrimary }}
                    className="text-sm font-medium hover:underline"
                  >
                    {c.whatsapp}
                  </a>
                </div>
              )}
              {c.social.length > 0 && (
                <div>
                  <ContactLabel color={t.accent} className="mb-2">Follow Us</ContactLabel>
                  <div className="flex flex-wrap gap-3">
                    {c.social.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: t.accent, color: t.accentText }}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider hover:opacity-80"
                      >
                        <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                        {getSocialPlatformLabel(s.platform, s.name)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {c.cta.payBtn && c.cta.paymentLink && (
                <button
                  onClick={p.onPay}
                  style={{ background: t.accent, color: t.accentText }}
                  className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-85"
                >
                  Pay bill
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button
                  onClick={p.onReview}
                  style={{ borderColor: t.accent, color: t.accent }}
                  className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-70"
                >
                  Write a Review
                </button>
              )}
            </div>
            {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
              <div className="mt-6">
                <ContactLabel color={t.accent} className="mb-2">Scan to Pay</ContactLabel>
                <div
                  className="relative h-40 w-40 rounded-lg border object-contain p-2"
                  style={{ borderColor: t.border, background: t.bg }}
                >
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill className="rounded-lg object-contain p-2" />
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function FaqSection({ ctx: { c, t, sectionBg } }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]">
            FAQ
          </p>
          <h2 style={{ color: t.textPrimary }} className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}>
            Common Questions
          </h2>
        </FadeIn>
        <div className="mt-10 space-y-4">
          {c.faqs.map((f, i) => (
            <FadeIn key={`${f.q}-${i}`} delay={i * 0.07}>
              <div style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-6">
                <h3 style={{ color: t.textPrimary }} className="font-bold">
                  {f.q}
                </h3>
                <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed">
                  {f.a}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSection({ ctx: { c, t, p, footerBg } }: LandingSectionProps) {
  return (
    <footer style={{ background: footerBg, borderColor: t.border }} className="border-t px-5 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div>
          <p style={{ color: t.textPrimary }} className={`text-lg font-bold ${t.headingClass ?? ""}`}>
            {c.businessName}
          </p>
          {c.slogan && (
            <p style={{ color: t.textSecondary }} className="mt-1 text-xs">
              {c.slogan}
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-5 text-xs">
          {c.cta.menuBtn && (
            <p.LinkComponent
              to={p.menuHref}
              style={{ color: t.accent }}
              className="font-bold uppercase tracking-wider hover:underline"
              onClick={() => p.track("click", "footer_menu", {})}
            >
              {c.terms.catalogLabel}
            </p.LinkComponent>
          )}
          {c.phone && (
            <a href={`tel:${c.phone}`} style={{ color: t.textSecondary }} className="hover:underline">
              {c.phone}
            </a>
          )}
          {c.websiteHref && (
            <a
              href={c.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: t.textSecondary }}
              className="hover:underline"
            >
              Website
            </a>
          )}
        </div>
      </div>
      <p style={{ color: t.textSecondary }} className="mt-8 text-center text-[10px] opacity-50">
        © {new Date().getFullYear()} {c.businessName}. All rights reserved.
      </p>
    </footer>
  );
}
