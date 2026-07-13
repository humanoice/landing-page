import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/i18n";

const TICKER = [
  "Assemble",
  "Simulate",
  "Deploy",
  "Open-Source",
  "Built in Bangkok",
];

export default function Home() {
  return <HomePage locale="en" copy={getDictionary("en")} ticker={TICKER} />;
}
