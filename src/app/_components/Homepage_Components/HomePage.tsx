// ./nextjs-app/app/_components/Posts.tsx

import Link from "next/link";
import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "./PostCardsSlider";
import LogoCloud from "./LogoCloud";
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
