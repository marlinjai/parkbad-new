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
  const image = item.coverImage || item.eventImage;
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
          {item.title || "undefined title"}
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
  const content = item.content;
  return content ? <PortableText value={content} /> : null;
}

function renderDate(item: PostorEventItem) {
  const date = item.date;
  const start = item.eventStart;
  const end = item.eventEnd;
  return date ? (
    <PostDate dateString={date} />
  ) : (
    <div className="flex justify-center flex-col">
      <PostDate dateString={start} />
      <p> - </p>
      <PostDate dateString={end} />
    </div>
  );
}

export default function Post({ post, customevent, preview }: PostPageProps) {
  const item: PostorEventItem | null = post || customevent || null;
  if (!item) return null;

  return (
    <SiteLayout preview={preview}>
      <article className="flex items-center flex-col">
        {renderImage(item)}
        <div className="m-10 text-brand-colour-light w-pz80 md:w-pz60">
          {renderContent(item)}
        </div>
      </article>
    </SiteLayout>
  );
}
