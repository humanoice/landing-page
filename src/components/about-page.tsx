import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Team } from "@/components/team";
import { Eyebrow } from "@/components/ui";
import { CLASS_PHOTOS } from "@/lib/class-photos";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type AboutPageProps = { locale: Locale; copy: HomeDictionary };

export function AboutPage({ locale, copy }: AboutPageProps) {
  const about = copy.about;

  return (
    <>
      <Navbar locale={locale} copy={copy} />
      <main>
        {/* ---------- Intro ---------- */}
        <section className="relative isolate overflow-hidden bg-ink py-20 sm:py-28">
          <Image
            src={CLASS_PHOTOS.demoAtStand}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/65" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
            <Eyebrow tone="dark" className="hero-rise">
              {about.eyebrow}
            </Eyebrow>
            <h1
              className="hero-rise mt-6 font-display max-w-5xl text-balance text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-[0.95] tracking-tight text-cream"
              style={{ animationDelay: "0.08s" }}
            >
              {about.heading[0]} <span className="text-yellow-main">{about.heading[1]}</span>
            </h1>
            <p
              className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
              style={{ animationDelay: "0.16s" }}
            >
              {about.lead}
            </p>
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <Team copy={copy.team} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
