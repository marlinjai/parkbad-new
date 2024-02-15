// ./nextjs-app/app/_components/Posts.tsx

import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";
import LogoCloud from "./LogoCloud";

export default function HomePage({
  posts,
  customevents,
  preview,
}: HomePageProps) {
  const title = posts.length === 1 ? `1 Post` : `${posts.length} Posts`;

  return (
    <SiteLayout preview={preview}>
      <VideoSection></VideoSection>
      <TrippleIcon></TrippleIcon>
      <PostCardsSlider posts={posts} customevents={customevents} />
      {/* <LogoCloud></LogoCloud> */}
    </SiteLayout>
  );
}
