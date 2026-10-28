import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { Team } from "@/components/team";
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
        <section className="relative bg-cream py-20 sm:py-28">
          <div
            aria-hidden
            className="dots pointer-events-none absolute inset-0"
            style={{ "--dot": "rgba(27,10,17,0.07)" } as React.CSSProperties}
          />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="hero-rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
                <span className="inline-block h-px w-8 bg-crimson" />
                {about.eyebrow}
              </p>
              <h1
                className="hero-rise mt-6 font-display text-[clamp(2.6rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tight"
                style={{ animationDelay: "0.08s" }}
              >
                {about.heading[0]} <span className="text-crimson">{about.heading[1]}</span>
              </h1>
              <p
                className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg"
                style={{ animationDelay: "0.16s" }}
              >
                {about.lead}
              </p>
            </div>

            <div
              className="pop-in rounded-3xl border-[3px] border-ink bg-crimson p-7 text-cream shadow-[10px_10px_0_0_var(--yellow-main)] sm:p-10"
              style={{ "--rot": "0deg", animationDelay: "0.3s" } as React.CSSProperties}
            >
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
                {about.mission.eyebrow}
              </p>
              <p className="mt-5 font-display text-[clamp(1.6rem,5vw,2.4rem)] font-black uppercase leading-[1] tracking-tight">
                {about.mission.text}
              </p>
              {/* The master plan is English-only — /th/master-plan redirects to it. */}
              <Link
                href="/master-plan"
                className="group mt-7 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-cream/80 transition-colors hover:text-yellow-main"
              >
                {about.mission.link}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- What we do ---------- */}
        <section className="relative border-t-2 border-ink bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
                <span className="inline-block h-px w-8 bg-crimson" />
                {about.whatEyebrow}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
                {about.whatTitle} <span className="text-crimson">{about.whatHighlight}</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {about.what.map(([title, body], i) => {
                const accent = ACCENTS[i];
                return (
                  <Reveal key={title} delay={i * 130} className="h-full">
                    <article
                      className="h-full rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7"
                      style={{ "--shadow": accent.color } as React.CSSProperties}
                    >
                      <span
                        className={`grid size-10 place-items-center rounded-xl border-2 border-ink font-mono text-sm font-bold ${accent.ink}`}
                        style={{ background: accent.color }}
                      >
                        0{i + 1}
                      </span>
                      <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-tight">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <Team copy={copy.team} />
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
