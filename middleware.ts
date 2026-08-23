import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isDownload = pathname.startsWith("/download");
  if (!isDownload) return NextResponse.next();
  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const tier = (req.auth.user as unknown as { tier?: string })?.tier ?? "free";
  if (tier === "free") {
    return NextResponse.redirect(new URL("/pricing", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/download/:path*"],
};
