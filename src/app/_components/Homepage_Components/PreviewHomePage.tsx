// ./nextjs-app/app/_components/PreviewHomePage.tsx

"use client";

import { useLiveQuery } from "@sanity/preview-kit";
import HomePage from "@/app/_components/Homepage_Components/HomePage";
import {
  eventsQuery,
  homeImageQuery,
  postsQuery,
} from "../../../sanity/lib/sanity.queries";
import { CustomEvent, Gallery, PostType } from "@/types/sanityTypes";

export default function PreviewHomePage({
  posts = [],
  customevents = [],
  historyImages = [],
  preview,
}: {
  posts: PostType[];
  customevents: CustomEvent[];
  preview: boolean;
  historyImages: Gallery[];
}) {
  const [postData] = useLiveQuery(posts, postsQuery);
  const [eventsData] = useLiveQuery(customevents, eventsQuery);
  const [historyImagesData] = useLiveQuery(historyImages, homeImageQuery);

  return (
    <HomePage
      posts={postData}
      preview={preview}
      customevents={eventsData}
      historyImages={historyImagesData}
    />
  );
}
