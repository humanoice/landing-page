import { Reveal } from "@/components/reveal";
import { applyPath, type HomeDictionary, type Locale } from "@/lib/i18n";
import { TrackedAnchor, TrackedLink } from "@/components/track";
import { siteConfig } from "@/lib/site";

const CTA_CLASS =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-[4px_4px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)]";

const ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CodeIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4-3 16" />
    </svg>
  );
}

function AssembleIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z" />
      <circle cx="6.5" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <circle cx="13.5" cy="4" r="1.8" />
      <path d="M12.8 6.6 11 12l2.6 2.2 1 6.2" />
      <path d="M12.1 10.4 8.6 12l-1.6 4.6" />
      <path d="M12.6 7.6l3.4 1.6 2.2-1.2" />
    </svg>
  );
}

type TrackMeta = {
  n: string;
  color: string;
  stickerRotate: string;
  icon: React.ReactNode;
  featured?: boolean;
  /** courses.slug this card applies for. Absent = no self-serve run (B2B) → talk on LINE. */
  applySlug?: "hardware" | "software";
  /** For the combined track: which 101 track each line corresponds to. */
  refs?: { n: string; color: string; source: number }[];
};

const TRACKS: TrackMeta[] = [
  {
    n: "01",
    color: "var(--yellow-main)",
    stickerRotate: "-2deg",
    icon: <AssembleIcon />,
    applySlug: "hardware",
  },
  {
    n: "02",
    color: "var(--orange-secondary)",
    stickerRotate: "2deg",
    icon: <CodeIcon />,
    applySlug: "software",
  },
  {
    n: "03",
    color: "var(--yellow-main)",
    stickerRotate: "-2deg",
    icon: <WalkIcon />,
    featured: true,
    refs: [
      { n: "01", color: "var(--yellow-main)", source: 0 },
      { n: "02", color: "var(--orange-secondary)", source: 1 },
    ],
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
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
              {copy.title} <span className="text-crimson">{copy.highlight}</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink/70">
              {copy.description}
            </p>
          </div>
        </Reveal>

        {/* Track cards — two 101s, then the full bootcamp that combines them */}
        <div className="mt-14 grid items-stretch gap-x-6 gap-y-10 lg:grid-cols-3 xl:gap-x-8">
          {tracks.map((track, i) => (
            <Reveal key={track.n} delay={i * 130} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-3xl border-[3px] border-ink p-6 pt-9 shadow-[8px_8px_0_0_var(--shadow)] sm:p-7 sm:pt-10 ${
                  track.featured ? "bg-crimson text-cream" : "bg-white text-ink"
                }`}
                style={{ "--shadow": track.color } as React.CSSProperties}
              >
                {/* Price sticker riding the top edge */}
                <span
                  className={`absolute -top-5 right-5 rounded-xl border-2 border-ink px-3.5 py-1.5 font-mono text-base font-bold tracking-tight shadow-[4px_4px_0_0_var(--ink)] ${
                    track.featured
                      ? "bg-yellow-main text-ink"
                      : "bg-crimson text-white"
                  }`}
                  style={{ transform: `rotate(${track.stickerRotate})` }}
                >
                  {track.price}
                </span>

                {/* Card header */}
                <div className="flex items-center gap-3.5">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                    style={{ background: track.color }}
                  >
                    {track.icon}
                  </span>
                  <p
                    className={`font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${
                      track.featured ? "text-yellow-main" : "text-crimson"
                    }`}
                  >
                    {copy.track} {track.n} · {track.tag}
                  </p>
                </div>

                <h3 className="mt-4 font-display text-[1.35rem] font-extrabold uppercase leading-[1.1] tracking-tight sm:text-2xl">
                  {track.name}
                </h3>

                <p className="mt-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
                      track.featured
                        ? "border-cream/30 text-yellow-main"
                        : "border-ink/15 text-crimson"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        track.featured ? "bg-yellow-main" : "bg-crimson"
                      }`}
                    />
                    {track.duration}
                  </span>
                </p>

                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    track.featured ? "text-cream/80" : "text-ink/70"
                  }`}
                >
                  {track.blurb}
                </p>

                <div
                  className={`mt-5 border-t-2 border-dashed ${
                    track.featured ? "border-cream/25" : "border-ink/15"
                  }`}
                />

                {track.featured && (
                  <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-yellow-main">
                    ★ {copy.combined}
                  </p>
                )}

                {/* What's inside */}
                <ul className={`${track.featured ? "mt-4" : "mt-5"} space-y-4`}>
                  {track.items.map(([title, detail], itemIndex) => (
                    <li key={title} className="flex gap-3">
                      {track.refs ? (
                        <span
                          className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink font-mono text-[11px] font-bold text-ink"
                          style={{ background: track.refs[itemIndex].color }}
                        >
                          {track.refs[itemIndex].n}
                        </span>
                      ) : (
                        <span
                          className="mt-1 size-3.5 shrink-0 rounded border-2 border-ink"
                          style={{ background: track.color }}
                        />
                      )}
                      <div>
                        <p className="font-display text-sm font-bold uppercase tracking-tight">
                          {title}
                        </p>
                        <p
                          className={`mt-0.5 text-[13px] leading-snug ${
                            track.featured ? "text-cream/70" : "text-ink/60"
                          }`}
                        >
                          {detail}
                        </p>
                        {track.refs && (
                          <span className="mt-2.5 flex flex-wrap gap-1.5">
                            {copy.tracks[track.refs[itemIndex].source].items.map(
                              ([topic]) => (
                                <span
                                  key={topic}
                                  className="rounded-full border border-cream/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream/80"
                                >
                                  {topic}
                                </span>
                              ),
                            )}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto pt-7">
                  {track.applySlug ? (
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
                  ) : (
                    <TrackedAnchor
                      event="line_click"
                      params={{ location: "curriculum" }}
                      href={siteConfig.lineAddUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={CTA_CLASS}
                    >
                      {track.cta}
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </TrackedAnchor>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-center font-mono text-xs text-ink/50">
            ※ {copy.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
