import { Curriculum } from "@/components/curriculum";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Partners } from "@/components/partners";
import { SiteFooter } from "@/components/site-footer";
import { Team } from "@/components/team";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type HomePageProps = {
  locale: Locale;
  copy: HomeDictionary;
  ticker: string[];
};

export function HomePage({ locale, copy, ticker }: HomePageProps) {
  return (
    <>
      <Navbar locale={locale} copy={copy.nav} />
      <main>
        <Hero locale={locale} copy={copy.hero} />
        <Marquee
          items={ticker}
          speed="28s"
          sep="◆"
          className="border-y-2 border-ink bg-yellow-main py-3.5 text-ink"
          itemClassName="font-display text-sm font-black uppercase tracking-[0.18em]"
          sepClassName="text-crimson"
        />
        <Curriculum locale={locale} copy={copy.curriculum} />
        <Team copy={copy.team} />
        <Partners copy={copy.partners} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
