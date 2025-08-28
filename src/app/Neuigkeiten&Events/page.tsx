import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { eventsQuery, postsQuery } from "@/sanity/lib/sanity.queries";
import { CustomEvent, PostType } from "@/types/sanityTypes";
import Archive from "../_components/Posts&Events_Components/Archive";
import { draftMode } from "next/headers";
import PreviewArchive from "../_components/Posts&Events_Components/PreviewArchive";

export default async function NeuigkeitenUndEvents() {
  const posts = await sanityFetch<PostType[]>({ 
    query: postsQuery,
    tags: ['post'],
    revalidate: 900 // 15 minutes (news should be fresher)
  });
  const events = await sanityFetch<CustomEvent[]>({ 
    query: eventsQuery,
    tags: ['customevent'],
    revalidate: 900 // 15 minutes
  });

  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  if (isDraftMode) {
    return <PreviewArchive posts={posts} events={events} />;
  }

  return (
    <SiteLayout>
      <Archive posts={posts} events={events} />
    </SiteLayout>
  );
}
