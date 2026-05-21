import "server-only";

import type { QueryParams } from "@sanity/client";
import { draftMode } from "next/headers";

import { client } from "./sanity.client";

export const token = process.env.SANITY_API_READ_TOKEN;

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
  revalidate,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number;
}): Promise<QueryResponse> {
  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;
  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }

  // Smart caching strategy.
  // `revalidate: 0` is treated as an explicit opt-out of the Data Cache
  // (no-store), so callers that need always-fresh data are unambiguous.
  const cacheConfig = isDraftMode || revalidate === 0
    ? { cache: "no-store" as const }
    : {
        next: {
          revalidate: revalidate ?? 3600, // Default 1 hour cache
          tags: tags.length > 0 ? tags : ['sanity']
        }
      };

  return client.fetch<QueryResponse>(query, params, cacheConfig);
}
