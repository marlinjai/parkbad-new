// ./nextjs-app/app/components/PreviewPost.tsx

"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "@sanity/preview-kit";
import { eventsQuery, postQuery } from "@/sanity/lib/sanity.queries";
import Post from "@/app/_components/Posts&Events_Components/Post";
import { CustomEvent, PostType } from "@/types/sanityTypes";

export default function PreviewPost({
  post,
  customevent,
  preview,
}: {
  post: PostType;
  customevent: CustomEvent;
  preview: boolean;
}) {
  const params = useParams();

  const [postData] = useLiveQuery(post, postQuery, params);
  const [eventData] = useLiveQuery(customevent, eventsQuery, params);

  return <Post preview={preview} post={postData} customevent={eventData} />;
}
