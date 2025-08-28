// src/app/_components/UtilityComponents/PreviewProvider.tsx

"use client";

// Temporarily disabled preview functionality for Next.js 15 compatibility
export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token?: string;
}) {
  // TODO: Re-implement preview functionality when next-sanity preview is compatible
  // For now, just render children without preview functionality
  return <>{children}</>;
}
