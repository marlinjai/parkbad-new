// ./nextjs-app/app/[slug]/page.tsx

import Post from "@/app/_components/Posts&Events_Components/Post";
import { postPathsQuery, postQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { client } from "@/sanity/lib/sanity.client";
import PreviewProvider from "../_components/UtilityComponents/PreviewProvider";
import PreviewPost from "../_components/Posts&Events_Components/PreviewPost";
import { draftMode } from "next/headers";
import { PostType } from "@/types/sanityTypes";

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
        <PreviewPost preview={isDraftMode} post={post} />
      </PreviewProvider>
    );
  }

  return <Post preview={isDraftMode} post={post} />;
}
