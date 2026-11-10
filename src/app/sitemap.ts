import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/siteUrl';

// This file generates a sitemap.xml file for search engines
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

export default function sitemap(): MetadataRoute.Sitemap {
  // Main pages of your site
  const mainPages = [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: absoluteUrl('/Neuigkeiten&Events'),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl('/Essen&Trinken'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl('/Feiern&Tagen'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl('/Bildgalerie'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl('/Historie&Kontakt'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return mainPages;
} 