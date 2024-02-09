"use client";

// Import Swiper React components
import { CardSwiper, SwiperSlide } from "./MyCardsSwiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { PostType, CustomEvent } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";
import { PostorEventItem } from "@/types/componentTypes";
import renderDate from "../Homepage_Components/RenderDate";
import { useEffect, useState } from "react";

const builder = urlForImage(client);

export default function PostCardSlider({
  posts,
  customevents,
}: {
  posts: PostType[];
  customevents: CustomEvent[];
}) {
  const items: PostorEventItem[] | null = [...posts, ...customevents];

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
        <h2
          id="news"
          className="text-center text-brand-colour-light my-pz5 text-2sc"
        >
          Neuigkeiten & Veranstaltungen
        </h2>
        <CardSwiper className="text-center h-vw60 w-vw75 md:w-vw60 md:h-vw40 ">
          {items.map((item) => (
            <SwiperSlide style={{ borderRadius: "1rem" }} key={item._id}>
              <div className="flex flex-col justify-center items-center ">
                <a
                  href={`/${item.slug}`}
                  className="text-center h-full w-full absolute inset-0 z-0"
                >
                  <Image
                    src={
                      item.coverImage
                        ? builder.image(item.coverImage).url()
                        : builder.image(item.eventImage).url()
                    }
                    alt={
                      item.coverImage
                        ? item.coverImage.alt
                        : item.eventImage.alt
                    }
                    fill={true}
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={true}
                  />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-4 xs:bottom-8 md:bottom-10 z-50 w-full">
                    <div className="flex flex-col items-center justify-center  text-brand-colour-light">
                      <svg
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 92 5"
                        className=" mb-2 h-1 w-12  stroke-brand-colour-light"
                      >
                        <line
                          x1="2.5"
                          y1="2.5"
                          x2="89.5"
                          y2="2.5"
                          strokeLinecap="round"
                          strokeMiterlimit="10"
                          strokeWidth="5"
                        />
                      </svg>
                      {renderDate(item)}
                      <h3>{item.title ? item.title : item.eventTitle}</h3>
                    </div>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </CardSwiper>
      </div>
    </>
  );
}
