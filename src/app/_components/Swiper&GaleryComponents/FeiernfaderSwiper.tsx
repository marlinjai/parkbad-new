// src/app/_components/Swiper&GaleryComponents/FeiernfaderSwiper.tsx

"use client";

import React, { Key, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

export function FeiernFaderSwiper(props: {
  [x: string]: any;
  children: ReactNode;
}) {
  const { children, ...rest } = props;

  return (
    <div>
      <Swiper
        {...rest}
        speed={3000}
        effect="fade"
        modules={[EffectFade, Autoplay, Keyboard]}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        keyboard={{
          enabled: true,
        }}
      >
        {children}
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
}

export function FeiernSwiperSlide(props: { [x: string]: any }) {
  const { src, alt, ...rest } = props;

  return (
    <SwiperSlide {...rest}>
      <div className="relative h-screen md:h-screen w-screen">
        <Image
          src={src}
          alt={alt || "Celebration image"}
          fill={true}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    </SwiperSlide>
  );
}

export default function FeiernFader(props: { images: any }) {
  const { images } = props;
  return (
    <FeiernFaderSwiper className="fader">
      {images
        ? images.map(
            (
              image: { src: string; alt: string },
              index: Key | null | undefined
            ) => (
              <FeiernSwiperSlide
                className="rounded-none"
                key={index}
                src={image.src}
                alt={image.alt || "Celebration image"}
              />
            )
          )
        : null}
    </FeiernFaderSwiper>
  );
}