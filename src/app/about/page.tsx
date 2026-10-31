import { AboutPage } from "@/components/about-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const copy = getDictionary("en");

export const metadata = pageMetadata({
  locale: "en",
  path: "/about",
  title: copy.about.title,
  description: copy.about.description,
});

export default function AboutRoute() {
  return <AboutPage locale="en" copy={copy} />;
}
