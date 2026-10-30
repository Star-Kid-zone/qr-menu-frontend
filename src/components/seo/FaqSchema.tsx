import React from 'react';
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";

/**
 * FAQPage JSON-LD, built from the same tenant-entered FAQ data rendered on
 * the public landing page (see `ListFaqs.tsx` / `sections.tsx`). Emits
 * nothing when there are no visible FAQs — an empty FAQPage schema would be
 * misleading (and against Google's structured-data guidelines).
 */
export function FaqSchema({ data }: { data: RawPublicSiteData }) {
  const faqs = Array.isArray(data?.faqs)
    ? data.faqs.filter(
        (f): f is { question: string; answer: string } =>
          typeof f?.question === 'string' && f.question.trim().length > 0 &&
          typeof f?.answer === 'string' && f.answer.trim().length > 0,
      )
    : [];

  if (faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  // JSON.stringify does not escape `<`, so a tenant-controlled question/answer
  // containing `</script><script>...` would otherwise break out of this tag.
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
