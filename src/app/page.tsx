// ./nextjs-app/app/page.tsx
import HomePage from "./_components/Homepage_Components/HomePage";
import {
  homeImageQuery,
  homePostsQuery,
  homepageEventsQuery,
} from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { draftMode } from "next/headers";
import PreviewHomePage from "@/app/_components/Homepage_Components/PreviewHomePage";
import PreviewProvider from "@/app/_components/UtilityComponents/PreviewProvider";
import { CustomEvent, Gallery, PostType } from "@/types/sanityTypes";

export default async function Home() {
  const posts = await sanityFetch<PostType[]>({ 
    query: homePostsQuery,
    tags: ['post'],// Rely on webhook-based revalidation only
  });

  const customevents = await sanityFetch<CustomEvent[]>({
    query: homepageEventsQuery,
    tags: ['customevent'],// Rely on webhook-based revalidation only
  });

  const historyImages = await sanityFetch<Gallery[]>({
    query: homeImageQuery,
    tags: ['gallery'],// Rely on webhook-based revalidation only
  });

  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewHomePage
          posts={posts}
          customevents={customevents}
          preview={isDraftMode}
          historyImages={historyImages}
        />
      </PreviewProvider>
    );
  }

  return (
    <HomePage
      posts={posts}
      customevents={customevents}
      preview={isDraftMode}
      historyImages={historyImages}
    />
  );
}
