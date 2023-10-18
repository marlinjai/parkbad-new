// ./nextjs-app/app/page.tsx

import { SanityDocument } from "next-sanity";
import Posts from "@/app/_components/Posts";
import { postsQuery } from "../sanity/lib/sanity.queries";
import { sanityFetch } from "../sanity/lib/sanity.fetch";

export default async function Home() {
  const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery });

  return <Posts posts={posts} />;
}
