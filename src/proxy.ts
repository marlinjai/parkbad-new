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

export const config = {
  // Only page paths; static assets, the image optimiser, API routes and the
  // Studio never carry an encoded ampersand.
  matcher: ["/((?!_next/|api/|admin|favicon|.*\\.[a-z0-9]+$).*)"],
};
