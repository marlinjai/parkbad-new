// ./nextjs-app/app/_components/PreviewHomePage.tsx

"use client";

import type { SanityDocument } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";
import HomePage from "@/app/_components/HomePage";
import { postsQuery } from "@/sanity/lib/sanity.queries";

export default function PreviewHomePage({
  posts = [],
  preview,
}: {
  posts: SanityDocument[];
  preview: boolean;
}) {
  const [data] = useLiveQuery(posts, postsQuery);

  return <HomePage posts={data} preview={preview} />;
}
