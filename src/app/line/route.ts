import { after, type NextRequest } from "next/server";
import { FBC_COOKIE, FBP_COOKIE, clientIp, fbcFromClickId, isLikelyBot, sendMetaEvent } from "@/lib/meta-capi";
import { siteConfig } from "@/lib/site";

/**
 * humanoice.com/line — the one LINE link the site, emails and printed QR use.
 *
 * Not a server redirect on purpose: a 30x never runs JavaScript, so GA4 can't
 * see the visit and QR / email traffic vanishes. Instead this serves a tiny
 * hand-written page that sends a `page_view` + `line_open` to GA4, then
 * `location.replace`s to `lineAddUrl` as soon as the hit is out.
 *
 * Not a normal Next page either: that would ship the React bundle and only
 * start gtag after hydration — a slow hop on a phone fresh off a QR scan.
 *
 * Escape hatches, fastest first:
 *  - `event_callback` — fires once GA has the hit (sent via sendBeacon, so it
 *    survives the navigation).
 *  - `FALLBACK_MS` timer — gtag blocked or slow; go anyway.
 *  - `<meta refresh>` + a visible link — no JavaScript at all.
 *
 * Telling sources apart in GA (page_view on /line):
 *  - on-site CTAs: referrer is humanoice.com (they use rel="noopener", not
 *    "noreferrer"), plus the `line_click` event on the page they left;
 *  - emails: `utm_source=email`;
 *  - printed QR: no referrer, no UTM (direct). Tag future prints with
 *    `?utm_source=qr&utm_medium=print` to separate them from typed visits.
 *
 * Meta ads: every real visit also sends a `Contact` event through the
 * Conversions API (src/lib/meta-capi.ts) from the server, after the response
 * is out — so it doesn't wait on Meta and an ad blocker can't stop it. The
 * ad click comes from `fbclid` on this URL, or the `_fbc` cookie the Pixel (or
 * src/proxy.ts) saved when the ad landed elsewhere; `_fbp` ties it to the
 * visitor's earlier PageViews. The browser Pixel isn't loaded here — it would
 * hold up the hop to LINE, and the server event already covers it. That makes this route dynamic: a cached
 * copy would skip the event, hence `no-store`.
 */

const GA_ID = "G-F5KWLB1XNM";
const FALLBACK_MS = 1000;

/** gtag only in production, so localhost traffic stays out of the property. */
const analytics = (target: string) =>
  process.env.NODE_ENV === "production"
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
var done=false;function go(){if(done)return;done=true;location.replace(${target})}
setTimeout(go,${FALLBACK_MS});
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag("js",new Date());
gtag("config","${GA_ID}",{send_page_view:false});
gtag("event","page_view");
gtag("event","line_open",{event_callback:go,event_timeout:${FALLBACK_MS}});
</script>`
    : `<script>location.replace(${target})</script>`;

function html() {
  const dest = siteConfig.lineAddUrl;
  // JSON.stringify gives a safe JS string literal; `<` escaped so it can't close the tag.
  const target = JSON.stringify(dest).replace(/</g, "\\u003c");
  const attr = dest.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="2;url=${attr}">
<title>Humanoice on LINE · ฮิวแมนน้อย</title>
<meta name="description" content="Chat with Humanoice on LINE — Thailand's hands-on humanoid bootcamp.">
<meta property="og:title" content="Humanoice on LINE">
<meta property="og:description" content="Chat with Humanoice on LINE — Thailand's hands-on humanoid bootcamp.">
<meta property="og:image" content="${siteConfig.url}/opengraph.jpg">
<meta name="theme-color" content="#fbf3e2">
<link rel="icon" href="/favicon.ico">
${analytics(target)}
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbf3e2;color:#1b0a11;font:700 13px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;text-align:center}
a{display:inline-block;margin-top:16px;padding:12px 22px;border:2px solid #1b0a11;border-radius:999px;background:#fae251;color:#1b0a11;text-decoration:none;box-shadow:5px 5px 0 0 #1b0a11}
</style>
</head>
<body>
<main>
<p>Opening LINE…</p>
<a href="${attr}">Open LINE &rarr;</a>
</main>
</body>
</html>`;
}

/** Rendered once per server instance — the page itself never changes. */
const PAGE = html();

export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  const prefetch =
    request.method !== "GET" ||
    /prefetch/i.test(request.headers.get("sec-purpose") ?? request.headers.get("purpose") ?? "");

  if (userAgent && !prefetch && !isLikelyBot(userAgent)) {
    const fbclid = request.nextUrl.searchParams.get("fbclid");
    const fbc = fbclid ? fbcFromClickId(fbclid) : request.cookies.get(FBC_COOKIE)?.value;
    const { pathname, search } = request.nextUrl;

    after(() =>
      sendMetaEvent({
        name: "Contact",
        url: `${siteConfig.url}${pathname}${search}`,
        ip: clientIp(request.headers),
        userAgent,
        fbc,
        fbp: request.cookies.get(FBP_COOKIE)?.value,
        customData: { content_name: "LINE" },
      }),
    );
  }

  return new Response(PAGE, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}
