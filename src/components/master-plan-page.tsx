import Image from "next/image";
import Link from "next/link";
import type { MasterPlanCopy } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type MasterPlanPageProps = { copy: MasterPlanCopy };

export function MasterPlanPage({ copy }: MasterPlanPageProps) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-200 group-hover:rotate-[-4deg]">
            <Image src="/logo.png" alt="Humanoice" width={24} height={24} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">ฮิวแมนน้อยส์</span>
        </Link>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-crimson"
        >
          ← {copy.home}
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-28 pt-10 sm:pt-16">
        <p className="hero-rise font-mono text-xs uppercase tracking-[0.28em] text-crimson">{copy.title}</p>
        <h1 className="hero-rise mt-5 font-display text-[clamp(2.4rem,7vw,4rem)] font-black uppercase leading-[0.95] tracking-tight" style={{ animationDelay: "0.08s" }}>
          {copy.heading}
        </h1>
        <p className="hero-rise mt-6 font-mono text-xs uppercase tracking-[0.16em] text-ink/40" style={{ animationDelay: "0.16s" }}>
          {copy.date}
        </p>

        <div className="mt-14 space-y-7 text-lg leading-relaxed text-ink/80">
          <p>{copy.paragraphs[0]}</p>
          <p>{copy.paragraphs[1]}</p>
          <p>{copy.paragraphs[2]} <span className="font-semibold text-ink">{copy.emphasis}</span></p>
        </div>

        <hr className="mt-16 border-t-2 border-ink/15" />
        <h2 className="mt-12 font-display text-xl font-extrabold uppercase tracking-tight">{copy.short}</h2>
        <ol className="mt-10 space-y-10">
          {copy.steps.map(([title, body], index) => (
            <li key={title} className="flex gap-5 sm:gap-7">
              <span aria-hidden className="font-display text-3xl font-black leading-none text-crimson sm:text-4xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pt-0.5">
                <h3 className="font-display text-lg font-extrabold tracking-tight sm:text-xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 border-t-2 border-ink/15 pt-10">
          <p className="font-display text-xl font-extrabold tracking-tight">
            {copy.closing} <span className="text-crimson">{copy.closingHighlight}</span>
          </p>
          <a
            href={siteConfig.lineAddUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[4px_4px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)]"
          >
            {copy.join}<span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </main>
    </div>
  );
}
