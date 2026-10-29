import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { Team } from "@/components/team";
import { CLASS_PHOTOS } from "@/lib/class-photos";
import type { HomeDictionary, Locale } from "@/lib/i18n";

/** "What we do" accent rotation — yellow → coral → crimson. */
const ACCENTS = [
  { color: "var(--yellow-main)", ink: "text-ink" },
  { color: "var(--orange-secondary)", ink: "text-ink" },
  { color: "var(--red)", ink: "text-cream" },
];

type AboutPageProps = { locale: Locale; copy: HomeDictionary };

export function AboutPage({ locale, copy }: AboutPageProps) {
  const about = copy.about;

  return (
    <>
      <Navbar locale={locale} copy={copy} path="/about" />
      <main>
        {/* ---------- Intro + mission ---------- */}
        <section className="relative isolate overflow-hidden bg-ink py-20 sm:py-28">
          <Image
            src="/class/generic1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/65" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
            <div>
              <p className="hero-rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
                <span className="inline-block h-px w-8 bg-yellow-main" />
                {about.eyebrow}
              </p>
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
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <Team copy={copy.team} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
