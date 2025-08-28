// ./nextjs-app/app/components/PreviewPost.tsx
// src/app/_components/Posts&Events_Components/PreviewPost.tsx

"use client";

import Post from "@/app/_components/Posts&Events_Components/Post";
import { CustomEvent, PostType } from "@/types/sanityTypes";

// Temporarily disabled preview functionality for Next.js 15 compatibility
export default function PreviewPost({
  post,
  customevent,
  preview,
}: {
  post: PostType;
  customevent: CustomEvent;
  preview: boolean;
}) {
  // TODO: Re-implement preview functionality when next-sanity preview is compatible
  return <Post preview={preview} post={post} customevent={customevent} />;
}
