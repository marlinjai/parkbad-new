"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Gallery, GalleryImage } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import LightGallery from "lightgallery/react";
import { getImageAltText } from "../UtilityComponents/ImageUtils";

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
    // Create two sets of images with consistent positions (up/down)
    const firstGroup = [...images[0].images];
    const secondGroup = [...images[0].images];
    setDuplicatedImages([...firstGroup, ...secondGroup]);
  }, [images]);
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
  // The fixed duration for your animation - increase duration to slow it down
  const fixedAnimationDuration = 70; // in seconds (changed from 45s to 70s for slower movement)
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
      <div className="mt-36 mb-8">
        <style>{keyframes}</style>
        <h2 className="text-center text-brand-colour-light mb-16 sm:mb-24 text-2sc sm:text-5sc">
          <Link href="/Bildgalerie" className="inline-block transform transition-transform duration-500 hover:scale-105">
            Impressionen aus dem Parkbad
          </Link>
        </h2>
        <div className="relative overflow-hidden mb-pz15 ">
          <div
            ref={sliderRef}
            className="whitespace-nowrap App"
            style={sliderStyle}
          >
            <LightGallery onInit={onInit} speed={500} plugins={[lgZoom]}>
              {duplicatedImages.map((image, index) => {
                // Determine if image should be at top position based on original index
                // This ensures images maintain consistent positions throughout the loop
                const originalIndex = index % images[0].images.length;
                const isTopPosition = originalIndex % 2 === 0;
                
                return (
                  <a href={urlForImage(image).url()} key={index}>
                    <Image
                      alt={getImageAltText(image.alt, 'gallery')}
                      src={urlForImage(image).url()}
                      sizes="(max-width: 640px) 400px, 600px"
                      width={800}
                      height={600}
                      key={index}
                      priority={true}
                      className={`${
                        isTopPosition ? "mt-24" : ""
                      } inline-block h-vw40 w-vw40 sm:h-72 sm:w-72 object-cover mx-3 sm:mx-10 rounded-2xl shadow-lg`}
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
