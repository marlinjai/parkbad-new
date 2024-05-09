"use client";

import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import {
  PortableTextBlock,
  PortableTextSpan,
  PortableTextMarkDefinition,
} from "@portabletext/types";
import { client } from "@/sanity/lib/sanity.client";
import SiteLayout from "../UtilityComponents/SiteLayout";
import { PostPageProps, PostorEventItem } from "@/types/componentTypes";
import AuthorAvatar from "./AuthorAvatar";
import { getCroppedImageSrc } from "../UtilityComponents/GetCroppedImageSrc";
import renderDate from "../Homepage_Components/RenderDate";

// Define interfaces for any custom block types
interface MyImageBlock extends PortableTextBlock {
  _type: "image";
  asset: {
    _ref: string;
    url: string;
  };
  alt?: string;
  caption?: string;
}

type CustomPortableTextBlock =
  | MyImageBlock
  | PortableTextBlock<PortableTextMarkDefinition, PortableTextSpan>;

// Custom image component props
interface MyImageProps {
  value: MyImageBlock;
  index: number;
}

const builder = imageUrlBuilder(client);

function renderImage(item: PostorEventItem) {
  const image = item.coverImage || item.eventImage;

  console.log("outer image", image);
  return image ? (
    <div className="relative mx-auto w-full h-vh45 md:h-vh70 p-4 sm:p-0">
      <Image
        src={getCroppedImageSrc(image)}
        alt={image?.alt || "Image"}
        layout="fill"
        className=" object-cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className=" absolute inset-0 flex top-pz45 flex-col justify-center items-center gap-2 text-white text-center">
        <div className="flex gap-2 flex-col justify-center items-center">
          <h1 className=" text-center text-4sc font-bold leading-tight tracking-tighter md:text-6xl md:leading-none">
            {item.title || item.eventTitle || "No title"}
          </h1>
          {item.author && (
            <AuthorAvatar
              name={item.author.name}
              picture={item.author.picture}
            />
          )}
          <div className="text-date text-center mb-1 leading-tight tracking-tighter">
            {renderDate(item)}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function MyImage({ value, index }: MyImageProps) {
  const imageUrl = builder.image(value.asset).url();
  const orientationClass =
    index % 2 === 0 ? "float-left mr-4" : "float-right ml-4";

  return (
    <figure className={`${orientationClass} w-full md:w-1/2`}>
      <Image
        src={imageUrl}
        alt={value.alt || " "}
        className="rounded-lg shadow-lg mb-4 w-full h-auto block mt-8"
      />
      {value.caption && (
        <figcaption className="text-center">{value.caption}</figcaption>
      )}
    </figure>
  );
}

function renderContent(item: PostorEventItem) {
  console.log("item", item);
  return (
    <PortableText
      value={item.content || item.eventContent}
      components={{
        types: {
          image: MyImage,
        },
        block: {
          normal: ({ children }) => (
            <p className="text-left text-xl leding-6 my-4">{children}</p>
          ),
          normalLeft: ({ children }) => (
            <p className="text-left text-xl leding-6 my-4">{children}</p>
          ),
          normalCenter: ({ children }) => (
            <p className="text-center text-xl leding-6 my-4">{children}</p>
          ),
          normalRight: ({ children }) => (
            <p className="text-right text-xl leding-6 my-4">{children}</p>
          ),
          h1Center: ({ children }) => (
            <h1 className=" text-center font-bold my-8 text-4xl">{children}</h1>
          ),
          h1Left: ({ children }) => (
            <h1 className=" text-left font-bold my-8 text-4xl">{children}</h1>
          ),
          h1Right: ({ children }) => (
            <h1 className=" text-right font-bold my-8 text-4xl">{children}</h1>
          ),
          h2Left: ({ children }) => (
            <h2 className=" text-left font-bold my-8 text-3xl">{children}</h2>
          ),
          h2Center: ({ children }) => (
            <h2 className=" text-center font-bold my-8 text-3xl">{children}</h2>
          ),
          h2Right: ({ children }) => (
            <h2 className=" text-right font-bold my-8 text-3xl">{children}</h2>
          ),
          h3Left: ({ children }) => (
            <h3 className=" text-left font-bold my-8 text-2xl">{children}</h3>
          ),
          h3Center: ({ children }) => (
            <h3 className=" text-center font-bold my-8 text-2xl">{children}</h3>
          ),
          h3Right: ({ children }) => (
            <h3 className=" text-right font-bold my-8 text-2xl">{children}</h3>
          ),
          h4Left: ({ children }) => (
            <h4 className=" text-left font-bold my-8 text-xl">{children}</h4>
          ),
          h4Center: ({ children }) => (
            <h4 className=" text-center font-bold my-8 text-xl">{children}</h4>
          ),
          h4Right: ({ children }) => (
            <h4 className=" text-right font-bold my-8 text-xl">{children}</h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className=" text-center italic my-8">
              {children}
            </blockquote>
          ),
          // Define more custom components for different styles if needed
        },
      }}
    />
  );
}

export default function Post({ post, customevent, preview }: PostPageProps) {
  const itemToShow = post || customevent;
  if (!itemToShow) return null;

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
