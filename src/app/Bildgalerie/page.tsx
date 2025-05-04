import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { Gallery } from "@/types/sanityTypes";
import { zoomGalleryQuery } from "@/sanity/lib/sanity.queries";
import LightImageGallery from "../_components/Swiper&GaleryComponents/LightImageGallery";

export const revalidate = 3600; // Revalidate every hour

export default async function Bildgalerie() {
  const galleryData = await sanityFetch<Gallery[]>({ query: zoomGalleryQuery });

  if (!galleryData || !galleryData.length) {
    return (
      <SiteLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
          <h2 className="text-center text-brand-colour-light mt-pz5 text-2sc mb-4">
            Bildgalerie
          </h2>
          <p className="text-center text-gray-500">
            Derzeit sind keine Bilder in der Galerie verfügbar.
          </p>
        </div>
      </SiteLayout>
    );
  }

  // Use the first gallery in the array (already sorted newest first in the query)
  const firstGallery = galleryData[0];

  return (
    <SiteLayout>
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-center text-brand-colour-light mt-pz5 text-2sc">
          Bildgalerie
        </h2>
      </div>
      <div className="p-4 md:p-12 xl:p-20 flex flex-wrap justify-center">
        <LightImageGallery images={firstGallery.images} />
      </div>
    </SiteLayout>
  );
}
