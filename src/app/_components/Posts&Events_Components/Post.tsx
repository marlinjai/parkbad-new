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
import PostDate from "./PostDate";

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
  const image = item.coverImage || (item.eventImage && item.eventImage.asset);
  return image ? (
    <div className="relative mx-auto w-full h-vh60 md:h-vh60">
      <Image
        src={builder.image(image).url()}
        alt={image?.alt || "Image"}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute inset-0 flex top-pz45 flex-col justify-center items-center gap-2 text-white text-center">
        <h1 className="mx-pz15 text-4sc font-bold leading-tight tracking-tighter md:text-6xl md:leading-none">
          {item.title || item.eventTitle || "No title"}
        </h1>
        {item.author && (
          <AuthorAvatar name={item.author.name} picture={item.author.picture} />
        )}
        <div className="text-date leading-tight tracking-tighter">
          {renderDate(item)}
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
  return (
    <PortableText
      value={item.content || item.eventContent}
      components={{
        types: {
          image: MyImage,
        },
        block: {
          normal: ({ children }) => (
            <p className="text-justify text-xl leding-6 my-4">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className=" text-center font-semibold my-8 text-2xl">
              {children}
            </h6>
          ),
          // Define more custom components for different styles if needed
        },
      }}
    />
  );
}

function renderDate(item: PostorEventItem) {
  const date = item.date || "";
  const start = item.eventStart || "";
  const end = item.eventEnd || "";
  return (
    <div>
      <PostDate dateString={date || start} />
      {end && (
        <>
          <span> - </span>
          <PostDate dateString={end} />
        </>
      )}
    </div>
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
