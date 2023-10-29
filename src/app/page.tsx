// ./nextjs-app/app/page.tsx

import { SanityDocument } from "next-sanity";
import HomePage from "./_components/HomePage";
import { postsQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { draftMode } from "next/headers";
import PreviewHomePage from "@/app/_components/PreviewHomePage";
import PreviewProvider from "@/app/_components/PreviewProvider";

export default async function Home() {
  const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewHomePage posts={posts} preview={isDraftMode} />
      </PreviewProvider>
    );
  }

  return <HomePage posts={posts} preview={isDraftMode} />;
}
