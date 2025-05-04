import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { token } from "@/sanity/lib/sanity.fetch";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE,
  description: "Die ofizielle Seite des Parkbads Gütersloh",
};

const PreviewProvider = dynamic(
  () => import("./_components/UtilityComponents/PreviewProvider")
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical assets for faster LCP */}
        <link rel="preload" as="image" href="/video-bg.png" fetchPriority="high" />
      </head>
      <body className="no-scrollbar overflow-x-hidden disable-scrolling-horizontal w-screen bg-brand-accent-4 ${inter.className} ">
        {draftMode().isEnabled ? (
          <>
            <PreviewProvider token={token}>{children}</PreviewProvider>
          </>
        ) : (
          <>
            {children}
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
