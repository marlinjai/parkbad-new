// ./nextjs-app/app/_components/Posts.tsx

import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";

import InfiniteImageSlider from "./InfiniteImageSlider";
import BubbleBackground from "../UtilityComponents/BubbleBackground";

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

      <InfiniteImageSlider images={historyImages} />
    </SiteLayout>
  );
}
