/** @type {import('next').NextConfig} */
const nextConfig = {
  // The container image for the Coolify server ships `.next/standalone`. It is
  // switched on only for the Docker build, so the same commit still builds the
  // normal way on Vercel, which stays the rollback until the move is done
  // (infra plans/2026-11-10-vercel-sites-to-coolify.md).
  ...(process.env.DOCKER_BUILD === "true" ? { output: "standalone" } : {}),
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
