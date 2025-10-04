"use client";

import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";
import Image from "next/image";
import InfiniteImageSlider from "./InfiniteImageSlider";
import SectionBackground from "../UtilityComponents/SectionBackground";
import NewsletterSection from "./NewsletterSection";


export default function HomePage({
  preview,
  posts,
  customevents,
  historyImages,
}: HomePageProps) {
  // Check if there are any posts or events
  const hasContent = posts.length > 0 || customevents.length > 0;

  // Newsletter signup handler
  const handleNewsletterSignup = async (email: string) => {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Newsletter signup failed');
    }

    return response.json();
  };

  return (
    <SiteLayout preview={preview}>
      <VideoSection />
      <SectionBackground>
        <div className="flex flex-col w-full">
          <TrippleIcon />
          <PostCardsSlider posts={posts} customevents={customevents} />
          <div className="relative -mb-pz5 sm:-mt-pz10 overflow-hidden">
            <Image
              src={"/bg-graphic.svg"}
              alt="background graphic"
              fill={true}
              className="absolute object-cover w-pz100 h-pz80 mx-auto -z-1"
            />
            <div className="w-screen pb-12 -mt-pz20 sm:mt-10 sm:pt-20 lg:pt-24">
              <div className="relative w-full lg:shrink-0">
                <InfiniteImageSlider images={historyImages} />
              </div>
            </div>
          </div>
        </div>
      </SectionBackground>
      {/* Newsletter Section - Only show when there are posts/events */}
      {hasContent && (
        <NewsletterSection onNewsletterSignup={handleNewsletterSignup} />
      )}
    </SiteLayout>
  );
}
