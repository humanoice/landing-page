import type { Metadata } from "next";
import { MasterPlanPage } from "@/components/master-plan-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("en").plan;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/master-plan" },
  openGraph: {
    type: "article",
    siteName: siteConfig.name,
    title: `${copy.title} — ${siteConfig.name}`,
    description: copy.description,
    url: "/master-plan",
    locale: "en_US",
    images: [{ ...siteConfig.ogImage, alt: `${copy.title} — ${siteConfig.name}` }],
  },
};

export default function MasterPlanRoute() {
  return <MasterPlanPage copy={copy} />;
}
