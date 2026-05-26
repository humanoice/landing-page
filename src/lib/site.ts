/**
 * Single source of truth for site-wide SEO data.
 *
 * The Metadata API (layout/page), sitemap, robots, and manifest all read from
 * here so the canonical URL and brand copy can't drift apart across files.
 */
export const siteConfig = {
  name: "Humanoice",
  // Keep in sync with the hero copy. Used as the default <title> and OG title.
  title: "Humanoice — Thailand's Humanoid Bootcamp",
  description:
    "Thailand's first hands-on humanoid bootcamp. From assemble to make it walk. Opening Q4 2026 in Bangkok.",
  url: "https://humanoice.com",
  locale: "en_US",
  // The cream paper canvas (globals.css --cream) — drives theme-color + manifest.
  themeColor: "#fbf3e2",
  // public/opengraph.png — dimensions are the real file size so platforms don't reflow it.
  ogImage: {
    url: "/opengraph.png",
    width: 2918,
    height: 1540,
    alt: "Humanoice — Thailand's Humanoid Bootcamp",
  },
} as const;
