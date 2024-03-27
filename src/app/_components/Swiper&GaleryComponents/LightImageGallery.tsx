"use client";

import React, { useEffect, useRef } from "react";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { GalleryImage } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const builder = urlForImage(client);

interface ZoomgalleryProps {
  images: GalleryImage[];
}
export default function Gallery(props: ZoomgalleryProps) {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  const imageRefs = useRef([]);

  useEffect(() => {
    imageRefs.current.forEach((ref, index) => {
      gsap.fromTo(
        ref,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          scrollTrigger: {
            trigger: ref,
            start: "top 75%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="App  gap-4 columns-2 lg:columns-3 xl:columns-4 [&>img:not(:first-child)]:mt-5 lg:[&>img:not(:first-child)]:mt-8">
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgZoom, lgThumbnail]}
        elementClassNames="my-gallery"
      >
        {props.images.map((image, index) => {
          return (
            <a
              href={builder.image(image).url()}
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                alt={image.alt}
                src={builder.image(image).url()}
                sizes="(max-width: 1200px) 500px, 800px"
                width={800}
                height={600}
                loading="lazy"
                className={`${
                  index !== 0 ? "mt-4 lg:mt-4" : ""
                } object-cover rounded-lg shadow-lg`}
              />
            </a>
          );
        })}
      </LightGallery>
    </div>
  );
}
