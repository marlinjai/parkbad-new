import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodedAmpersandPath } from "@/lib/ampersandPath";

// See src/lib/ampersandPath.ts: keeps the percent-encoded sitemap URLs
// (/Essen%26Trinken) answering 200 on the self-hosted server, as they do on
// Vercel.
export function proxy(request: NextRequest) {
  const target = decodedAmpersandPath(request.nextUrl.pathname);
  if (!target) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

// Only the four ampersand routes, in both spellings, so every other request
// (on Vercel, too) never invokes the proxy at all. Both spellings are listed so
// the match does not depend on whether a host compares the decoded or the raw
// path; this list was verified in the standalone container on 2026-11-11.
export const config = {
  matcher: [
    "/Neuigkeiten&Events/:path*",
    "/Essen&Trinken/:path*",
    "/Feiern&Tagen/:path*",
    "/Historie&Kontakt/:path*",
    "/Neuigkeiten%26Events/:path*",
    "/Essen%26Trinken/:path*",
    "/Feiern%26Tagen/:path*",
    "/Historie%26Kontakt/:path*",
  ],
};
