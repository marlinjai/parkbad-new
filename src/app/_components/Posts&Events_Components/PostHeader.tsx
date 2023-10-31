import { PostType } from "@/types/sanityTypes";
import Avatar from "@/app/_components/Posts&Events_Components/AuthorAvatar";

import Date from "@/app/_components/Posts&Events_Components/PostDate";
import PostTitle from "@/app/_components/Posts&Events_Components/PostTitle";
import PostImage from "@/app/_components/Posts&Events_Components/PostImage";

export default function PostHeader(
  props: Pick<PostType, "title" | "coverImage" | "date" | "author" | "slug">
) {
  const { title, coverImage, date, author, slug } = props;
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
      <div className="mb-8 rounded-2xl sm:mx-0 md:mb-16">
        <PostImage title={title} image={coverImage} priority slug={slug} />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 text-lg">
          <Date dateString={date} />
        </div>
      </div>
    </>
  );
}
