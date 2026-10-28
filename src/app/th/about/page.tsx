import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("th");

export const metadata: Metadata = {
  title: copy.about.title,
  description: copy.about.description,
  alternates: { canonical: "/th/about", languages: { en: "/about", th: "/th/about" } },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${copy.about.title} — ${siteConfig.name}`,
    description: copy.about.description,
    url: "/th/about",
    locale: "th_TH",
    images: [siteConfig.ogImage],
  },
};

export default function ThaiAboutRoute() {
  return (
    <div lang="th">
      <AboutPage locale="th" copy={copy} />
    </div>
  );
}
