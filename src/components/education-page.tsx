import Image from "next/image";
import certificateExample from "../../public/certificate_example.png";
import robotPhoto from "../../public/robot-rp0.jpeg";
import { EDUCATION_PHOTOS } from "@/components/education";
import { CursorCircle } from "@/components/cursor-circle";
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

/**
 * Feathers the kit photo's edges so its black studio backdrop dissolves into
 * the ink section instead of reading as a pasted rectangle.
 */
const ROBOT_MASK = {
  maskImage:
    "linear-gradient(to right, transparent, black 22%, black 85%, transparent), linear-gradient(to bottom, transparent, black 8%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 22%, black 85%, transparent), linear-gradient(to bottom, transparent, black 8%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as React.CSSProperties;

/** Private-training pages that show the sample certificate. */
const CERTIFICATE_SEGMENTS: EducationSegment[] = ["school", "kids"];

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
        <section className="relative isolate overflow-hidden bg-crimson text-cream">
          <Image
            src={EDUCATION_PHOTOS[segment]}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-center mix-blend-multiply contrast-125 grayscale"
          />
          {/* Duotone keeps the photo on-brand; the crimson fade keeps the headline legible. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-crimson/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-crimson sm:via-crimson/70 sm:to-transparent"
          />
          <div
            aria-hidden
            className="grid-lines absolute inset-0"
            style={{ "--line": "rgba(255,255,255,0.07)", "--cell": "80px" } as React.CSSProperties}
          />
          <CursorCircle className="-right-16 top-16 size-56" />

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
              {page.hint}
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

        {/* ---------- Why ---------- */}
        <section className="relative bg-cream py-20 sm:py-28">
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

        {/* ---------- The program ---------- */}
        <section className="relative isolate overflow-hidden border-t-2 border-ink bg-ink py-20 sm:py-28">
          <Image
            src="/class/programming2.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/55 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/55 sm:to-ink/30"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
                <span className="inline-block h-px w-8 bg-yellow-main" />
                {edu.programEyebrow}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-cream">
                {page.programTitle} <span className="text-yellow-main">{page.programHighlight}</span>
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

        {/* ---------- Certificate (uni / school, kids) ---------- */}
        {CERTIFICATE_SEGMENTS.includes(segment) && (
          <section className="relative border-t-2 border-ink bg-cream py-20 sm:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
                  <span className="inline-block h-px w-8 bg-crimson" />
                  {edu.certificate.eyebrow}
                </p>
                <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
                  {edu.certificate.title}{" "}
                  <span className="text-crimson">{edu.certificate.highlight}</span>
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
                  {edu.certificate.body}
                </p>
              </Reveal>

              <Reveal delay={130}>
                <figure className="relative">
                  <div className="overflow-hidden rounded-3xl border-[3px] border-ink bg-[#fffdf7] shadow-[10px_10px_0_0_var(--yellow-main)]">
                    <Image
                      src={certificateExample}
                      alt={edu.certificate.alt}
                      placeholder="blur"
                      sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="absolute -top-4 left-5 rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[2px_2px_0_0_var(--ink)]">
                    {edu.certificate.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </section>
        )}

        {/* ---------- Own one (factory, uni / school) ---------- */}
        {page.kit && (
          <section className="relative isolate overflow-hidden bg-ink py-20 text-cream sm:py-28">
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

            {/* The robot stands on the section floor, right of the copy. `lighten`
                turns the photo's black backdrop into the ink ground, so the grid
                and coral glow show through around it. */}
            <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl">
              <div
                className="absolute bottom-0 right-0 aspect-[488/629] h-[380px] mix-blend-lighten sm:h-[460px] lg:h-[min(90%,760px)]"
                style={ROBOT_MASK}
              >
                <Image
                  src={robotPhoto}
                  alt={edu.kit.alt}
                  fill
                  sizes="(min-width: 1024px) 590px, 360px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
              <div className="lg:max-w-[58%]">
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

              {/* Below lg the robot has no column of its own: leave it a floor
                  under the CTA to stand on. */}
              <div aria-hidden className="h-64 sm:h-60 lg:hidden" />
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} copy={copy} />
    </>
  );
}
