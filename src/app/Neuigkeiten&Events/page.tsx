import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";

export default async function NeuigkeitenUndEvents() {
  //  const galleryData = await sanityFetch<Gallery[]>({ query: zoomGalleryQuery });

  const posts = await sanityFetch({ query: `*[_type == "post"]` });
  const events = await sanityFetch({ query: `*[_type == "event"]` });

  return (
    <SiteLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl mt-10 text-brand-colour-light">
          Alle Veranstaltungen & Beiträge
        </h1>
      </div>
      <div className=" p-10 flex justify-center">
        <p>display veranstaltungen</p>
      </div>
    </SiteLayout>
  );
}
