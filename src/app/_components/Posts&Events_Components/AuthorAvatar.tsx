import { urlForImage } from "@/sanity/lib/sanity.image";
import { Author } from "@/types/sanityTypes";

import Image from "next/image";

export default function AuthorAvatar(props: Author) {
  const { name, picture } = props;
  return (
    <div className="flex justify-center items-center flex-row">
      <div className="mr-2 h-12 w-12">
        <Image
          src={
            picture?.asset?._ref
              ? urlForImage(picture).height(96).width(96).fit("crop").url()
              : "https://source.unsplash.com/96x96/?face"
          }
          className="rounded-full"
          height={96}
          width={96}
          alt={picture.alt ?? name}
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
      </div>
      <div className="text-3sc font-bold">{name}</div>
    </div>
  );
}
