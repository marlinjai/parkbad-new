// ./nextjs-app/app/_components/Post.tsx

"use client";

import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/sanity.client";
import { PostType } from "@/types/sanityTypes";

const builder = imageUrlBuilder(client);

export default function Post({ post }: { post: PostType }) {
  return (
    <main className="container prose prose-lg p-4">
      <h1>{post.title}</h1>
      {post?.coverImage ? (
        <Image
          className="float-left m-0 w-1/3 mr-4 rounded-lg"
          src={builder.image(post.coverImage).width(300).height(300).url()}
          width={300}
          height={300}
          alt={post?.coverImage?.alt}
        />
      ) : null}
      {post?.content ? <PortableText value={post.content} /> : null}
    </main>
  );
}
