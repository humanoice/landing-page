import Image, { type StaticImageData } from "next/image";
import { AssembleIcon, CodeIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/track";
import { accent, Arrow, Eyebrow, SectionHeading, SyllabusList } from "@/components/ui";
import { CLASS_PHOTOS } from "@/lib/class-photos";
import { applyPath, COURSE_SLUGS, type HomeDictionary, type Locale } from "@/lib/i18n";

/** The CTA, inset and full-width, with the gentler lift of a button inside a card. */
const CTA_CLASS =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[4px_4px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)]";

/** Per-card art, by position in `curriculum.tracks`. */
const TRACK_ART: { icon: React.ReactNode; photo: StaticImageData; photoPosition: string }[] = [
  { icon: <AssembleIcon />, photo: CLASS_PHOTOS.groupWithRobots, photoPosition: "object-[50%_30%]" },
  { icon: <CodeIcon />, photo: CLASS_PHOTOS.presenting, photoPosition: "object-[50%_55%]" },
];

type CurriculumProps = { locale: Locale; copy: HomeDictionary["curriculum"] };

/**
 * The public (B2C) courses, each applied for online — /apply carries the live
 * price. Private training lives on /education/[segment] and routes to LINE instead.
 */
export function Curriculum({ locale, copy }: CurriculumProps) {
  return (
    <section
      id="curriculum"
      className="relative scroll-mt-20 bg-cream py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading title={copy.title} highlight={copy.highlight} />
        </Reveal>

        {/* Course cards — the two public courses, each applied for online */}
        <div className="mt-14 grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 xl:gap-x-8">
          {copy.tracks.map((track, i) => {
            const { icon, photo, photoPosition } = TRACK_ART[i];
            const color = accent(i).color;
            const slug = COURSE_SLUGS[i];
            return (
              <Reveal key={track.name} delay={i * 130} className="h-full">
                <article
                  className="relative flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7"
                  style={{ "--shadow": color } as React.CSSProperties}
                >
                  {/* Class photo, bleeding to the card edges */}
                  <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/10] overflow-hidden rounded-t-[1.3rem] border-b-[3px] border-ink bg-cream-deep sm:-mx-7 sm:-mt-7">
                    <Image
                      src={photo}
                      alt={track.photoAlt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover ${photoPosition}`}
                    />
                  </div>

                  {/* Card header */}
                  <div className="flex items-center gap-3.5">
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                      style={{ background: color }}
                    >
                      {icon}
                    </span>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                      {copy.track} 0{i + 1} · {track.tag}
                    </p>
                  </div>

                  <h3 className="mt-4 font-display text-[1.35rem] font-extrabold uppercase leading-[1.1] tracking-tight sm:text-2xl">
                    {track.name}
                  </h3>

                  <p className="mt-3">
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-crimson">
                      <span className="size-1.5 rounded-full bg-crimson" />
                      {track.duration}
                    </span>
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-ink/70">
                    {track.blurb}
                  </p>

                  <div className="mt-5 border-t-2 border-dashed border-ink/15" />

                  <SyllabusList items={track.items} color={color} />

                  {/* CTA */}
                  <div className="mt-auto pt-7">
                    <TrackedLink
                      event="apply_click"
                      params={{ location: "curriculum", track: slug }}
                      href={applyPath(locale, slug)}
                      className={CTA_CLASS}
                    >
                      {track.cta}
                      <Arrow />
                    </TrackedLink>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
