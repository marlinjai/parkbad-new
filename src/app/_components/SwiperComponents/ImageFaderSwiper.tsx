"use client";

import { Key, ReactNode, useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import Image from "next/image";
import { Swiper } from "swiper/types";

export function ImageFaderSwiper(props: {
  [x: string]: any;
  children: ReactNode;
}) {
  const swiperRef = useRef<
    HTMLElement & { swiper: Swiper; initialize: () => void }
  >(null);
  const { children, ...rest } = props;

  useEffect(() => {
    if (swiperRef.current) {
      const swiperEl = swiperRef.current;

      // Register Swiper web component
      register();

      const params = {
        ...rest,
        speed: 3000,
        effect: "fade", // Fade effect instead of cards
        grabCursor: false,
        modules: [EffectFade, Autoplay, Keyboard],
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          disabledClass: "disabled_swiper_button",
        },
        loop: true,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        allowTouchMove: false,
      };
      // Assign it to swiper element
      Object.assign(swiperEl, params);

      // initialize swiper
      swiperRef.current.initialize();
    }
  }, []);

  return (
    <div className="my-pz10 px-pz10 md:px-pz20">
      <swiper-container
        className="swiper-container"
        init="false"
        ref={swiperRef}
      >
        {children}
        <div className="swiper-pagination"></div>
      </swiper-container>
    </div>
  );
}

export function SwiperSlide(props: { [x: string]: any; children: ReactNode }) {
  const { src, alt, ...rest } = props;

  return (
    <swiper-slide {...rest}>
      <div className="relative h-48 md:h-96 w-auto ">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover"
          }} />
      </div>
    </swiper-slide>
  );
}

export default function ImageFader(props: { images: any }) {
  const { images } = props;
  return (
    <ImageFaderSwiper className="fader">
      {images.map(
        (
          image: { src: string; alt: string },
          index: Key | null | undefined
        ) => (
          <SwiperSlide
            key={index}
            src={image.src}
            alt={image.alt}
            children={undefined}
          />
        )
      )}
    </ImageFaderSwiper>
  );
}
