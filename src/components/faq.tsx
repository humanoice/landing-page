import { Reveal } from "@/components/reveal";
import type { HomeDictionary } from "@/lib/i18n";

/**
 * Native <details> — no client JS, works before hydration, and the answers stay
 * in the DOM for crawlers. `ink` is the plus glyph's colour on that accent.
 */
const ACCENTS = [
  { color: "var(--yellow-main)", ink: "text-ink" },
  { color: "var(--orange-secondary)", ink: "text-ink" },
  { color: "var(--red)", ink: "text-cream" },
];

type FaqProps = { copy: HomeDictionary["faq"] };

export function Faq({ copy }: FaqProps) {
  return (
    <section id="faq" className="relative scroll-mt-20 bg-cream py-20 sm:py-28">
      <div
        aria-hidden
        className="dots pointer-events-none absolute inset-0"
        style={{ "--dot": "rgba(27,10,17,0.07)" } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
            <span className="inline-block h-px w-8 bg-crimson" />
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            {copy.title} <span className="text-crimson">{copy.highlight}</span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-4">
          {copy.items.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={item.q} delay={i * 90}>
                <details
                  className="group rounded-3xl border-[3px] border-ink bg-cream-deep shadow-[6px_6px_0_0_var(--shadow)] transition-all duration-200 open:bg-cream hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--shadow)]"
                  style={{ "--shadow": accent.color } as React.CSSProperties}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 rounded-3xl px-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:gap-6 sm:px-7 [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="flex-1 font-display text-base font-extrabold leading-snug tracking-tight text-ink sm:text-lg">
                      {item.q}
                    </h3>
                    <span
                      aria-hidden
                      className={`grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform duration-200 group-open:rotate-45 ${accent.ink}`}
                      style={{ background: accent.color }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>

                  {/* Answers land here — see `faq.items` in src/lib/i18n.ts. */}
                  <div className="mx-5 border-t-2 border-dashed border-ink/15 pb-6 pt-5 sm:mx-7">
                    <p className="max-w-3xl text-sm leading-relaxed text-ink/70">
                      {item.a}
                    </p>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
