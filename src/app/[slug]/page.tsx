// ./nextjs-app/app/[slug]/page.tsx

import Post from "@/app/_components/Post";
import { postPathsQuery, postQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { client } from "@/sanity/lib/sanity.client";
import { PostType } from "@/types/sanityTypes";
import PreviewProvider from "../_components/PreviewProvider";
import PreviewPost from "../_components/PreviewPost";
import { draftMode } from "next/headers";

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  // Important, use the plain Sanity Client here
  const posts = await client.fetch(postPathsQuery);

  return posts;
}

export default async function Page({ params }: { params: any }) {
  const post = await sanityFetch<PostType>({ query: postQuery, params });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewPost post={post} />
      </PreviewProvider>
    );
  }

  return <Post post={post} />;
}
