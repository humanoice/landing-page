import { AssembleIcon, CodeIcon } from "@/components/icons";
import Image, { type StaticImageData } from "next/image";
import { Reveal } from "@/components/reveal";
import { CLASS_PHOTOS } from "@/lib/class-photos";
import { applyPath, type HomeDictionary, type Locale } from "@/lib/i18n";
import { TrackedLink } from "@/components/track";

const CTA_CLASS =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[4px_4px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)]";

/**
 * The public (B2C) courses — the only offers on the site with a price. Private
 * training lives on /education/[segment] and routes to LINE instead.
 */
type TrackMeta = {
  n: string;
  color: string;
  stickerRotate: string;
  icon: React.ReactNode;
  photo: StaticImageData;
  photoPosition: string;
  /** courses.slug this card applies for. */
  applySlug: "hardware" | "software";
};

const TRACKS: TrackMeta[] = [
  {
    n: "01",
    color: "var(--yellow-main)",
    stickerRotate: "-2deg",
    icon: <AssembleIcon />,
    photo: CLASS_PHOTOS.groupWithRobots,
    photoPosition: "object-[50%_30%]",
    applySlug: "hardware",
  },
  {
    n: "02",
    color: "var(--orange-secondary)",
    stickerRotate: "2deg",
    icon: <CodeIcon />,
    photo: CLASS_PHOTOS.presenting,
    photoPosition: "object-[50%_55%]",
    applySlug: "software",
  },
];

type CurriculumProps = { locale: Locale; copy: HomeDictionary["curriculum"] };

export function Curriculum({ locale, copy }: CurriculumProps) {
  const tracks = TRACKS.map((track, index) => ({
    ...track,
    ...copy.tracks[index],
  }));
  return (
    <section
      id="curriculum"
      className="relative scroll-mt-20 bg-cream py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
            <span className="inline-block h-px w-8 bg-crimson" />
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            {copy.title} <span className="text-crimson">{copy.highlight}</span>
          </h2>
        </Reveal>

        {/* Course cards — the two public courses, each priced and applied for online */}
        <div className="mt-14 grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 xl:gap-x-8">
          {tracks.map((track, i) => (
            <Reveal key={track.n} delay={i * 130} className="h-full">
              <article
                className="relative flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 pt-9 text-ink shadow-[8px_8px_0_0_var(--shadow)] sm:p-7 sm:pt-10"
                style={{ "--shadow": track.color } as React.CSSProperties}
              >
                {/* Price sticker riding the top edge */}
                <span
                  className="absolute -top-5 right-5 z-10 rounded-xl border-2 border-ink bg-crimson px-3.5 py-1.5 font-mono text-base font-bold tracking-tight text-white shadow-[4px_4px_0_0_var(--ink)]"
                  style={{ transform: `rotate(${track.stickerRotate})` }}
                >
                  {track.price}
                </span>

                {/* Class photo, bleeding to the card edges */}
                <div className="relative -mx-6 -mt-9 mb-6 aspect-[16/10] overflow-hidden rounded-t-[1.3rem] border-b-[3px] border-ink bg-cream-deep sm:-mx-7 sm:-mt-10">
                  <Image
                    src={track.photo}
                    alt={track.photoAlt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                    className={`object-cover ${track.photoPosition}`}
                  />
                </div>

                {/* Card header */}
                <div className="flex items-center gap-3.5">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                    style={{ background: track.color }}
                  >
                    {track.icon}
                  </span>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                    {copy.track} {track.n} · {track.tag}
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

                {/* What's inside */}
                <ul className="mt-5 space-y-4">
                  {track.items.map(([title, detail]) => (
                    <li key={title} className="flex gap-3">
                      <span
                        className="mt-1 size-3.5 shrink-0 rounded border-2 border-ink"
                        style={{ background: track.color }}
                      />
                      <div>
                        <p className="font-display text-sm font-bold uppercase tracking-tight">
                          {title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug text-ink/60">
                          {detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-7">
                  <TrackedLink
                    event="apply_click"
                    params={{ location: "curriculum", track: track.applySlug }}
                    href={applyPath(locale, track.applySlug)}
                    className={CTA_CLASS}
                  >
                    {track.cta}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </TrackedLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
