/**
 * Single source of truth for site-wide SEO data.
 *
 * The Metadata API (layout/page), sitemap, robots, and manifest all read from
 * here so the canonical URL and brand copy can't drift apart across files.
 */
export const siteConfig = {
  name: "Humanoice",
  // Keep in sync with the hero copy. Used as the default <title> and OG title.
  title: "Humanoice — Thailand's Humanoid School",
  description:
    "Thailand's first hands-on humanoid bootcamp. From assemble to make it walk.",
  url: "https://humanoice.com",
  locale: "en_US",
  lineAddUrl: "https://lin.ee/vlNRsOQ",
  // Official LINE QR for the same account — the host is allow-listed in next.config.ts.
  lineQrUrl: "https://qr-official.line.me/gs/M_178uukqb_BW.png?oat_content=qr",
  // Public profiles. Rendered in the footer and fed to the JSON-LD `sameAs` list,
  // which is how search engines tie these accounts back to the brand.
  socialUrls: {
    facebook: "https://www.facebook.com/profile.php?id=61593979432903",
    instagram: "https://www.instagram.com/humanoicebot/",
    x: "https://x.com/humanoicebot",
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
