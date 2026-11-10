// The canonical public origin of the site. Vercel answers the apex
// (parkbad-gt.de) with a 308 to www, so search engines must be handed the www
// form: a sitemap lists final URLs, never ones that redirect. It is a constant,
// not NEXT_PUBLIC_BASE_URL, because the sitemap and robots.txt must not depend
// on an environment value that may legitimately name the apex for email links.
export const SITE_URL = 'https://www.parkbad-gt.de';

// Page paths contain a literal "&" (e.g. /Essen&Trinken). Inside a sitemap's
// <loc> a raw "&" is invalid XML, so the ampersand is percent-encoded; Next
// serves /Essen%26Trinken from the same route.
export function absoluteUrl(path: string): string {
  const encoded = path.replace(/&/g, '%26');
  return `${SITE_URL}${encoded === '/' ? '' : encoded}`;
}
