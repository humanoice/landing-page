import { AboutPage } from "@/components/about-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const copy = getDictionary("th");

export const metadata = pageMetadata({
  locale: "th",
  path: "/about",
  title: copy.about.title,
  description: copy.about.description,
});

export default function ThaiAboutRoute() {
  return <AboutPage locale="th" copy={copy} />;
}
