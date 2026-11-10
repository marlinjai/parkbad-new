import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';

// This file defines robot crawling rules for search engines
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',    // Disallow admin panel
        '/api/',      // Disallow API routes
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
} 