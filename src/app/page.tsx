import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/i18n";

export default function Home() {
  return <HomePage locale="en" copy={getDictionary("en")} />;
}
