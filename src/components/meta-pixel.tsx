"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta's base snippet, verbatim apart from the pixel ID. Fires the first PageView. */
const SNIPPET = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;
n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${siteConfig.metaPixelId}');fbq('track','PageView');`;

/** A certificate URL carries a student's name — it never goes to Meta (see robots.ts). */
const isPrivate = (pathname: string) => pathname.startsWith("/certificate");

/**
 * Meta Pixel, site-wide. The snippet counts the first page; client-side route
 * changes (navbar, Education pages…) never reload it, so each later pathname
 * sends its own PageView here.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (isPrivate(pathname)) return;
    if (first.current) {
      first.current = false; // the snippet already sent this one
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  // next/script dedupes by id, so unmounting here and remounting later never
  // re-runs the snippet — and a visit that starts on /certificate loads it on
  // the first public page instead, where the snippet's own PageView counts it.
  if (isPrivate(pathname)) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {SNIPPET}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's no-JS beacon, not content */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${siteConfig.metaPixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
