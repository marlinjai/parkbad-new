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
      <div className=" w-screen h-vh70 md:h-screen relative ">
        {/* <FeiernFader images={heroImages} /> */}
        <Image
          src={heroImages[0].src}
          alt={heroImages[0].alt}
          fill={true}
          priority={true}
          style={{
            objectFit: "cover",
          }}
        ></Image>
      </div>

      {/* Content section */}
      <div className="absolute -mt-48 overflow-hidden sm:-mt-24">
        <div className="mx-auto max-w-7xl px-12 lg:flex lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
            <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
              <h2 className="text-2xl font-bold tracking-tight text-brand-colour-light sm:text-4xl">
                Möchtest du das Parkbad <br></br> für eine Feier mieten?
              </h2>
              <p className="mt-6 text-xl leading-8 text-gray-100">
                Dann stell uns doch eine Anfrage. <br></br>Wir melden uns dann
                bei dir
              </p>
              <button className="mt-8 bg-brand-border-orange border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-white hover:bg-brand-colour-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-colour-dark">
                <a href="mailto:marlinjp@hotmail.de">Anfrage stellen</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
