import { connection } from "next/server";
import { ApplyPage } from "@/components/apply-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

/**
 * Applies to every server action posted from this page — including the slip
 * check, which is two DeepSeek vision calls at worst (src/lib/slip.ts budgets
 * itself to fit inside this). The platform default of 10s would cut it off.
 */
export const maxDuration = 60;

const copy = getDictionary("en");

export const metadata = pageMetadata({
  locale: "en",
  path: "/apply",
  title: copy.apply.title,
  description: copy.apply.description,
});

type ApplyRouteProps = {
  searchParams: Promise<{ course?: string | string[] }>;
};

export default async function ApplyRoute({ searchParams }: ApplyRouteProps) {
  // The run list is "starts after now()" — render per request, never at build time.
  await connection();
  const { course } = await searchParams;

  return <ApplyPage locale="en" copy={copy} course={course} />;
}
