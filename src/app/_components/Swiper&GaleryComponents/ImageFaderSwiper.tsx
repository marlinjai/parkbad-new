// src/app/_components/Swiper&GaleryComponents/ImageFaderSwiper.tsx

"use client";

import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

export function ImageFaderSwiper(props: {
  [x: string]: any;
  children: ReactNode;
}) {
  const { children, ...rest } = props;

  return (
    <div className="my-pz10 px-pz10 md:px-pz20">
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

// Export the official SwiperSlide component
export { SwiperSlide };