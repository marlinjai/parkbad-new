// ./nextjs-app/app/_components/Posts.tsx
"use client";
import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";
import Image from "next/image";
import InfiniteImageSlider from "./InfiniteImageSlider";
import LoadingSpinner from "../UtilityComponents/LoadingSpinner";

export default function HomePage({
  preview,
  posts,
  customevents,
  historyImages,
}: HomePageProps) {
  return (
    <>
      <SiteLayout preview={preview}>
        <VideoSection></VideoSection>
        <TrippleIcon></TrippleIcon>
        <PostCardsSlider posts={posts} customevents={customevents} />

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
    </>
  );
}
