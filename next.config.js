/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Next 16 only allows quality 75 by default; videoSection renders its
    // placeholder image (/video-bg.webp) at quality 85.
    qualities: [75, 85],
  },
};

module.exports = nextConfig;
