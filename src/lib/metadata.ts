import "server-only";
import type { Metadata } from "next";
import { localePath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type PageMetadata = {
  locale: Locale;
  /** The English path, "/about" — the Thai twin is derived from it. */
  path: string;
  /** A bare title gets the " · Humanoice" template; `{ absolute }` is used as written (the home page). */
  title: string | { absolute: string };
  description: string;
  type?: "website" | "article";
  /** False for English-only pages, which have no twin to annotate. */
  bilingual?: boolean;
};

/**
 * Canonical, hreflang and OpenGraph for one page. Every route builds its metadata
 * here, so the EN and TH twins — and the sitemap's alternates — can't drift.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  bilingual = true,
}: PageMetadata): Metadata {
  const url = localePath(locale, path);
  const en = localePath("en", path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: bilingual ? { en, th: localePath("th", path), "x-default": en } : undefined,
    },
    openGraph: {
      type,
      siteName: siteConfig.name,
      title: typeof title === "string" ? `${title} — ${siteConfig.name}` : title.absolute,
      description,
      url,
      locale: locale === "th" ? "th_TH" : "en_US",
      images: [siteConfig.ogImage],
    },
  };
}
