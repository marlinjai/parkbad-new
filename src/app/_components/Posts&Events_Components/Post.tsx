import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/sanity.client";
import SiteLayout from "../UtilityComponents/SiteLayout";
import { PostPageProps, PostorEventItem } from "@/types/componentTypes";
import AuthorAvatar from "./AuthorAvatar";
import PostDate from "./PostDate";

const builder = imageUrlBuilder(client);
const imageSize = 800;
const imageWidth = 1200;
const imageHeight = imageSize;

function renderImage(item: PostorEventItem) {
  const image = item.coverImage || (item.eventImage && item.eventImage.asset);

  console.log("Image in post", item.eventImage);

  return image ? (
    <div className="relative mx-auto w-full h-vh60 md:h-vh90">
      <Image
        src={builder.image(image).url()}
        alt={image?.alt}
        fill={true}
        priority={true}
        style={{
          objectFit: "cover",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute inset-0 flex top-pz45 flex-col justify-center items-center gap-2 text-white text-center">
        <h1 className=" mx-pz15 text-4sc font-bold leading-tight tracking-tighter md:text-6xl md:leading-none ">
          {item.title || item.eventTitle || "No title"}
        </h1>
        {item.author && (
          <AuthorAvatar name={item.author.name} picture={item.author.picture} />
        )}
        <div className=" text-date leading-tight tracking-tighter">
          {renderDate(item)}
        </div>
      </div>
    </div>
  ) : null;
}

function renderContent(item: PostorEventItem) {
  const content = item.content || item.eventContent;
  return content ? <PortableText value={content} /> : null;
}

function renderDate(item: PostorEventItem) {
  const date = item.date;
  const start = item.eventStart;
  const end = item.eventEnd;
  return date ? (
    <PostDate dateString={date} />
  ) : (
    <div className="flex justify-center">
      <PostDate dateString={start} />
      <p className="mx-2"> - </p>
      <PostDate dateString={end} />
    </div>
  );
}

export default function Post({ post, customevent, preview }: PostPageProps) {
  const itemToShow: PostorEventItem | null = post || customevent || null;
  if (!itemToShow) return null;

  console.log("Item in postpage", itemToShow);
  console.log("Post in postpage", itemToShow.eventImage);

  return (
    <SiteLayout preview={preview}>
      <article className="flex items-center flex-col">
        {renderImage(itemToShow)}
        <div className="m-10 text-brand-colour-light w-pz80 md:w-pz60">
          {renderContent(itemToShow)}
        </div>
      </article>
    </SiteLayout>
  );
}
