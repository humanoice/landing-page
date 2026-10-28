import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("en");

export const metadata: Metadata = {
  title: copy.about.title,
  description: copy.about.description,
  alternates: { canonical: "/about", languages: { en: "/about", th: "/th/about" } },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${copy.about.title} — ${siteConfig.name}`,
    description: copy.about.description,
    url: "/about",
    locale: "en_US",
    images: [siteConfig.ogImage],
  },
};

export default function AboutRoute() {
  return <AboutPage locale="en" copy={copy} />;
}
