// ./nextjs-app/app/_components/Posts.tsx

import Link from "next/link";
import SiteLayout from "./SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./Homepage_Components/videoSection";
import TrippleIcon from "./Homepage_Components/TrippleLogo";
import PostCardsSlider from "./Homepage_Components/PostCardsSlider";
import LogoCloud from "./Homepage_Components/LogoCloud";
import { useState } from "react";

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
      <LogoCloud></LogoCloud>
    </SiteLayout>
  );
}
