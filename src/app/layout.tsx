import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { token } from "@/sanity/lib/sanity.fetch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE,
  description: "Die ofizielle Seite des Parkbads Gütersloh",
};

const PreviewProvider = dynamic(() => import("./_components/PreviewProvider"));

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {draftMode().isEnabled ? (
          <>
            <PreviewProvider token={token}>{children}</PreviewProvider>
          </>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
