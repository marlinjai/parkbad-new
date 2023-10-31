import cn from "classnames";
import { urlForImage } from "@/sanity/lib/sanity.image";
import Image from "next/image";
import Link from "next/link";
import { PostImageProps } from "@/types/componentTypes";

export default function PostImage(props: PostImageProps) {
  const { title, slug, image: source, priority, width, height, fit } = props;
  const finalWidth = width ? width : 500;
  const finalHeight = height ? height : 500;

  const image = source?.asset?._ref ? (
    <div
      className={cn("shadow-small ", {
        "transition-shadow  duration-200 hover:shadow-medium": slug,
      })}
    >
      <Image
        className="h-auto w-full"
        width={finalWidth}
        height={finalHeight}
        alt={`Cover Image for ${title}`}
        src={urlForImage(source).height(finalHeight).width(finalWidth).url()}
        sizes="100vw"
        priority={priority}
        style={{ objectFit: fit || "fill" }} // Use the fit prop if provided, otherwise default to 'fill'
      />
    </div>
  ) : (
    <div style={{ paddingTop: "50%", backgroundColor: "#ddd" }} />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          <div className="image-container">
            {/* Add the overlay div for gradient */}
            <div className="image-overlay" />
            {image}
          </div>
        </Link>
      ) : (
        <div className="image-container">
          {/* Add the overlay div for gradient */}
          <div className="image-overlay" />
          {image}
        </div>
      )}
    </div>
  );
}
