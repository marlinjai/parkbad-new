// ./nextjs-app/app/_components/Post.tsx

"use client";

import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/sanity.client";
import SiteLayout from "./SiteLayout";
import { PostPageProps } from "@/types/componentTypes";

const builder = imageUrlBuilder(client);

export default function Post({ post, customevent, preview }: PostPageProps) {
  return (
    <SiteLayout preview={preview}>
      <h1>
        {post
          ? post.title
          : customevent
          ? customevent.eventTitle
          : "undefined title"}
      </h1>
      {post ? (
        post.coverImage ? (
          <Image
            className="float-left m-0 w-1/3 mr-4 rounded-lg"
            src={builder.image(post.coverImage).width(300).height(300).url()}
            width={300}
            height={300}
            alt={post?.coverImage?.alt}
          />
        ) : null
      ) : customevent ? (
        customevent.eventImage ? (
          <Image
            className="float-left m-0 w-1/3 mr-4 rounded-lg"
            src={builder
              .image(customevent.eventImage)
              .width(300)
              .height(300)
              .url()}
            width={300}
            height={300}
            alt={customevent.eventImage?.alt}
          />
        ) : null
      ) : null}
      {post?.content ? <PortableText value={post.content} /> : null}
    </SiteLayout>
  );
}
