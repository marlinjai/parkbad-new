// ./nextjs-app/app/page.tsx

import { SanityDocument } from "next-sanity";
import Posts from "./_components/Posts";
import { postsQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { draftMode } from "next/headers";
import PreviewPosts from "@/app/_components/PreviewPosts";
import PreviewProvider from "@/app/_components/PreviewProvider";

export default async function Home() {
  const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewPosts posts={posts} />
      </PreviewProvider>
    );
  }

  return <Posts posts={posts} />;
}
