"use client";

import React, { useEffect, useState, useRef } from "react";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";

import { GalleryImage } from "@/types/sanityTypes";
import { urlForImage } from "@/sanity/lib/sanity.image";
import { client } from "@/sanity/lib/sanity.client";
import Image from "next/image";

const builder = urlForImage(client);

interface LightImageGalleryProps {
  images: GalleryImage[];
}

// Create a simple, clean masonry grid using CSS grid
export default function LightImageGallery({ images }: LightImageGalleryProps) {
  const galleryImages = images;
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]));
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize lightgallery
  const onInit = () => {
    console.log("LightGallery has been initialized");
  };
  
  // Track when an image loads
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
  // Set up intersection observer for better lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          
          // Mark as visible
          setVisibleImages(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
          });
          
          // Unobserve after it's marked visible
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe all image containers except the first few which are visible by default
    imageRefs.current.forEach((ref, index) => {
      if (ref && index >= 9) {
        observer.observe(ref);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Fix: Process images without circular reference
  const processImages = () => {
    // First, analyze all images to understand the distribution of aspect ratios
    const aspectRatios = galleryImages.map(image => {
      const width = image.asset?.metadata?.dimensions?.width || 800;
      const height = image.asset?.metadata?.dimensions?.height || 600;
      return width / height;
    });
    
    // We'll use the overall distribution to make better decisions about which images to feature
    const totalImages = aspectRatios.length;
    
    // Track the previous span to avoid problematic layouts
    let prevColSpan = 1;
    let lastFeaturedIndex = -5; // Track when we last featured an image
    
    // Calculate how many images to feature based on total count
    // Higher percentage for smaller galleries, lower for larger ones
    const featurePercentage = Math.max(0.25, Math.min(0.4, 1 - totalImages / 100));
    const targetFeatureCount = Math.ceil(totalImages * featurePercentage);
    
    // Ensure equal distribution by dividing gallery into sections
    const sections = 4; // Beginning, early-middle, late-middle, end
    const sectionSize = Math.ceil(totalImages / sections);
    const targetFeaturesPerSection = Math.ceil(targetFeatureCount / sections);
    
    // Keep track of features in each section to ensure balance
    const sectionFeatureCounts = Array(sections).fill(0);
    
    // Map images with layout information
    return galleryImages.map((image, index) => {
      const width = image.asset?.metadata?.dimensions?.width || 800;
      const height = image.asset?.metadata?.dimensions?.height || 600;
      const aspectRatio = width / height;
      
      // Determine which section this image belongs to
      const sectionIndex = Math.min(sections - 1, Math.floor(index / sectionSize));
      
      // Base decision on aspect ratio and position in sequence
      // This helps create a balanced pattern without gaps
      const isVertical = aspectRatio < 0.8;
      const isWide = aspectRatio > 1.5;
      const isVeryWide = aspectRatio > 2.2;
      const isSquarish = aspectRatio >= 0.9 && aspectRatio <= 1.1;
      
      // Determine if this image should span multiple cells
      let colSpan = 1;
      let rowSpan = 1;
      
      // Increase feature probability for different situations
      const distanceFromLastFeature = index - lastFeaturedIndex;
      const needMoreFeaturesInSection = sectionFeatureCounts[sectionIndex] < targetFeaturesPerSection;
      const atLeastSomeSpacingSinceLastFeature = distanceFromLastFeature > 3;
      
      // Increase chance of featuring in under-represented sections
      // Late sections should get more features if they're under-represented
      const lateSection = sectionIndex >= sections / 2;
      const sectionWeight = lateSection && needMoreFeaturesInSection ? 1.5 : 1;
      
      // Higher chance of featuring for end section images
      const endSectionBoost = sectionIndex === sections - 1 ? 0.3 : 0;
      
      // Create a more predictable pattern for feature images with better distribution
      const shouldFeature = (
        // Feature vertical images regularly with higher chance in later sections
        (isVertical && (index % 4 === 0 || (lateSection && index % 3 === 0))) || 
        // Feature very wide images always
        isVeryWide ||
        // Feature some square images occasionally, more in later sections
        (isSquarish && (index % 7 === 0 || (lateSection && index % 5 === 0))) ||
        // Feature some based on position - ensure distribution across gallery
        (atLeastSomeSpacingSinceLastFeature && 
          ((index % (6 - sectionIndex) === 0) || Math.random() < (0.15 * sectionWeight + endSectionBoost)))
      );
      
      // Apply spans based on aspect ratio and whether this should be featured
      if (shouldFeature) {
        // Very wide images get 2 columns
        if (isVeryWide || (isWide && index % 3 === 0)) {
          colSpan = 2;
        }
        
        // Vertical images get 2 rows
        if (isVertical) {
          rowSpan = 2;
        }
        
        // Special case: some square-ish images become 2x2 features
        // Higher chance in bottom half of gallery for balance
        if (isSquarish && (index % 10 === 0 || (lateSection && index % 8 === 0))) {
          colSpan = 2;
          rowSpan = 2;
        }
        
        // Track this as a featured image
        lastFeaturedIndex = index;
        sectionFeatureCounts[sectionIndex]++;
      }
      
      // Ensure we don't have too many double-column images in sequence
      // which can lead to gaps in smaller viewports
      if (prevColSpan === 2 && colSpan === 2 && Math.random() > 0.3) {
        colSpan = 1; // Reduce chance of consecutive wide images
      }
      
      // Remember this column span for the next iteration
      prevColSpan = colSpan;
      
      return {
        image,
        colSpan,
        rowSpan,
        aspectRatio,
        index
      };
    });
  };

  // Get the processed images
  const processedImages = processImages();

  // For empty gallery case
  if (galleryImages.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        Keine Bilder in der Galerie vorhanden.
      </div>
    );
  }

  return (
    <div className="w-full">
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgZoom, lgThumbnail]}
        elementClassNames="gallery-container"
        mode="lg-fade"
        selector=".gallery-item"
        download={false}
        counter={true}
        subHtmlSelectorRelative={true}
      >
        {/* We use grid-flow-dense to fill in any gaps in the grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-[250px] grid-flow-dense">
          {processedImages.map(({ image, colSpan, rowSpan, aspectRatio, index }) => {
            const width = image.asset?.metadata?.dimensions?.width || 800;
            const height = image.asset?.metadata?.dimensions?.height || 600;
            const lqip = image.asset?.metadata?.lqip;
            const isVisible = visibleImages.has(index);
            const isLoaded = loadedImages[index];
            
            // Calculate column and row span classes
            const spanClasses = `${
              colSpan === 2 ? 'col-span-1 sm:col-span-2' : 'col-span-1'
            } ${
              rowSpan === 2 ? 'row-span-2' : 'row-span-1'
            }`;
            
            return (
              <div
                key={index}
                ref={el => imageRefs.current[index] = el}
                data-index={index}
                className={`${spanClasses} overflow-hidden transition-opacity duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: `${Math.min(index * 0.05, 0.5)}s`,
                }}
              >
                <a
                  className="gallery-item block w-full h-full overflow-hidden rounded-lg shadow-lg transform transition-all duration-500"
                  href={builder.image(image).url()}
                  data-src={builder.image(image).url()}
                  data-sub-html={`<h4>${image.alt || ''}</h4><p>${image.caption || ''}</p>`}
                  data-lg-size={`${width}-${height}`}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {/* Placeholder while loading */}
                    {isVisible && !isLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                        {lqip ? (
                          <div 
                            className="w-full h-full" 
                            style={{ 
                              backgroundImage: `url(${lqip})`, 
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'blur(10px)',
                              transform: 'scale(1.1)'
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 border-4 border-gray-300 border-t-brand-colour rounded-full animate-spin" />
                        )}
                      </div>
                    )}
                    
                    {/* Only render the image if it should be visible */}
                    {isVisible && (
                      <Image
                        alt={image.alt || `Gallery image ${index + 1}`}
                        src={builder.image(image).url()}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        width={width}
                        height={height}
                        loading={index < 9 ? "eager" : "lazy"}
                        priority={index < 9}
                        onLoad={() => handleImageLoad(index)}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                        }`}
                      />
                    )}
                    
                    {/* Caption overlay that appears on hover */}
                    {(image.caption || image.takenAt) && isLoaded && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm opacity-0 hover:opacity-100 transition-opacity">
                        {image.caption && <p className="line-clamp-1">{image.caption}</p>}
                        {image.takenAt && (
                          <p className="text-xs opacity-75">
                            {new Date(image.takenAt).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </LightGallery>
    </div>
  );
}
