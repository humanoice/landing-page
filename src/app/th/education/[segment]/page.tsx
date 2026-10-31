import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EducationPage } from "@/components/education-page";
import { EDUCATION_SEGMENTS, getDictionary, isEducationSegment } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

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

  return pageMetadata({
    locale: "th",
    path: `/education/${segment}`,
    title: page.title,
    description: page.description,
  });
}

export default async function ThaiEducationRoute({ params }: PageProps<"/th/education/[segment]">) {
  const { segment } = await params;
  if (!isEducationSegment(segment)) notFound();

  return <EducationPage locale="th" copy={copy} segment={segment} />;
}
