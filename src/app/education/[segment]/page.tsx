import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EducationPage } from "@/components/education-page";
import { EDUCATION_SEGMENTS, getDictionary, isEducationSegment } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const copy = getDictionary("en");

// Three fixed pages, built at build time; anything else under /education is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return EDUCATION_SEGMENTS.map((segment) => ({ segment }));
}

export async function generateMetadata({
  params,
}: PageProps<"/education/[segment]">): Promise<Metadata> {
  const { segment } = await params;
  if (!isEducationSegment(segment)) return {};
  const page = copy.education.segments[segment];
  const path = `/education/${segment}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path, languages: { en: path, th: `/th${path}` } },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${page.title} — ${siteConfig.name}`,
      description: page.description,
      url: path,
      locale: "en_US",
      images: [siteConfig.ogImage],
    },
  };
}

export default async function EducationRoute({ params }: PageProps<"/education/[segment]">) {
  const { segment } = await params;
  if (!isEducationSegment(segment)) notFound();

  return <EducationPage locale="en" copy={copy} segment={segment} />;
}
