"use client";

import { Gallery } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";

// Use urlForImage utility instead of creating builder

interface CelebratingHeroProps {
  heroImages: Gallery[];
}

import dynamic from "next/dynamic";
const RentingFormNoSSR = dynamic(
  () => import("../UtilityComponents/RentingForm"),
  { ssr: false }
);

export default function CelebratingHero(props: CelebratingHeroProps) {
  const heroImages = props.heroImages[0].images.map((image) => ({
    src: urlForImage(image).url(),
    alt: image.alt,
  }));

  return (
    //    {/* Hero section */}
    <>
      <div className=" w-screen h-screen md:h-screen relative ">
        {/* <FeiernFader images={heroImages} /> */}
        <Image
          src={heroImages[0].src}
          alt={heroImages[0].alt || "Hero image"}
          fill={true}
          priority={true}
          className="object-cover w-screen h-screen md:h-screen"
        ></Image>
      </div>

      {/* Content section */}
      <div className="absolute  overflow-hidden w-screen h-screen flex justify-center items-start">
        <div className="-mt-8">
          <RentingFormNoSSR
            headline="Möchtest du im Parkbad feiern?"
            subheadline="Schreib uns worum es geht und wir melden uns bei dir"
            buttonHoverColor="bg-brand-colour-dark"
          />
        </div>
      </div>
    </>
  );
}
