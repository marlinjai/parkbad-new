// ./nextjs-app/app/_components/PreviewHomePage.tsx

"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import HomePage from "@/app/_components/Homepage_Components/HomePage";
import { eventsQuery, postsQuery } from "../../../sanity/lib/sanity.queries";
import { CustomEvent, PostType } from "@/types/sanityTypes";

export default function PreviewHomePage({
  posts = [],
  customevents = [],
  preview,
}: {
  posts: PostType[];
  customevents: CustomEvent[];
  preview: boolean;
}) {
  const [postData] = useLiveQuery(posts, postsQuery);
  const [eventsData] = useLiveQuery(customevents, eventsQuery);

  return (
    <HomePage posts={postData} preview={preview} customevents={eventsData} />
  );
}
