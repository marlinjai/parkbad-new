// src/app/_components/Posts&Events_Components/PreviewArchive.tsx

"use client";

import { CustomEvent, PostType } from "@/types/sanityTypes";
import Archive from "./Archive";

// Temporarily disabled preview functionality for Next.js 15 compatibility
export default function PreviewArchive({
  posts = [],
  events = [],
}: {
  posts: PostType[];
  events: CustomEvent[];
}) {
  // TODO: Re-implement preview functionality when next-sanity preview is compatible
  return <Archive posts={posts} events={events} />;
}
