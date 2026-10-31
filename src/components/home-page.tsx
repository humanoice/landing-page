import { Curriculum } from "@/components/curriculum";
import { Education } from "@/components/education";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Partners } from "@/components/partners";
import { SiteFooter } from "@/components/site-footer";
import { Testimonials } from "@/components/testimonials";
import { type HomeDictionary, type Locale } from "@/lib/i18n";

type HomePageProps = {
  locale: Locale;
  copy: HomeDictionary;
};

export function HomePage({ locale, copy }: HomePageProps) {
  return (
    <>
      <Navbar locale={locale} copy={copy} />
      <main>
        <Hero locale={locale} copy={copy.hero} />
        <Curriculum locale={locale} copy={copy.curriculum} />
        <Education locale={locale} copy={copy.education} />
        <Testimonials copy={copy.testimonials} />
        <Partners copy={copy.partners} />
        <Faq locale={locale} copy={copy.faq} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
