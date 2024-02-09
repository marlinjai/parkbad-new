import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { eventsQuery, postsQuery } from "@/sanity/lib/sanity.queries";
import { CustomEvent, PostType } from "@/types/sanityTypes";
import Archive from "../_components/Posts&Events_Components/Archive";
import { draftMode } from "next/headers";
import PreviewArchive from "../_components/Posts&Events_Components/PreviewArchive";

export default async function NeuigkeitenUndEvents() {
  const posts = await sanityFetch<PostType[]>({ query: postsQuery });
  const events = await sanityFetch<CustomEvent[]>({ query: eventsQuery });

  const isDraftMode = draftMode().isEnabled;

  if (isDraftMode) {
    return <PreviewArchive posts={posts} events={events} />;
  }

  return (
    <SiteLayout>
      <Archive posts={posts} events={events} />
    </SiteLayout>
  );
}
