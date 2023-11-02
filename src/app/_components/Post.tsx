import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/sanity.client";
import SiteLayout from "./SiteLayout";
import { PostPageProps, PostorEventItem } from "@/types/componentTypes";

const builder = imageUrlBuilder(client);
const imageSize = 800;
const imageWidth = 1200;
const imageHeight = imageSize;

function renderImage(item: PostorEventItem) {
  const image = item.coverImage || item.eventImage;
  return image ? (
    <Image
      className="float-left m-0 w-1/3 mr-4 rounded-lg"
      src={builder.image(image).width(imageWidth).height(imageHeight).url()}
      width={imageWidth}
      height={imageHeight}
      alt={image?.alt}
    />
  ) : null;
}

function renderContent(item: PostorEventItem) {
  const content = item.content;
  return content ? <PortableText value={content} /> : null;
}

export default function Post({ post, customevent, preview }: PostPageProps) {
  const item: PostorEventItem | null = post || customevent || null;
  if (!item) return null;
  const title = item.title || "undefined title";

  return (
    <SiteLayout preview={preview}>
      <h1 className="my-12 text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl md:leading-none lg:text-7xl">
        {title}
      </h1>
      {renderImage(item)}
      {renderContent(item)}
    </SiteLayout>
  );
}
