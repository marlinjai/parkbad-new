// ./nextjs-app/app/_components/Posts.tsx

import Link from "next/link";
import SiteLayout from "./SiteLayout";
import { HomePageProps } from "@/types/componentTypes";

export default function HomePage({
  posts,
  customevents,
  preview,
}: HomePageProps) {
  const title = posts.length === 1 ? `1 Post` : `${posts.length} Posts`;

  return (
    <SiteLayout preview={preview}>
      <h1 className="text-2xl p-4 font-bold">{title}</h1>
      {posts.map((post) => (
        <Link key={post._id} href={`${post.slug.current}`} className="m-4 p-4">
          <h2 className="hover:bg-white hover:text-black">{post.title}</h2>
        </Link>
      ))}
    </SiteLayout>
  );
}
