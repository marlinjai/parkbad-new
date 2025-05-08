import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";
import Image from "next/image";
import InfiniteImageSlider from "./InfiniteImageSlider";
import SectionBackground from "../UtilityComponents/SectionBackground";

export default function HomePage({
  preview,
  posts,
  customevents,
  historyImages,
}: HomePageProps) {
  return (
    <SiteLayout preview={preview}>
      <VideoSection />
      <SectionBackground>
        <div className="flex flex-col w-full">
          <TrippleIcon />
          <PostCardsSlider posts={posts} customevents={customevents} />
          <div className="relative -mb-pz5 sm:-mt-pz15 overflow-hidden">
            <Image
              src={"/bg-graphic.svg"}
              alt="background graphic"
              fill={true}
              className="absolute object-cover w-pz100 h-pz80 mx-auto -z-1"
            />
            <div className="w-screen pb-12 pt-8 sm:pt-60 lg:pt-32">
              <div className="relative w-full lg:shrink-0">
                <InfiniteImageSlider images={historyImages} />
              </div>
            </div>
          </div>
        </div>
      </SectionBackground>
    </SiteLayout>
  );
}
