import { AssembleIcon, CodeIcon, WalkIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { TrackedAnchor } from "@/components/track";
import type { EducationSegment, HomeDictionary, Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const CTA =
  "group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]";

/** Program card accents and icons, by position: build first, then software (or driving, for kids). */
const PROGRAM_META = [
  { color: "var(--yellow-main)", icon: <AssembleIcon /> },
  { color: "var(--orange-secondary)", icon: <CodeIcon /> },
];
const KIDS_SECOND_ICON = <WalkIcon />;

/** Accent rotation for the "why" cards — yellow → coral → crimson. */
const WHY_ACCENTS = [
  { color: "var(--yellow-main)", ink: "text-ink" },
  { color: "var(--orange-secondary)", ink: "text-ink" },
  { color: "var(--red)", ink: "text-cream" },
];

type EducationPageProps = {
  locale: Locale;
  copy: HomeDictionary;
  segment: EducationSegment;
};

/**
 * A private-training page (/education/factory, /school, /kids). B2B: no price
 * anywhere — every CTA is a LINE chat, and the footer's QR closes the page.
 */
export function EducationPage({ locale, copy, segment }: EducationPageProps) {
  const edu = copy.education;
  const page = edu.segments[segment];
  const location = `education_${segment}`;

  return (
    <>
      <Navbar locale={locale} copy={copy} path={`/education/${segment}`} />
      <main>
        {/* ---------- Header ---------- */}
        <section className="relative overflow-hidden bg-crimson text-cream">
          <div
            aria-hidden
            className="grid-lines absolute inset-0"
            style={{ "--line": "rgba(255,255,255,0.07)", "--cell": "80px" } as React.CSSProperties}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 78% 30%, rgba(250,226,81,0.22) 0%, rgba(189,17,74,0) 60%)",
            }}
          />
          <div
            aria-hidden
            className="float pointer-events-none absolute -right-16 top-16 size-56 rounded-full border-2 border-yellow-main/25"
          />

          <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
            <p className="hero-rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
              <span className="inline-block h-px w-8 bg-yellow-main" />
              {page.eyebrow}
            </p>
            <h1
              className="hero-rise mt-6 max-w-4xl font-display text-[clamp(2.6rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tight"
              style={{ animationDelay: "0.08s" }}
            >
              {page.heading[0]} <span className="text-yellow-main">{page.heading[1]}</span>
            </h1>
            <p
              className="hero-rise mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
              style={{ animationDelay: "0.16s" }}
            >
              {page.lead}
            </p>
            <div className="hero-rise mt-9" style={{ animationDelay: "0.24s" }}>
              <TrackedAnchor
                event="line_click"
                params={{ location }}
                href={siteConfig.lineAddUrl}
                target="_blank"
                rel="noreferrer"
                className={CTA}
              >
                {edu.line}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </TrackedAnchor>
            </div>
          </div>

          {/* Spec bar */}
          <div className="relative z-10 border-t-2 border-cream/20">
            <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-cream/15 sm:grid-cols-4 sm:divide-x">
              {page.facts.map(([label, value]) => (
                <div
                  key={label}
                  className="border-t border-cream/15 px-5 py-5 first:border-t-0 sm:border-t-0 sm:px-8 [&:nth-child(2)]:border-t-0"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-main">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-lg font-bold tracking-tight text-cream">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- The program ---------- */}
        <section className="relative bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
                <span className="inline-block h-px w-8 bg-crimson" />
                {edu.programEyebrow}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
                {page.programTitle} <span className="text-crimson">{page.programHighlight}</span>
              </h2>
            </Reveal>

            <div className="mt-14 grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 xl:gap-x-8">
              {page.program.map((group, i) => {
                const meta = PROGRAM_META[i];
                const icon = segment === "kids" && i === 1 ? KIDS_SECOND_ICON : meta.icon;
                return (
                  <Reveal key={group.name} delay={i * 130} className="h-full">
                    <article
                      className="flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7"
                      style={{ "--shadow": meta.color } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                          style={{ background: meta.color }}
                        >
                          {icon}
                        </span>
                        <div>
                          <h3 className="font-display text-[1.35rem] font-extrabold uppercase leading-[1.1] tracking-tight sm:text-2xl">
                            {group.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-ink/60">{group.blurb}</p>
                        </div>
                      </div>

                      <div className="mt-5 border-t-2 border-dashed border-ink/15" />

                      <ul className="mt-5 space-y-4">
                        {group.items.map(([title, detail]) => (
                          <li key={title} className="flex gap-3">
                            <span
                              className="mt-1 size-3.5 shrink-0 rounded border-2 border-ink"
                              style={{ background: meta.color }}
                            />
                            <div>
                              <p className="font-display text-sm font-bold uppercase tracking-tight">
                                {title}
                              </p>
                              <p className="mt-0.5 text-[13px] leading-snug text-ink/60">{detail}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Why ---------- */}
        <section className="relative border-t-2 border-ink bg-cream-deep py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
                <span className="inline-block h-px w-8 bg-crimson" />
                {edu.whyEyebrow}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
                {page.whyTitle} <span className="text-crimson">{page.whyHighlight}</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {page.why.map(([title, body], i) => {
                const accent = WHY_ACCENTS[i % WHY_ACCENTS.length];
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
                      <h3 className="mt-5 font-display text-lg font-extrabold uppercase leading-tight tracking-tight sm:text-xl">
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

        {/* ---------- Own one (factory, uni / school) ---------- */}
        {page.kit && (
          <section className="relative overflow-hidden bg-ink py-20 text-cream sm:py-28">
            <div
              aria-hidden
              className="grid-lines absolute inset-0"
              style={{ "--line": "rgba(255,255,255,0.05)", "--cell": "72px" } as React.CSSProperties}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 50% at 80% 20%, rgba(215,86,86,0.18) 0%, rgba(27,10,17,0) 70%)",
              }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
                  <span className="inline-block h-px w-8 bg-yellow-main" />
                  {edu.kit.eyebrow}
                </p>
                <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight">
                  {edu.kit.title} <span className="text-yellow-main">{edu.kit.highlight}</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
                  {edu.kit.intro}
                </p>
              </Reveal>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {edu.kit.offers.map((offer, i) => (
                  <Reveal key={offer.name} delay={i * 130} className="h-full">
                    <article className="h-full rounded-3xl border-[3px] border-cream/15 bg-cream p-7 text-ink shadow-[8px_8px_0_0_var(--orange-secondary)]">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                        {offer.tag}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
                        {offer.name}
                      </h3>
                      <div className="mt-5 border-t-2 border-dashed border-ink/15" />
                      <ul className="mt-5 space-y-3">
                        {offer.items.map((line) => (
                          <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                            <span className="mt-1.5 size-3.5 shrink-0 rounded border-2 border-ink bg-yellow-main" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <TrackedAnchor
                  event="line_click"
                  params={{ location: `${location}_kit` }}
                  href={siteConfig.lineAddUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${CTA} mt-12`}
                >
                  {edu.kit.cta}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </TrackedAnchor>
              </Reveal>
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
