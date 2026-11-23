import { SAFE_HTTP_URL_REGEX } from '@/constants/site.constants';

/**
 * Returns the URL unchanged if it's a safe http(s) link, otherwise ''.
 *
 * Tenant-controlled fields (payment link, review link, location link) render
 * as `<a href>` / `window.open()` targets on the public site. Without this
 * check a value like `javascript:...` would execute in every visitor's
 * browser — the backend rejects it on save, but this guards any data that
 * predates that validation, and any path that bypasses it.
 */
export function toSafeExternalUrl(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  return SAFE_HTTP_URL_REGEX.test(value) ? value : "";
}

export function isSafeExternalUrl(raw: string | null | undefined): boolean {
  return SAFE_HTTP_URL_REGEX.test((raw ?? "").trim());
}
