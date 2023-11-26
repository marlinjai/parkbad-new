import { ReactNode, useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import {
  Autoplay,
  EffectCards,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper } from "swiper/types";

type CardSwiperProps = {
  children: ReactNode;
  [x: string]: any;
};

export function CardSwiper(props: CardSwiperProps) {
  const swiperRef = useRef<
    HTMLElement & { swiper: Swiper; initialize: () => void }
  >(null);
  const { children, ...rest } = props;

  useEffect(() => {
    if (swiperRef.current) {
      const swiperEl = swiperRef.current;

      // Register Swiper web component
      register();

      // pass component props to parameters
      const params = {
        ...rest,
        speed: 900,
        effect: "cards",
        modules: [EffectCards, Navigation, Pagination, Autoplay, Keyboard],
        navigation: {
          nextEl: ".my-swiper-button-next",
          prevEl: ".my-swiper-button-prev",
        },
        // autoplay: {
        //   delay: 2700,
        //   disableOnInteraction: true,
        //   pauseOnMouseEnter: true,
        // },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        loop: true,

        keyboard: {
          enabled: true,
          onlyInViewport: false,
        },
      };

      // Assign it to swiper element
      Object.assign(swiperEl, params);

      // initialize swiper
      swiperRef.current.initialize();
    }
  }, [rest]);

  return (
    <div>
      <swiper-container init="false" ref={swiperRef}>
        {children}

        <div className="swiper-controls">
          <div className="my-swiper-button-prev">
            <div className=" slider-arrow left group bg-brand-colour-light hover:bg-brand-accent-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                className=" stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </div>
          <div className="my-swiper-button-next">
            <div className=" slider-arrow right group bg-brand-colour-light hover:bg-brand-accent-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                className=" stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
          <div className="swiper-pagination "></div>
        </div>
      </swiper-container>
    </div>
  );
}

// SwiperSlide component
export function SwiperSlide(props: { [x: string]: any }) {
  return <swiper-slide {...props}></swiper-slide>;
}
