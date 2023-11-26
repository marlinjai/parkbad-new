import { Gallery } from "@/types/sanityTypes";
import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import { celebrationFaderQuery } from "@/sanity/lib/sanity.queries";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";
import FeiernFader from "../Swiper&GaleryComponents/FeiernfaderSwiper";

const builder = urlForImage(client);

export default async function CelebratingHero() {
  const heroImagesArray = await sanityFetch<Gallery[]>({
    query: celebrationFaderQuery,
  });

  const heroImages = heroImagesArray[0].images.map((image) => ({
    src: builder.image(image).url(),
    alt: image.alt,
  }));

  return (
    //    {/* Hero section */}
    <>
      <div className=" w-screen h-screen relative">
        <FeiernFader images={heroImages} />
      </div>
    </>
  );
}
