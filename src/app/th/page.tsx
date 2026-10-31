import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const copy = getDictionary("th");

export const metadata = pageMetadata({
  locale: "th",
  path: "/",
  title: { absolute: copy.home.title },
  description: copy.home.description,
});

export default function ThaiHomeRoute() {
  return <HomePage locale="th" copy={copy} />;
}
