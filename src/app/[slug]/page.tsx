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

export default async function Page({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const post = await sanityFetch<PostType>({ 
    query: postQuery, 
    params: resolvedParams,
    tags: ['post', `post:${resolvedParams.slug}`],
  });
  const event = await sanityFetch<CustomEvent>({ 
    query: eventQuery, 
    params: resolvedParams,
    tags: ['customevent', `customevent:${resolvedParams.slug}`],
  });
  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewPost preview={isDraftMode} post={post} customevent={event} />
      </PreviewProvider>
    );
  }

  return <Post preview={isDraftMode} post={post} customevent={event} />;
}
