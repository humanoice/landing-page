import Image from "next/image";
import Link from "next/link";
import type { HomeDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type HeroProps = { copy: HomeDictionary["hero"] };

export function Hero({ copy }: HeroProps) {
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
            <a
              href={siteConfig.lineAddUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]"
            >
              {copy.join}
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* ---------- Right: waving mascot in a framed badge ---------- */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {/* speech bubble */}
          <div
            className="pop-in absolute -left-2 -top-4 z-20 rotate-[-5deg] rounded-2xl border-2 border-ink bg-white px-4 py-2 shadow-[4px_4px_0_0_var(--ink)] sm:-left-6"
            style={{ "--rot": "-5deg", animationDelay: "0.9s" } as React.CSSProperties}
          >
            <span className="font-display text-base font-extrabold text-ink">
              สวัสดี!
            </span>
          </div>

          {/* rotated badge frame holding the mascot */}
          <div
            className="hero-rise relative rotate-[3deg] rounded-[2rem] border-[3px] border-ink bg-cream p-6 shadow-[12px_12px_0_0_var(--yellow-main)] sm:p-10"
            style={{ animationDelay: "0.4s" }}
          >
            <div
              className="dots absolute inset-0 rounded-[2rem] opacity-50"
              style={{ "--dot": "rgba(189,17,74,0.14)" } as React.CSSProperties}
              aria-hidden
            />
            <Image
              src="/logo.png"
              alt="The Humanoice mascot — a smiling humanoid hidden in the letter H"
              width={420}
              height={420}
              preload
              className="wave relative mx-auto h-auto w-full max-w-[320px]"
            />
            <span
              className="pop-in absolute -bottom-4 -right-3 z-20 rotate-[8deg] rounded-full border-2 border-ink bg-crimson px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[3px_3px_0_0_var(--ink)]"
              style={{ "--rot": "8deg", animationDelay: "1.05s" } as React.CSSProperties}
            >
              ★ Est. 2026
            </span>
          </div>
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
