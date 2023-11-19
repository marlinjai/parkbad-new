// ./nextjs-app/app/page.tsx
import HomePage from "./_components/Homepage_Components/HomePage";
import { eventsQuery, postsQuery } from "@/sanity/lib/sanity.queries";
import { sanityFetch, token } from "@/sanity/lib/sanity.fetch";
import { draftMode } from "next/headers";
import PreviewHomePage from "@/app/_components/Homepage_Components/PreviewHomePage";
import PreviewProvider from "@/app/_components/UtilityComponents/PreviewProvider";
import { CustomEvent, PostType } from "@/types/sanityTypes";

export default async function Home() {
  const posts = await sanityFetch<PostType[]>({ query: postsQuery });

  const customevents = await sanityFetch<CustomEvent[]>({ query: eventsQuery });
  const isDraftMode = draftMode().isEnabled;

  console.log(customevents, posts);

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewHomePage
          posts={posts}
          customevents={customevents}
          preview={isDraftMode}
        />
      </PreviewProvider>
    );
  }

  return (
    <HomePage posts={posts} customevents={customevents} preview={isDraftMode} />
  );
}
