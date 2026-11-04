import { NextResponse, type NextRequest } from "next/server";
import { FBC_COOKIE, fbcFromClickId } from "@/lib/meta-capi";

/**
 * Remembers a Meta ad click. An ad usually lands on a page other than /line, and
 * the `fbclid` in that URL is gone by the time the visitor taps "Chat on LINE".
 * Saving it as `_fbc` (the Meta Pixel's own cookie format) lets /line attribute
 * its Conversions API event back to the ad. The Pixel writes the same cookie
 * when it loads; this covers visitors whose ad blocker stops it.
 *
 * The matcher only lets requests carrying `fbclid` in, so ordinary traffic never
 * runs this.
 */
export function proxy(request: NextRequest) {
  const fbclid = request.nextUrl.searchParams.get("fbclid");
  const response = NextResponse.next();
  if (!fbclid) return response;

  // Same click reloaded or shared on — keep the original creation time.
  if (request.cookies.get(FBC_COOKIE)?.value.endsWith(`.${fbclid}`)) return response;

  response.cookies.set(FBC_COOKIE, fbcFromClickId(fbclid), {
    maxAge: 60 * 60 * 24 * 90, // the Pixel's 90 days
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/|api/|.*\\.[a-z0-9]+$).*)",
      has: [{ type: "query", key: "fbclid" }],
    },
  ],
};
