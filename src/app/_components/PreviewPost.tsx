// ./nextjs-app/app/components/PreviewPost.tsx

"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "@sanity/preview-kit";
import { postQuery } from "@/sanity/lib/sanity.queries";
import Post from "@/app/_components/Post";
import { PostType } from "@/types/sanityTypes";

export default function PreviewPost({ post }: { post: PostType }) {
  const params = useParams();
  const [data] = useLiveQuery(post, postQuery, params);

  return <Post post={data} />;
}
