import type { Metadata } from "next";
import { LegalPage, PRIVACY } from "@/features/legal";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: routes.public.privacy },
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} other={{ href: routes.public.terms, label: "Terms and Conditions" }} />;
}
