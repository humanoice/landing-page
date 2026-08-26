import type { Metadata } from "next";
import { connection } from "next/server";
import { ApplyPage } from "@/components/apply-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const dictionary = getDictionary("th");
const copy = dictionary.apply;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/th/apply", languages: { en: "/apply", th: "/th/apply" } },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${copy.title} — ${siteConfig.name}`,
    description: copy.description,
    url: "/th/apply",
    locale: "th_TH",
    images: [siteConfig.ogImage],
  },
};

type ApplyRouteProps = {
  searchParams: Promise<{ course?: string | string[] }>;
};

export default async function ThaiApplyRoute({ searchParams }: ApplyRouteProps) {
  // The run list is "starts after now()" — render per request, never at build time.
  await connection();
  const { course } = await searchParams;

  return (
    <div lang="th">
      <ApplyPage locale="th" copy={copy} languageLabel={dictionary.nav.language} course={course} />
    </div>
  );
}
