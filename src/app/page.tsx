import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Curriculum } from "@/components/curriculum";
import { Team } from "@/components/team";
import { Partners } from "@/components/partners";
import { SiteFooter } from "@/components/site-footer";

const TICKER = [
  "Assemble",
  "Simulate",
  "Deploy",
  "Open-Source",
  "Built in Bangkok",
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <Marquee
          items={TICKER}
          speed="28s"
          sep="◆"
          className="border-y-2 border-ink bg-yellow-main py-3.5 text-ink"
          itemClassName="font-display text-sm font-black uppercase tracking-[0.18em]"
          sepClassName="text-crimson"
        />

        <Curriculum />
        <Team />
        <Partners />
      </main>
      <SiteFooter />
    </>
  );
}
