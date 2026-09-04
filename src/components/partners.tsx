import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/track";
import type { HomeDictionary } from "@/lib/i18n";

type PartnersProps = { copy: HomeDictionary["partners"] };

export function Partners({ copy }: PartnersProps) {
  return (
    <section
      id="partners"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-cream sm:py-28"
    >
      {/* atmosphere */}
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
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight">
            {copy.title} <span className="text-yellow-main">{copy.highlight}</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Featured partner */}
          <Reveal>
            <article className="group flex h-full flex-col rounded-3xl border-[3px] border-cream/15 bg-cream p-7 text-ink shadow-[8px_8px_0_0_var(--orange-secondary)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--orange-secondary)]">
              <div className="flex items-center justify-between">
                <Image
                  src="/partners/roboparty.png"
                  alt="Roboparty — ROBOTO ORIGIN open-source humanoid robot"
                  width={72}
                  height={72}
                  className="size-16 rounded-2xl transition-transform duration-200 group-hover:rotate-[-6deg]"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
                Roboparty
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                {copy.roboparty}
              </p>
            </article>
          </Reveal>

          <Reveal delay={130}>
            <article className="group flex h-full flex-col rounded-3xl border-[3px] border-cream/15 bg-cream p-7 text-ink shadow-[8px_8px_0_0_var(--orange-secondary)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--orange-secondary)]">
              <div className="flex items-center justify-between">
                <Image
                  src="/partners/asimov.png"
                  alt="Asimov — open-source humanoid platform"
                  width={72}
                  height={72}
                  className="size-16 rounded-2xl transition-transform duration-200 group-hover:rotate-[-6deg]"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
                Asimov
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                {copy.asimov}
              </p>
            </article>
          </Reveal>

          {/* Become a partner CTA */}
          <Reveal delay={260}>
            <TrackedLink
              event="partner_click"
              params={{ location: "partners" }}
              href="https://airtable.com/appUH4Cp6jG720uUL/pagoe00CRjfglXwch/form"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full min-h-[15rem] flex-col justify-between rounded-3xl border-[3px] border-ink bg-crimson p-7 shadow-[8px_8px_0_0_var(--yellow-main)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--yellow-main)]"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-main">
                {copy.label}
              </span>
              <span className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-cream">
                {copy.callout[0]}
                <br />
                {copy.callout[1]}
                <br />
                <span className="inline-flex items-center gap-2 text-yellow-main">
                  {copy.callout[2]}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </span>
            </TrackedLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
