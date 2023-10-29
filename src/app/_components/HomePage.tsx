// ./nextjs-app/app/_components/Posts.tsx

import Link from "next/link";
import type { SanityDocument } from "@sanity/client";
import SiteLayout from "./SiteLayout";

export default function HomePage({
  posts = [],
  preview,
}: {
  posts: SanityDocument[];
  preview: boolean;
}) {
  const title = posts.length === 1 ? `1 Post` : `${posts.length} Posts`;

  return (
    <SiteLayout preview={preview}>
      <h1 className="text-2xl p-4 font-bold">{title}</h1>
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`${post.slug.current}`}
          className="p-4 hover:bg-blue-50"
        >
          <h2>{post.title}</h2>
        </Link>
      ))}
    </SiteLayout>
  );
}
