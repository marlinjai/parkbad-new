import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import Zoomgallery from "../_components/Swiper&GaleryComponents/Zoomgallery";
import { Gallery } from "@/types/sanityTypes";
import { zoomGalleryQuery } from "@/sanity/lib/sanity.queries";
import LightImageGallery from "../_components/Swiper&GaleryComponents/LightImageGallery";

export default async function Bildgalerie() {
  const galleryData = await sanityFetch<Gallery[]>({ query: zoomGalleryQuery });

  if (!galleryData || !galleryData.length) {
    return <div>No gallery data available</div>;
  }
  // Assume the first gallery in the array; you can modify this
  const firstGallery = galleryData[0];

  return (
    <SiteLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4sc md:text-3sc font-carlson text-brand-colour-light font-bold mt-10 ">
          Erinnerungen aus dem Parkbad
        </h1>
      </div>
      <div className="p-4 md:p-12 xl:p-20 flex flex-wrap justify-center">
        {/* <Zoomgallery images={firstGallery.images}></Zoomgallery> */}

        <LightImageGallery images={firstGallery.images}></LightImageGallery>
      </div>
    </SiteLayout>
  );
}
