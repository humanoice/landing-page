import type { Metadata } from "next";
import { MasterPlanPage } from "@/components/master-plan-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("th");

export const metadata: Metadata = {
  title: copy.plan.title,
  description: copy.plan.description,
  alternates: { canonical: "/th/master-plan", languages: { en: "/master-plan", th: "/th/master-plan" } },
  openGraph: {
    type: "article",
    siteName: siteConfig.name,
    title: `${copy.plan.title} — ${siteConfig.name}`,
    description: copy.plan.description,
    url: "/th/master-plan",
    locale: "th_TH",
    images: [{ ...siteConfig.ogImage, alt: `${copy.plan.title} — ${siteConfig.name}` }],
  },
};

export default function ThaiMasterPlanRoute() {
  return <MasterPlanPage locale="th" copy={copy} />;
}
