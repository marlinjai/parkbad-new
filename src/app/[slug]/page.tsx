// ./nextjs-app/app/[slug]/page.tsx

import Post from "@/app/_components/Posts&Events_Components/Post";
import {
  eventPathsQuery,
  eventQuery,
  postPathsQuery,
  postQuery,
} from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { client } from "@/sanity/lib/sanity.client";
import PreviewProvider from "../_components/UtilityComponents/PreviewProvider";
import PreviewPost from "../_components/Posts&Events_Components/PreviewPost";
import { draftMode } from "next/headers";
import { CustomEvent, PostType } from "@/types/sanityTypes";

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  // Important, use the plain Sanity Client here
  const posts = await client.fetch(postPathsQuery);
  const events = await client.fetch(eventPathsQuery);

  return posts && events;
}

export default async function Page({ params }: { params: any }) {
  const post = await sanityFetch<PostType>({ query: postQuery, params });
  const event = await sanityFetch<CustomEvent>({ query: eventQuery, params });
  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewPost preview={isDraftMode} post={post} customevent={event} />
      </PreviewProvider>
    );
  }

  console.log("Post", post);

  return <Post preview={isDraftMode} post={post} customevent={event} />;
}
