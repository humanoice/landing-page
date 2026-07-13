import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const TICKER = ["ประกอบ", "จำลอง", "นำไปใช้งาน", "โอเพนซอร์ส", "สร้างในกรุงเทพฯ"];

export const metadata: Metadata = {
  title: "Humanoice — โรงเรียนฮิวแมนนอยด์แห่งประเทศไทย",
  description: "บูตแคมป์ฮิวแมนนอยด์แบบลงมือทำแห่งแรกของไทย จากการประกอบสู่การทำให้หุ่นยนต์เดินได้",
  alternates: { canonical: "/th", languages: { en: "/", th: "/th" } },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Humanoice — โรงเรียนฮิวแมนนอยด์แห่งประเทศไทย",
    description: "บูตแคมป์ฮิวแมนนอยด์แบบลงมือทำแห่งแรกของไทย จากการประกอบสู่การทำให้หุ่นยนต์เดินได้",
    url: "/th",
    locale: "th_TH",
    images: [siteConfig.ogImage],
  },
};

export default function ThaiHome() {
  const copy = getDictionary("th");

  return (
    <div lang="th">
      <HomePage locale="th" copy={copy} ticker={TICKER} />
    </div>
  );
}
