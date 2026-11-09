import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { Team } from "@/components/team";
import { Eyebrow } from "@/components/ui";
import { CLASS_PHOTOS } from "@/lib/class-photos";
import type { HomeDictionary, Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

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
            <dl
              className="hero-rise mt-10 grid max-w-2xl gap-y-4 border-t-2 border-cream/20 pt-5 sm:grid-cols-[auto_auto] sm:justify-start sm:divide-x sm:divide-cream/15"
              style={{ animationDelay: "0.24s" }}
            >
              <div className="sm:pr-8">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-main">
                  {about.companyLabel}
                </dt>
                {/* Thai script: Unbounded is latin-only, so set the name in Prompt. */}
                <dd lang="th" className="mt-1 font-sans text-lg font-bold text-cream">
                  {siteConfig.company.legalNameTh}
                </dd>
              </div>
              <div className="sm:pl-8">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-main">
                  {about.registrationLabel}
                </dt>
                <dd className="mt-1 font-mono text-lg font-bold tracking-[0.08em] text-cream">
                  {siteConfig.company.registrationNo}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <Team copy={copy.team} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
