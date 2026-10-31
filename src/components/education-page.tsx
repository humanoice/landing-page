import Image from "next/image";
import certificateExample from "../../public/certificate_example.png";
import robotPhoto from "../../public/robot-rp0.jpeg";
import { CursorCircle } from "@/components/cursor-circle";
import { AssembleIcon, CodeIcon, WalkIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import {
  accent,
  Eyebrow,
  InkAtmosphere,
  LineCta,
  ScrimPhoto,
  SectionHeading,
  SyllabusList,
} from "@/components/ui";
import { CLASS_PHOTOS, SEGMENT_PHOTOS } from "@/lib/class-photos";
import type { EducationSegment, HomeDictionary, Locale } from "@/lib/i18n";

/**
 * What each segment's page carries beyond its copy: the program card icons
 * (build, then software — or driving, for kids) and which optional sections
 * it shows.
 */
const SEGMENT_META: Record<
  EducationSegment,
  { icons: [React.ReactNode, React.ReactNode]; certificate: boolean; kit: boolean }
> = {
  factory: { icons: [<AssembleIcon key="a" />, <CodeIcon key="c" />], certificate: false, kit: true },
  school: { icons: [<AssembleIcon key="a" />, <CodeIcon key="c" />], certificate: true, kit: true },
  kids: { icons: [<AssembleIcon key="a" />, <WalkIcon key="w" />], certificate: true, kit: false },
};

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
  const meta = SEGMENT_META[segment];
  const location = `education_${segment}`;

  return (
    <>
      <Navbar locale={locale} copy={copy} />
      <main>
        {/* ---------- Header ---------- */}
        <section className="relative isolate overflow-hidden bg-crimson text-cream">
          <Image
            src={SEGMENT_PHOTOS[segment]}
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
            <Eyebrow tone="dark" className="hero-rise">
              {page.eyebrow}
            </Eyebrow>
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
              <LineCta location={location} label={edu.line} />
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
              <Eyebrow>{edu.whyEyebrow}</Eyebrow>
              <SectionHeading title={page.whyTitle} highlight={page.whyHighlight} />
            </Reveal>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {page.why.map(([title, body], i) => {
                const { color, ink } = accent(i);
                return (
                  <Reveal key={title} delay={i * 130} className="h-full">
                    <article
                      className="h-full rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7"
                      style={{ "--shadow": color } as React.CSSProperties}
                    >
                      <span
                        className={`grid size-10 place-items-center rounded-xl border-2 border-ink font-mono text-sm font-bold ${ink}`}
                        style={{ background: color }}
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
          <ScrimPhoto src={CLASS_PHOTOS.codeAlong} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow tone="dark">{edu.programEyebrow}</Eyebrow>
              <SectionHeading tone="dark" title={page.programTitle} highlight={page.programHighlight} />
            </Reveal>

            <div className="mt-14 grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 xl:gap-x-8">
              {page.program.map((group, i) => {
                const color = accent(i).color;
                return (
                  <Reveal key={group.name} delay={i * 130} className="h-full">
                    <article
                      className="flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7"
                      style={{ "--shadow": color } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                          style={{ background: color }}
                        >
                          {meta.icons[i]}
                        </span>
                        <div>
                          <h3 className="font-display text-[1.35rem] font-extrabold uppercase leading-[1.1] tracking-tight sm:text-2xl">
                            {group.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-ink/60">{group.blurb}</p>
                        </div>
                      </div>

                      <div className="mt-5 border-t-2 border-dashed border-ink/15" />

                      <SyllabusList items={group.items} color={color} />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Certificate (uni / school, kids) ---------- */}
        {meta.certificate && (
          <section className="relative border-t-2 border-ink bg-cream py-20 sm:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <Reveal>
                <Eyebrow>{edu.certificate.eyebrow}</Eyebrow>
                <SectionHeading title={edu.certificate.title} highlight={edu.certificate.highlight} />
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
        {meta.kit && (
          <section className="relative isolate overflow-hidden bg-ink py-20 text-cream sm:py-28">
            <InkAtmosphere />

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
                  <Eyebrow tone="dark">{edu.kit.eyebrow}</Eyebrow>
                  <SectionHeading tone="dark" title={edu.kit.title} highlight={edu.kit.highlight} />
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
                  <LineCta location={`${location}_kit`} label={edu.kit.cta} className="mt-12" />
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
