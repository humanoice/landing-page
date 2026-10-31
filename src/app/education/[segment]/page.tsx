import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EducationPage } from "@/components/education-page";
import { EDUCATION_SEGMENTS, getDictionary, isEducationSegment } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

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

  return pageMetadata({
    locale: "en",
    path: `/education/${segment}`,
    title: page.title,
    description: page.description,
  });
}

export default async function EducationRoute({ params }: PageProps<"/education/[segment]">) {
  const { segment } = await params;
  if (!isEducationSegment(segment)) notFound();

  return <EducationPage locale="en" copy={copy} segment={segment} />;
}
