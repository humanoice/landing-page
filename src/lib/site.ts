/**
 * Single source of truth for site-wide SEO data.
 *
 * The Metadata API (layout/page), sitemap, robots, and manifest all read from
 * here so the canonical URL and brand copy can't drift apart across files.
 */
/** The workshop. Spelled out here so the label below is built once, not per caller. */
const venue = {
  name: "Humanoice",
  area: "Phra Khanong, Bangkok",
  mapsUrl: "https://maps.app.goo.gl/cVHTdFiFeGcfsHdj7",
};

export const siteConfig = {
  name: "Humanoice",
  // Keep in sync with the hero copy. Used as the default <title> and OG title.
  title: "Humanoice — Thailand's Humanoid School",
  description:
    "Thailand's first hands-on humanoid bootcamp. From assemble to make it walk.",
  url: "https://humanoice.com",
  locale: "en_US",
  // Every "add us on LINE" goes through humanoice.com/line, a tiny page that
  // logs the visit to GA4 and then forwards to `lineAddUrl` (src/app/line/route.ts).
  // Swapping the LINE account is then a one-line edit here, and printed QR
  // codes never go stale.
  /** On-site links: the LINE CTAs, the QR tile, the footer mark. */
  linePath: "/line",
  /** Off-site links (emails, llms.txt). The QR in `lineQr` encodes this URL. */
  lineUrl: "https://humanoice.com/line",
  /** Where /line lands. Only /line and the JSON-LD `sameAs` read it. */
  lineAddUrl: "https://lin.ee/vlNRsOQ",
  /** QR for `lineUrl`. */
  lineQr: "/line-qr.png",
  /**
   * Meta Pixel / Conversions API dataset. Public — it ships in every page's HTML.
   * The browser Pixel loads site-wide (meta-pixel.tsx) except on /line, which
   * reports its `Contact` from the server instead (lib/meta-capi.ts).
   */
  metaPixelId: "983093654320711",
  // Public profiles. Rendered in the footer and fed to the JSON-LD `sameAs` list,
  // which is how search engines tie these accounts back to the brand.
  socialUrls: {
    facebook: "https://www.facebook.com/profile.php?id=61593979432903",
    instagram: "https://www.instagram.com/humanoicebot/",
    x: "https://x.com/humanoicebot",
    tiktok: "https://www.tiktok.com/@humanoicebot",
  },
  // Transactional mail (payment confirmations) goes out from here via Resend.
  // The domain has to be verified in the Resend dashboard or every send fails.
  // `address` on its own is what the calendar invite's ORGANIZER line wants.
  email: {
    address: "noreply@humanoice.com",
    from: "Humanoice <noreply@humanoice.com>",
  },
  // `mapsUrl` goes in the calendar invite; `label` is the LOCATION line, since a
  // maps short link on its own tells a calendar nothing.
  venue: { ...venue, label: `${venue.name}, ${venue.area}` },
  // The registered company behind the brand. Printed on certificates, where the
  // legal name and registration number are what make them checkable.
  company: {
    legalName: "Human Noy Co., Ltd.",
    registrationNo: "0105569143652",
    ceo: { name: "Sitthavee Teerakulchon", title: "Chief Executive Officer" },
  },
  // The cream paper canvas (globals.css --cream) — drives theme-color + manifest.
  themeColor: "#fbf3e2",
  // public/opengraph.jpg — dimensions are the real file size so platforms don't reflow it.
  ogImage: {
    url: "/opengraph.jpg",
    width: 1920,
    height: 1080,
    alt: "Humanoice — Thailand's Humanoid School",
  },
} as const;
