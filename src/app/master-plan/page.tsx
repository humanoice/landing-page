import { MasterPlanPage } from "@/components/master-plan-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const copy = getDictionary("en").plan;

export const metadata = pageMetadata({
  locale: "en",
  path: "/master-plan",
  title: copy.title,
  description: copy.description,
  type: "article",
  // /th/master-plan redirects here instead of translating.
  bilingual: false,
});

export default function MasterPlanRoute() {
  return <MasterPlanPage copy={copy} />;
}
