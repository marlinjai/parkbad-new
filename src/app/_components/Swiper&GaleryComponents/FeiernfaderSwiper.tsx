"use client";

import React, { Key, ReactNode, useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import Image from "next/image";
import Swiper from "swiper";

export function FeiernFaderSwiper(props: {
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
  }, [rest]);

  return (
    <div>
      <swiper-container
        className="swiper-container"
        init={false}
        ref={swiperRef}
      >
        {children}
        <div className="swiper-pagination"></div>
      </swiper-container>
    </div>
  );
}

export function SwiperSlide(props: { [x: string]: any }) {
  const { src, alt, ...rest } = props;

  return (
    <swiper-slide {...rest}>
      <div className="relative h-screen md:h-screen w-screen ">
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
    </swiper-slide>
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
              <SwiperSlide
                className=" rounded-none"
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
