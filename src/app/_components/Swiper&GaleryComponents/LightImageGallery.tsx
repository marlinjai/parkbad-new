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

export default function LightImageGallery({ images }: LightImageGalleryProps) {
  // Sort images by takenAt date if available, newest first
  const sortedImages = [...images].sort((a, b) => {
    // Try to use takenAt date for sorting if available
    const dateA = a.takenAt || '';
    const dateB = b.takenAt || '';
    // Sort descending (newest first)
    return dateB.localeCompare(dateA);
  });
  
  // State to track which images should be visible and which are loaded
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set([0, 1, 2, 3])); // First few initially visible
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isLightGalleryInitialized, setIsLightGalleryInitialized] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize lightgallery
  const onInit = () => {
    console.log("LightGallery has been initialized");
    setIsLightGalleryInitialized(true);
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
      root: null, // Use viewport as root
      rootMargin: '100px', // Start loading 100px before entering viewport
      threshold: 0.01 // Trigger when even 1% is visible
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
      if (ref && index >= 4) { // Skip the first 4 as they're loaded eagerly
        observer.observe(ref);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full gap-4 columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgZoom, lgThumbnail]}
        elementClassNames="my-gallery"
        mode="lg-fade"
        selector=".gallery-item"
        download={false}
        counter={true}
        subHtmlSelectorRelative={true}
      >
        {sortedImages.map((image, index) => {
          // Get image dimensions from metadata if available
          const width = image.asset?.metadata?.dimensions?.width || 800;
          const height = image.asset?.metadata?.dimensions?.height || 600;
          // Get low quality placeholder if available
          const lqip = image.asset?.metadata?.lqip;
          const isVisible = visibleImages.has(index);
          const isLoaded = loadedImages[index];
          
          return (
            <div 
              key={index}
              ref={el => imageRefs.current[index] = el}
              data-index={index}
              className="mb-4 relative overflow-hidden"
              style={{ breakInside: 'avoid' }}
            >
              <a 
                className={`gallery-item block overflow-hidden rounded-lg shadow-lg transform transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                href={builder.image(image).url()}
                data-sub-html={`<h4>${image.alt || ''}</h4><p>${image.caption || ''}</p>`}
                style={{ 
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  transitionDelay: `${Math.min(index * 0.05, 0.5)}s` // Staggered animation
                }}
              >
                <div className="relative" style={{ aspectRatio: `${width}/${height}` }}>
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
                            transform: 'scale(1.1)' // Slightly enlarged to cover blur edges
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
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 4}
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
      </LightGallery>
      
      {sortedImages.length === 0 && (
        <div className="col-span-full p-8 text-center text-gray-500">
          Keine Bilder in der Galerie vorhanden.
        </div>
      )}
    </div>
  );
}
