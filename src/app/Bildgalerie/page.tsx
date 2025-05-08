import { sanityFetch } from "@/sanity/lib/sanity.fetch";
import SiteLayout from "../_components/UtilityComponents/SiteLayout";
import { Gallery } from "@/types/sanityTypes";
import { zoomGalleryQuery } from "@/sanity/lib/sanity.queries";
import LightImageGallery from "../_components/Swiper&GaleryComponents/LightImageGallery";
import SectionBackground from "../_components/UtilityComponents/SectionBackground";

// Generate static params at build time but revalidate every 4 hours
export const revalidate = 14400; // 4 hours in seconds

// Generate metadata for the page
export async function generateMetadata() {
  return {
    title: 'Bildgalerie | Parkbad Gütersloh',
    description: 'Impressionen aus dem Parkbad Gütersloh - Entdecken Sie unsere Bildergalerie.'
  };
}

// Pre-calculate image dimensions and optimize data at build time
async function optimizeGalleryData(galleryData: Gallery[]) {
  if (!galleryData || !galleryData.length) return null;

  const firstGallery = galleryData[0];
  
  // Pre-calculate image dimensions and optimize data
  const optimizedImages = firstGallery.images.map(image => ({
    ...image,
    // Ensure we have dimensions for all images
    asset: {
      ...image.asset,
      metadata: {
        ...image.asset.metadata,
        dimensions: image.asset.metadata?.dimensions || {
          width: 800,
          height: 600,
          aspectRatio: 1.33
        }
      }
    }
  }));

  return {
    ...firstGallery,
    images: optimizedImages
  };
}

export default async function Bildgalerie() {
  const galleryData = await sanityFetch<Gallery[]>({ 
    query: zoomGalleryQuery,
    revalidate: revalidate
  });

  if (!galleryData || !galleryData.length) {
    return (
      <SiteLayout>
        <SectionBackground>
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
            <h2 className="text-center text-brand-colour-light mt-pz5 text-2sc mb-4">
              Bildgalerie
            </h2>
            <p className="text-center text-gray-500">
              Derzeit sind keine Bilder in der Galerie verfügbar.
            </p>
          </div>
        </SectionBackground>
      </SiteLayout>
    );
  }

  // Optimize the gallery data
  const optimizedGallery = await optimizeGalleryData(galleryData);

  if (!optimizedGallery) {
    return (
      <SiteLayout>
        <SectionBackground>
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
            <h2 className="text-center text-brand-colour-light mt-pz5 text-2sc mb-4">
              Bildgalerie
            </h2>
            <p className="text-center text-gray-500">
              Derzeit sind keine Bilder in der Galerie verfügbar.
            </p>
          </div>
        </SectionBackground>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <SectionBackground>
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="text-center text-brand-colour-light mt-pz5 text-2sc">
            Bildgalerie
          </h2>
        </div>
        <div className="p-4 md:p-12 xl:p-20 flex flex-wrap justify-center">
          <LightImageGallery images={optimizedGallery.images} />
        </div>
      </SectionBackground>
    </SiteLayout>
  );
}
