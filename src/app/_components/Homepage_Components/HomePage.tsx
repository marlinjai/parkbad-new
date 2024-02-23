// ./nextjs-app/app/_components/Posts.tsx

import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";
import Image from "next/image";
import InfiniteImageSlider from "./InfiniteImageSlider";

export default function HomePage({
  preview,
  posts,
  customevents,
  historyImages,
}: HomePageProps) {
  return (
    <SiteLayout preview={preview}>
      <VideoSection></VideoSection>
      <TrippleIcon></TrippleIcon>
      <PostCardsSlider posts={posts} customevents={customevents} />
      {/* <LogoCloud></LogoCloud> */}

      {/* <div className="relative isolate ">
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-96 sm:h-[64rem] w-full stroke-brand-accent-4 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-brand-accent-4/50"
          >
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg> */}
      {/* <div
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            className="aspect-[801/1036] w-vw80 bg-gradient-to-tr from-brand-accent-4 to-brand-colour-dark opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
          />
        </div> */}

      <div className="relative overflow-hidden">
        <Image
          src={"/bg-graphic.svg"}
          alt="background graphic"
          fill={true}
          className="absolute object-cover w-pz100 h-pz80 mx-auto "
        ></Image>
        <div className=" w-screen pb-32 pt-36 sm:pt-60  lg:pt-32">
          <div className="relative w-full  lg:shrink-0 ">
            <InfiniteImageSlider images={historyImages} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
