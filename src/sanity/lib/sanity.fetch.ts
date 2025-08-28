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

  return client.fetch<QueryResponse>(query, params, {
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });
}
