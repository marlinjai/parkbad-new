// ./nextjs-app/app/_components/Posts.tsx

import SiteLayout from "../UtilityComponents/SiteLayout";
import { HomePageProps } from "@/types/componentTypes";
import VideoSection from "./videoSection";
import TrippleIcon from "./TrippleLogo";
import PostCardsSlider from "../Swiper&GaleryComponents/PostCardsSlider";

import InfiniteImageSlider from "./InfiniteImageSlider";

export default function HomePage({
  posts,
  customevents,
  preview,
  historyImages,
}: HomePageProps) {
  const title = posts.length === 1 ? `1 Post` : `${posts.length} Posts`;

  return (
    <SiteLayout preview={preview}>
      <VideoSection></VideoSection>
      <TrippleIcon></TrippleIcon>
      <PostCardsSlider posts={posts} customevents={customevents} />
      {/* <LogoCloud></LogoCloud> */}
      <InfiniteImageSlider images={historyImages} />
      {/* <div className="relative isolate h-full ">
        <svg
          className="absolute  inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-brand-accent-4 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
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
        </svg>
        <div
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-brand-accent-4 to-brand-colour-dark opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
          />
        </div>
       
        {/* <div className="overflow-hidden h-full">
          <div className="mt-14 flex justify-end gap-4  sm:justify-start sm:gap-8 sm:pl-20 lg:mt-0 lg:pl-0">
            <div className=" w-vw30 sm:w-44 flex-none space-y-8 sm:mr-0 sm">
              <div className="relative">
                <Image
                  src={
                    historyImages[0].images
                      ? builder.image(historyImages[0].images[1]).url()
                      : ""
                  }
                  alt={historyImages[0].images[1].alt}
                  width={200}
                  height={600}
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="relative">
                <Image
                  src={
                    historyImages[0].images
                      ? builder.image(historyImages[0].images[2]).url()
                      : ""
                  }
                  alt={historyImages[0].images[2].alt}
                  width={200}
                  height={600}
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover  shadow-lg"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
            <div className="w-vw30 sm:w-44 flex-none space-y-8 pt-32 sm:pt-0">
              <div className="relative">
                <Image
                  src={
                    historyImages[0].images
                      ? builder.image(historyImages[0].images[3]).url()
                      : ""
                  }
                  alt={historyImages[0].images[3].alt}
                  width={200}
                  height={600}
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="relative">
                <Image
                  src={
                    historyImages[0].images
                      ? builder.image(historyImages[0].images[4]).url()
                      : ""
                  }
                  alt={historyImages[0].images[4].alt}
                  width={200}
                  height={600}
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
          </div>
        </div> */}
    </SiteLayout>
  );
}
