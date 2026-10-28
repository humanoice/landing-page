import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EducationPage } from "@/components/education-page";
import { EDUCATION_SEGMENTS, getDictionary, isEducationSegment } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("th");

// Three fixed pages, built at build time; anything else under /th/education is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return EDUCATION_SEGMENTS.map((segment) => ({ segment }));
}

export async function generateMetadata({
  params,
}: PageProps<"/th/education/[segment]">): Promise<Metadata> {
  const { segment } = await params;
  if (!isEducationSegment(segment)) return {};
  const page = copy.education.segments[segment];
  const path = `/education/${segment}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/th${path}`, languages: { en: path, th: `/th${path}` } },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${page.title} — ${siteConfig.name}`,
      description: page.description,
      url: `/th${path}`,
      locale: "th_TH",
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ThaiEducationRoute({ params }: PageProps<"/th/education/[segment]">) {
  const { segment } = await params;
  if (!isEducationSegment(segment)) notFound();

  return (
    <div lang="th">
      <EducationPage locale="th" copy={copy} segment={segment} />
    </div>
  );
}
