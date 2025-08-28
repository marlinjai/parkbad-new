import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.enable();
  const slug = request.nextUrl.searchParams.get("slug");
  console.log(slug);

  if (slug) {
    const redirectUrl = new URL(`/${slug}`, request.url as string);
    return NextResponse.redirect(redirectUrl.toString());
  } else {
    return NextResponse.redirect(
      new URL("/", request.url as string).toString()
    );
  }
}
