/**
 * Four page routes carry a literal "&" in their path (/Essen&Trinken and
 * friends). The sitemap lists them percent-encoded (/Essen%26Trinken), which is
 * the correct URL form. Vercel matches the encoded path to the route; the
 * self-hosted Next server does not, and answers 404 (measured 2026-11-11 in the
 * standalone container; a next.config `rewrites` entry for the encoded source
 * did not match either). The proxy uses this to map the encoded form onto the
 * route, so both forms answer 200 on both hosts.
 *
 * Returns the path to rewrite to, or null when nothing needs to change.
 */
export function decodedAmpersandPath(pathname: string): string | null {
  if (!/%26/i.test(pathname)) return null;
  return pathname.replace(/%26/gi, "&");
}
