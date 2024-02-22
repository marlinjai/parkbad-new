"use client";

import { Gallery } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";

import RentingForm from "../UtilityComponents/RentingForm";
import { useEffect, useRef, useState } from "react";

const builder = urlForImage(client);

interface CelebratingHeroProps {
  heroImages: Gallery[];
}

export default function CelebratingHero(props: CelebratingHeroProps) {
  const heroImages = props.heroImages[0].images.map((image) => ({
    src: builder.image(image).url(),
    alt: image.alt,
  }));
  const [isFormVisible, setIsFormVisible] = useState(true);
  const formRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsFormVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFormVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    //    {/* Hero section */}
    <>
      <div className=" w-screen h-screen md:h-screen relative ">
        {/* <FeiernFader images={heroImages} /> */}
        <Image
          src={heroImages[0].src}
          alt={heroImages[0].alt}
          fill={true}
          priority={true}
          className="object-cover w-screen h-screen md:h-screen"
        ></Image>
      </div>

      {/* Content section */}
      <div className="absolute  overflow-hidden w-screen h-screen flex justify-center items-start">
        <div className="-mt-8" ref={formRef}>
          {isFormVisible ? (
            <RentingForm
              headline="Möchtest du das Parkbad mieten?"
              subheadline="Schreib uns worum es geht und wir melden uns bei dir"
              buttonHoverColor="bg-brand-colour-dark"
            />
          ) : (
            <button
              className=" text-brand-colour-light "
              onClick={handleButtonClick}
            >
              Show Form
            </button>
          )}
        </div>
      </div>
    </>
  );
}
