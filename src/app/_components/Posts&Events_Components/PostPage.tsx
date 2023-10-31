import { notFound } from "next/navigation";
import { Header } from "../Header_Components/Header";
import Footer from "../Footer_Components/Footer";
import { PostType } from "@/types/sanityTypes";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";

export interface PostPageProps {
  preview?: boolean;
  post: PostType;
  morePosts: PostType[];
}

export default function PostPage(props: PostPageProps) {
  const { preview, post } = props;

  const slug = post?.slug;

  if (!slug && !preview) {
    notFound();
  }

  return (
    <>
      {preview && !post ? (
        <h1 className="mb-12 text-center text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-7xl md:leading-none lg:text-8xl">
          loading...
        </h1>
      ) : (
        <>
          <article className="flex w-vw90 flex-col justify-center">
            <PostHeader
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={""}
            />
            <PostBody content={post.content} />
          </article>
        </>
      )}
    </>
  );
}
