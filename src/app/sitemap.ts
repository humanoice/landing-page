import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Served at /sitemap.xml — the URL submitted in Google Search Console.
 *
 * Two rules keep it trustworthy:
 *
 * 1. Only canonical, indexable, 200-returning URLs belong here. /th/master-plan
 *    redirects to /master-plan and /certificate/* is disallowed in robots.ts, so
 *    neither is listed. A sitemap full of redirects and blocked URLs is how you
 *    earn "Page with redirect" and "Blocked by robots.txt" rows in GSC.
 *
 * 2. `lastModified` is a real content date, bumped by hand. It used to be
 *    `new Date()`, which stamped build time on every URL and claimed the whole
 *    site changed on every deploy — Google discounts a lastmod that always
 *    reads "just now".
 *
 * `changefreq` and `priority` are deliberately absent: Google ignores both, and
 * priority only ever encoded our own wishful ranking.
 */

// Bump when that page's copy changes. Most copy lives in src/lib/i18n.ts, so the
// EN and TH twins of a page move together.
const UPDATED = {
  home: "2026-08-26",
  apply: "2026-08-26",
  masterPlan: "2026-08-15",
} as const;

const url = (path = "") => `${siteConfig.url}${path}`;

/**
 * A bilingual page plus its Thai twin, cross-annotated.
 *
 * Both URLs are listed and both carry the *same* full alternate set, themselves
 * included. Google requires hreflang to be reciprocal — annotate EN→TH without
 * the return trip and the pairing is dropped silently. x-default points at
 * English, where an unmatched locale should land.
 */
function bilingual(path: string, lastModified: string): MetadataRoute.Sitemap {
  const en = url(path);
  const th = url(`/th${path}`);
  const languages = { en, th, "x-default": en };

  return [
    { url: en, lastModified, alternates: { languages } },
    { url: th, lastModified, alternates: { languages } },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...bilingual("", UPDATED.home),
    ...bilingual("/apply", UPDATED.apply),
    // English only — /th/master-plan redirects here instead of translating, so
    // there is no alternate to annotate.
    { url: url("/master-plan"), lastModified: UPDATED.masterPlan },
  ];
}
