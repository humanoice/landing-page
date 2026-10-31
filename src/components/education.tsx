import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { accent, Arrow, Eyebrow, SectionHeading } from "@/components/ui";
import { SEGMENT_PHOTOS } from "@/lib/class-photos";
import { EDUCATION_SEGMENTS, educationPath, type EducationCopy, type Locale } from "@/lib/i18n";

type EducationProps = { locale: Locale; copy: EducationCopy };

/** Home teaser for private training: one card per segment, each linking to its page. */
export function Education({ locale, copy }: EducationProps) {
  return (
    <section
      id="education"
      className="relative scroll-mt-20 border-t-2 border-ink bg-cream-deep py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading title={copy.title} highlight={copy.highlight} />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {copy.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {EDUCATION_SEGMENTS.map((segment, i) => {
            const item = copy.segments[segment];
            return (
              <Reveal key={segment} delay={i * 130} className="h-full">
                <Link
                  href={educationPath(locale, segment)}
                  className="group relative isolate flex h-full min-h-[26rem] flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-ink p-6 text-cream shadow-[8px_8px_0_0_var(--shadow)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:p-7"
                  style={{ "--shadow": accent(i).color } as React.CSSProperties}
                >
                  <Image
                    src={SEGMENT_PHOTOS[segment]}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-t from-ink via-ink/85 to-transparent"
                  />

                  <h3 className="mt-auto pt-40 font-display text-2xl font-extrabold uppercase tracking-tight">
                    {item.nav}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">{item.hint}</p>

                  <div className="mt-5 border-t-2 border-dashed border-cream/25" />

                  <span className="inline-flex items-center gap-2 pt-4 font-mono text-xs font-bold uppercase tracking-[0.12em] text-cream transition-colors group-hover:text-yellow-main">
                    {copy.more}
                    <Arrow />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
