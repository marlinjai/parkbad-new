import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { eventsQuery, postsQuery } from "@/sanity/lib/sanity.queries";
import { CustomEvent, PostType } from "@/types/sanityTypes";
import Archive from "../_components/Posts&Events_Components/Archive";

export default async function NeuigkeitenUndEvents() {
  const posts = await sanityFetch<PostType[]>({ query: postsQuery });
  const events = await sanityFetch<CustomEvent[]>({ query: eventsQuery });

  return (
    <SiteLayout>
      <Archive posts={posts} events={events} />
    </SiteLayout>
  );
}
