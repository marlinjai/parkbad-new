import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/sanity.client";
import SiteLayout from "../UtilityComponents/SiteLayout";
import { PostPageProps, PostorEventItem } from "@/types/componentTypes";
import AuthorAvatar from "./AuthorAvatar";
import PostDate from "./PostDate";
import { PortableText, PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

// Define a more specific type for the block components
interface BlockProps {
  children: React.ReactNode;
}
// Define a type for your custom image component props
interface MyImageProps {
  value: {
    asset: {
      _ref?: string;
      url: string;
    };
    alt?: string;
    caption?: string;
  };
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
      <img
        src={imageUrl}
        alt={value.alt || " "}
        className="rounded-lg shadow-lg mb-4 max-w-full h-auto block mt-8 ml-auto mr-auto"
      />
      {value.caption && (
        <figcaption className="text-center">{value.caption}</figcaption>
      )}
    </figure>
  );
}

function renderContent(item: PostorEventItem) {
  const content = item.content || item.eventContent;

  const components: PortableTextComponentProps = {
    types: {
      image: MyImage,
    },
    block: {
      normal: ({ children }: BlockProps) => (
        <p className=" text-justify text-xl  leading-8">{children}</p>
      ),
      h1: ({ children }: BlockProps) => (
        <h1 className=" text-justify text-3xl font-semibold">{children}</h1>
      ),
      h2: ({ children }: BlockProps) => (
        <h2 className=" text-justify text-3xl my-8 font-semibold">
          {children}
        </h2>
      ),
      h3: ({ children }: BlockProps) => (
        <h3 className=" text-justify text-3xl my-8 font-semibold">
          {children}
        </h3>
      ),
      h4: ({ children }: BlockProps) => (
        <h4 className=" text-justify text-2xl my-8 font-semibold">
          {children}
        </h4>
      ),
      h5: ({ children }: BlockProps) => (
        <h5 className=" text-justify text-2xl my-8 font-semibold">
          {children}
        </h5>
      ),
      h6: ({ children }: BlockProps) => (
        <h6 className=" text-justify text-2xl my-8 font-semibold">
          {children}
        </h6>
      ),
    },
  };

  return content ? (
    <PortableText value={content} components={components} />
  ) : null;
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
