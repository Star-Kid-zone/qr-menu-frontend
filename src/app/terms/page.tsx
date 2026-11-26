import type { Metadata } from "next";
import { LegalPage, TERMS } from "@/features/legal";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: routes.public.terms },
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} other={{ href: routes.public.privacy, label: "Privacy Policy" }} />;
}
