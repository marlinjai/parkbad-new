"use client";
import React, { useEffect } from "react";
import * as zoomwall from "zoomwall.js";
import "zoomwall.js/lib/zoomwall.css";
import Image from "next/image";
import { GalleryImage } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";

interface ZoomgalleryProps {
  images: GalleryImage[];
}

const Zoomgallery: React.FC<ZoomgalleryProps> = ({ images }) => {
  useEffect(() => {
    const galleryElement = document.getElementById("gallerie");
    if (galleryElement) {
      zoomwall.create(galleryElement, true);
    }
  }, [images]); // Dependency on 'images' to reinitialize the gallery when images change

  const builder = urlForImage(client);

  return (
    <div id="gallerie" className="zoomwall flex flex-wrap">
      {images.map((image, index) => (
        <Image
          key={index}
          src={builder.image(image).url()}
          sizes="(max-width: 1200px) 200px, 800px"
          height={600}
          width={800}
          alt={image.alt}
        />
      ))}
    </div>
  );
};

export default Zoomgallery;
