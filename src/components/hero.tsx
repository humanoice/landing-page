import { HeroReel } from "@/components/hero-reel";
import { TrackedLink } from "@/components/track";
import { applyPath, type HomeDictionary, type Locale } from "@/lib/i18n";

type HeroProps = { locale: Locale; copy: HomeDictionary["hero"] };

export function Hero({ locale, copy }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-crimson text-cream">
      {/* Atmosphere: blueprint grid + warm core glow + floating pills */}
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
            "radial-gradient(60% 55% at 68% 38%, rgba(250,226,81,0.22) 0%, rgba(189,17,74,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="float pointer-events-none absolute -left-16 top-24 size-56 rounded-full border-2 border-yellow-main/25"
      />
      <div
        aria-hidden
        className="float pointer-events-none absolute right-[8%] top-10 h-10 w-40 rounded-full border-2 border-cream/15"
        style={{ animationDelay: "1.4s" }}
      />
      <div
        aria-hidden
        className="dots pointer-events-none absolute -bottom-10 left-1/3 size-48 opacity-40"
        style={{ "--dot": "rgba(250,226,81,0.4)" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.25fr_0.9fr] lg:gap-8 lg:pb-28 lg:pt-24">
        {/* ---------- Left: message ---------- */}
        <div>
          <p className="hero-rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
            <span className="inline-block h-px w-8 bg-yellow-main" />
            {copy.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,8.5vw,6rem)] font-black uppercase leading-[0.92] tracking-tight">
            <span className="line-mask">
              <span className="line-inner" style={{ animationDelay: "0.05s" }}>
                {copy.title[0]}
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner" style={{ animationDelay: "0.18s" }}>
                {copy.title[1]}
              </span>
            </span>
            <span className="line-mask">
              <span
                className="line-inner text-yellow-main"
                style={{ animationDelay: "0.31s" }}
              >
                {copy.title[2]}
              </span>
            </span>
          </h1>

          <p
            className="hero-rise mt-7 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg"
            style={{ animationDelay: "0.55s" }}
          >
            {copy.description}
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.7s" }}
          >
            <TrackedLink
              event="apply_click"
              params={{ location: "hero" }}
              href={applyPath(locale)}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]"
            >
              {copy.join}
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </TrackedLink>
          </div>
        </div>

        {/* ---------- Right: the bench window ---------- */}
        <div
          className="hero-rise mx-auto w-fit"
          style={{ animationDelay: "0.4s" }}
        >
          <HeroReel
            alt={copy.reel.alt}
            className="w-[min(64vw,252px)] sm:w-[268px] lg:w-[300px]"
          />
        </div>
      </div>

      {/* ---------- Spec bar ---------- */}
      <div className="relative z-10 border-t-2 border-cream/20">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-cream/15 sm:grid-cols-4 sm:divide-x">
          {copy.facts.map(([label, value]) => (
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
  );
}
