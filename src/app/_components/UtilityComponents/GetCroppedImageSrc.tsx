import { getImageDimensions } from "@sanity/asset-utils";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/sanity.client";
import { GalleryImage } from "@/types/sanityTypes";
import { SanityImageQueryResult } from "@/types/componentTypes";

const builder = imageUrlBuilder(client);

export const getCroppedImageSrc = (
  image: SanityImageQueryResult // Details on this type in the appendix
) => {
  // get the image's reference
  const crop = image.crop;

  // get the image's og dimensions
  const dimensions = image.asset?.metadata?.dimensions;

  const width = dimensions?.width;

  const height = dimensions?.height;

  if (Boolean(crop)) {
    // compute the cropped image's area
    const croppedWidth = Math.floor(width * (1 - (crop.right + crop.left)));

    const croppedHeight = Math.floor(height * (1 - (crop.top + crop.bottom)));

    // compute the cropped image's position
    const left = Math.floor(width * crop.left);
    const top = Math.floor(height * crop.top);

    // gather into a url

    return builder
      .image(image)
      .rect(left, top, croppedWidth, croppedHeight)
      .url();
  }

  return builder.image(image).url();
};
