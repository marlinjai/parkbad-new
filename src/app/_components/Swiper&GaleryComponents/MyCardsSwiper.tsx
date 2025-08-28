import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCards,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";


// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";

type CardSwiperProps = {
  children: ReactNode;
  [x: string]: any;
};

export function CardSwiper(props: CardSwiperProps) {
  const { children, ...rest } = props;

  return (
    <div>
      <Swiper
        {...rest}
        speed={1200}
        effect="cards"
        modules={[EffectCards, Navigation, Pagination, Autoplay, Keyboard]}
        navigation={{
          nextEl: ".my-swiper-button-next",
          prevEl: ".my-swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        loop={true}
        keyboard={{
          enabled: true,
          onlyInViewport: false,
        }}
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
        }}
      >
        {children}

        <div className="swiper-controls">
          <button 
            type="button"
            className="my-swiper-button-prev" 
            aria-label="Previous slide"
          >
            <div className="slider-arrow left group bg-brand-colour-light hover:bg-brand-accent-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                className="stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </button>
          <button 
            type="button"
            className="my-swiper-button-next" 
            aria-label="Next slide"
          >
            <div className="slider-arrow right group bg-brand-colour-light hover:bg-brand-accent-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                className="stroke-brand-accent-3 group-hover:stroke-brand-colour-light"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

// Export the official SwiperSlide component
export { SwiperSlide };
