// ./nextjs-app/app/components/PreviewPost.tsx

"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "@sanity/preview-kit";
import { postQuery } from "@/sanity/lib/sanity.queries";
import Post from "@/app/_components/Posts&Events_Components/Post";
import { PostType } from "@/types/sanityTypes";

export default function PreviewPost({
  post,
  preview,
}: {
  post: PostType;
  preview: boolean;
}) {
  const params = useParams();
  const [data] = useLiveQuery(post, postQuery, params);

  return <Post preview={preview} post={data} />;
}
