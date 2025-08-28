// ./nextjs-app/app/_components/PreviewHomePage.tsx
// src/app/_components/Homepage_Components/PreviewHomePage.tsx

"use client";

import HomePage from "@/app/_components/Homepage_Components/HomePage";
import { CustomEvent, Gallery, PostType } from "@/types/sanityTypes";

// Temporarily disabled preview functionality for Next.js 15 compatibility
export default function PreviewHomePage({
  posts = [],
  customevents = [],
  historyImages = [],
  preview,
}: {
  posts: PostType[];
  customevents: CustomEvent[];
  preview: boolean;
  historyImages: Gallery[];
}) {
  // TODO: Re-implement preview functionality when next-sanity preview is compatible
  return (
    <HomePage
      posts={posts}
      preview={preview}
      customevents={customevents}
      historyImages={historyImages}
    />
  );
}
