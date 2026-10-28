import Link from "next/link";
import { Reveal } from "@/components/reveal";
import {
  EDUCATION_SEGMENTS,
  educationPath,
  type EducationCopy,
  type Locale,
} from "@/lib/i18n";

/** Accent rotation, one per segment — yellow → coral → crimson. */
const ACCENTS = ["var(--yellow-main)", "var(--orange-secondary)", "var(--red)"];

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
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
            <span className="inline-block h-px w-8 bg-crimson" />
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            {copy.title} <span className="text-crimson">{copy.highlight}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {copy.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {EDUCATION_SEGMENTS.map((segment, i) => {
            const item = copy.segments[segment];
            const accent = ACCENTS[i];
            return (
              <Reveal key={segment} delay={i * 130} className="h-full">
                <Link
                  href={educationPath(locale, segment)}
                  className="group flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:p-7"
                  style={{ "--shadow": accent } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink font-mono text-sm font-bold ${
                        i === 2 ? "text-cream" : "text-ink"
                      }`}
                      style={{ background: accent }}
                    >
                      0{i + 1}
                    </span>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                      {item.who}
                    </p>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight">
                    {item.nav}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.hint}</p>

                  <div className="mt-5 border-t-2 border-dashed border-ink/15" />

                  <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">
                    {item.meta}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors group-hover:text-crimson">
                    {copy.more}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
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
