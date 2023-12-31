"use client";

import { ImageFaderSwiper, SwiperSlide } from "./ImageFaderSwiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HistorySwiper(props: {
  images: {
    src: string;
    alt: string;
  }[];
}) {
  const { images } = props;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200); // Wait for 300ms

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <div className={isReady ? "opacity-100 mb-pz5" : " opacity-0"}>
        <ImageFaderSwiper className="text-center h-vw60 w-vw75 md:w-vw60 md:h-vw40">
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              )
              <Image
                src={image.src}
                alt={image.alt}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </ImageFaderSwiper>
      </div>
    </>
  );
}
