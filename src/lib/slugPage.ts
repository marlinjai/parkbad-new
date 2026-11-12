/**
 * Pure helpers for the /[slug] page, which serves both Sanity posts and
 * Sanity events from one URL space.
 */

type WithSlug = { slug?: string | null } | null | undefined;

/**
 * The paths to prerender: every post AND every event that has a slug. The
 * page used `return posts && events`, which evaluates to the events alone, so
 * no post was ever prerendered (they were rendered on first request instead).
 * Post and event slugs do not collide today (checked 2026-11-11: 5 posts, 36
 * events, no shared slug); duplicates are dropped anyway, because Next rejects
 * the same path twice.
 */
export function slugParams(posts: WithSlug[] | null | undefined, events: WithSlug[] | null | undefined): { slug: string }[] {
  const seen = new Set<string>();
  const params: { slug: string }[] = [];
  for (const item of [...(posts ?? []), ...(events ?? [])]) {
    const slug = item?.slug;
    if (typeof slug !== "string" || slug === "" || seen.has(slug)) continue;
    seen.add(slug);
    params.push({ slug });
  }
  return params;
}

/**
 * Whether a request for /[slug] must answer 404. Any unknown single-segment
 * path lands on this route; without this it rendered an empty page with
 * status 200 (a soft 404 that search engines index). In draft mode the page
 * keeps rendering even without a published document, because the preview
 * loads unpublished drafts in the browser with the read token.
 */
export function isUnknownSlug({ post, event, isDraftMode }: { post: unknown; event: unknown; isDraftMode: boolean }): boolean {
  return !isDraftMode && !post && !event;
}
