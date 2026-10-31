import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const copy = getDictionary("en");

export const metadata = pageMetadata({
  locale: "en",
  path: "/",
  title: { absolute: copy.home.title },
  description: copy.home.description,
});

export default function HomeRoute() {
  return <HomePage locale="en" copy={copy} />;
}
