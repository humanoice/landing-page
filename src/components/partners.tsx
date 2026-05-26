import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function Partners() {
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
            // Open-Source Partners
          </p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight">
              We build on <span className="text-yellow-main">open robots.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-cream/70">
              Our students learn on real, open-source humanoid platforms — the
              same hardware shaping the future of robotics worldwide.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Featured partner */}
          <Reveal>
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
              Asimov 1, Here Be Dragons Edition - Open-source humanoid robot by Menlo Research.
              </p>
            </article>
          </Reveal>

          {/* Become a partner CTA */}
          <Reveal delay={260}>
            <Link
              href="https://airtable.com/appUH4Cp6jG720uUL/pagoe00CRjfglXwch/form"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full min-h-[15rem] flex-col justify-between rounded-3xl border-[3px] border-ink bg-crimson p-7 shadow-[8px_8px_0_0_var(--yellow-main)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--yellow-main)]"
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-main">
                Build with us
              </span>
              <span className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-cream">
                Open-source
                <br />
                a humanoid?
                <br />
                <span className="inline-flex items-center gap-2 text-yellow-main">
                  Partner up
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
