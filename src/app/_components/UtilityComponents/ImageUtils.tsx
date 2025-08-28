// src/app/_components/UtilityComponents/ImageUtils.tsx

/**
 * Utility functions for image handling and alt text fallbacks
 */

/**
 * Provides default alt text based on image context or folder type
 * @param originalAlt - The original alt text from the image
 * @param context - The context where the image is used (gallery, history, hero, etc.)
 * @param folder - Optional folder name for art folder images
 * @returns A fallback alt text if original is missing
 */
export function getImageAltText(
  originalAlt?: string, 
  context: 'gallery' | 'history' | 'hero' | 'celebration' | 'art' | 'post' | 'general' = 'general',
  folder?: string
): string {
  if (originalAlt && originalAlt.trim()) {
    return originalAlt;
  }

  // Default fallbacks based on context
  const contextFallbacks = {
    gallery: 'Gallery image',
    history: 'Historic image',
    hero: 'Hero image', 
    celebration: 'Celebration image',
    art: folder ? `Art from ${folder} collection` : 'Art image',
    post: 'Post image',
    general: 'Image'
  };

  return contextFallbacks[context];
}

/**
 * Provides default folder-based alt text for art images
 * @param originalAlt - The original alt text
 * @param folderName - The art folder name
 * @returns Descriptive alt text for art folder images
 */
export function getArtFolderAltText(originalAlt?: string, folderName?: string): string {
  if (originalAlt && originalAlt.trim()) {
    return originalAlt;
  }

  if (folderName) {
    // Convert folder names to more descriptive text
    const folderDescriptions: Record<string, string> = {
      'paintings': 'Painting artwork',
      'sculptures': 'Sculpture artwork', 
      'photography': 'Photography artwork',
      'digital': 'Digital artwork',
      'mixed-media': 'Mixed media artwork',
      'watercolor': 'Watercolor painting',
      'oil': 'Oil painting',
      'acrylic': 'Acrylic painting'
    };

    return folderDescriptions[folderName.toLowerCase()] || `Artwork from ${folderName} collection`;
  }

  return 'Artwork';
}

/**
 * Type definitions for image contexts
 */
export type ImageContext = 'gallery' | 'history' | 'hero' | 'celebration' | 'art' | 'post' | 'general';
