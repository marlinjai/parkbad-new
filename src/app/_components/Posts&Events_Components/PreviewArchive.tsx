"use client";

import { eventsQuery, postsQuery } from "@/sanity/lib/sanity.queries";
import { CustomEvent, PostType } from "@/types/sanityTypes";
import { useLiveQuery } from "next-sanity/preview";
import Archive from "./Archive";

export default function PreviewArchive({
  posts = [],
  events = [],
}: {
  posts: PostType[];
  events: CustomEvent[];
}) {
  const [postData] = useLiveQuery(posts, postsQuery);
  const [eventData] = useLiveQuery(events, eventsQuery);

  return <Archive posts={postData} events={eventData} />;
}
