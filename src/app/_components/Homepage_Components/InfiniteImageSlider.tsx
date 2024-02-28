"use client";

import React, { useState, useEffect, useRef } from "react";
import { Gallery, GalleryImage } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgZoom from "lightgallery/plugins/zoom";
import Image from "next/image";

const InfiniteImageSlider = ({ images }: { images: Gallery[] }) => {
  const [duplicatedImages, setDuplicatedImages] = useState<GalleryImage[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    setDuplicatedImages([...images[0].images, ...images[0].images]);
  }, []);
  // Let's say you want a fixed animation duration of 20 seconds

  const calculateTotalWidth = () => {
    if (sliderRef.current) {
      // Use scrollWidth to get the full width including the overflow
      const totalWidth = sliderRef.current.scrollWidth;
      setSliderWidth(totalWidth / 2); // We divide by 2 because we duplicated the images
    }
  };

  // This effect calculates the width of the slider
  useEffect(() => {
    calculateTotalWidth();
    // Setup a resize event listener to recalculate on resize
    window.addEventListener("resize", calculateTotalWidth);

    const updateSliderWidthOnImageLoad = () => {
      const images = sliderRef.current?.getElementsByTagName("img") || [];
      let loadedImages = 0;

      // Convert HTMLCollection to an array to iterate
      const imagesArray = Array.from(images);

      for (const img of imagesArray) {
        if (img.complete) {
          loadedImages++;
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === imagesArray.length) {
              calculateTotalWidth();
            }
          };
        }
      }
      if (loadedImages === imagesArray.length) {
        calculateTotalWidth();
      }
    };

    updateSliderWidthOnImageLoad();

    return () => {
      window.removeEventListener("resize", calculateTotalWidth);
    };
  }, [duplicatedImages]);
  const builder = urlForImage(client);
  // The fixed duration for your animation
  const fixedAnimationDuration = 34; // in seconds
  // Inline keyframe styles
  const keyframes = `
   @keyframes slide {
     from { transform: translate3d(0, 0, 0); }
     to { transform: translate3d(-${sliderWidth}px, 0, 0); }
   }
 `;

  // Inline styles for the slider
  const sliderStyle = {
    animation: `slide ${fixedAnimationDuration}s linear infinite`,
  };

  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  // ...rest of your component
  return (
    <>
      <div className="">
        <style>{keyframes}</style>
        <h2 className="text-center text-brand-colour-light  sm:my-pz5 text-2sc">
          Impressionen aus dem Parkbad
        </h2>
        <div className="relative overflow-hidden mb-pz15 ">
          <div
            ref={sliderRef}
            className="whitespace-nowrap App"
            style={sliderStyle}
          >
            <LightGallery onInit={onInit} speed={500} plugins={[lgZoom]}>
              {duplicatedImages.map((image, index) => {
                return (
                  <a href={builder.image(image).url()} key={index}>
                    <Image
                      alt={image.alt}
                      src={builder.image(image).url()}
                      sizes="(max-width: 640px) 350px, 600px"
                      width={800}
                      height={600}
                      key={index}
                      priority={true}
                      className={`${
                        index % 2 == 0 ? " mt-24" : ""
                      } inline-block h-vw30 w-vw30 sm:h-72 sm:w-72 object-cover mx-5 sm:mx-10 rounded-2xl shadow-lg`}
                    />
                  </a>
                );
              })}
            </LightGallery>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfiniteImageSlider;
