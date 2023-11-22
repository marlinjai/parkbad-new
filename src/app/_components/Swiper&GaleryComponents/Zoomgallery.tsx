"use client";

import { GalleryImage } from "@/types/sanityTypes";
import * as zoomwall from "zoomwall.js";
import "zoomwall.js/lib/zoomwall.css";
import { useEffect } from "react";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";

interface ZoomgalleryProps {
  images: GalleryImage[];
}

const builder = urlForImage(client);

const Zoomgallery: React.FC<ZoomgalleryProps> = ({ images }) => {
  useEffect(() => {
    // This code will only run on the client-side
    window.onload = function () {
      zoomwall.create(document.getElementById("gallerie"), true);
    };
    [];
  }); // The empty dependency array ensures that this effect runs once after initial render

  return (
    <>
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
    </>
  );
};

export default Zoomgallery;
