import { SLUG_PREVIEW } from "@/constants/auth.constants";

/** Same rules as the backend's slugify at sign-up, so the preview matches the real address. */
export function slugBase(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_PREVIEW.MAX_BASE_LENGTH)
    .replace(/-+$/g, "");
}

/** The address label before sign-up: "<name>" plus a placeholder for the random 6 characters. */
export function slugPreview(name: string): { base: string; suffix: string } {
  return { base: slugBase(name) || SLUG_PREVIEW.FALLBACK_BASE, suffix: SLUG_PREVIEW.SUFFIX_PLACEHOLDER };
}

/** "owner@cafe.com" -> "ow•••@cafe.com", for "we sent a code to …" messages. */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}
