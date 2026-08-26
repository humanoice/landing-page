import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { localePath, type HomeDictionary, type Locale } from "@/lib/i18n";
import { TrackedAnchor } from "@/components/track";
import { siteConfig } from "@/lib/site";

type SiteFooterProps = { locale: Locale; copy: HomeDictionary };

export function SiteFooter({ locale, copy }: SiteFooterProps) {
  const nav = [
    { label: copy.nav.curriculum, href: "#curriculum" },
    { label: copy.nav.team, href: "#team" },
    { label: copy.nav.partners, href: "#partners" },
  ];

  return (
    <footer className="relative overflow-hidden bg-crimson text-cream">
      {/* mission ticker as the section's top edge */}
      <Marquee
        items={[copy.footer.ticker]}
        speed="30s"
        sep="✦"
        className="border-y-2 border-cream/20 bg-ink py-3 text-yellow-main"
        itemClassName="font-display text-sm font-black uppercase tracking-[0.2em]"
        sepClassName="text-crimson"
      />

      <div
        aria-hidden
        className="dots pointer-events-none absolute inset-0 opacity-30"
        style={{ "--dot": "rgba(250,226,81,0.25)" } as React.CSSProperties}
      />

      {/* Big closing CTA */}
      <div id="apply" className="relative isolate z-10 scroll-mt-20 overflow-hidden bg-ink">
        <Image
          src="/roboparty-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-ink/55 sm:bg-gradient-to-r sm:from-ink/85 sm:via-ink/55 sm:to-ink/30"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div className="flex items-end">
              <TrackedAnchor
                event="line_click"
                params={{ location: "footer_qr" }}
                href={siteConfig.lineAddUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={copy.footer.qrLabel}
                className="group relative block shrink-0 rounded-[1.35rem] bg-cream p-3 shadow-[6px_6px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-main"
              >
                <Image
                  src={siteConfig.lineQrUrl}
                  alt={copy.footer.qrLabel}
                  width={220}
                  height={220}
                  sizes="(max-width: 639px) 180px, 220px"
                  className="size-[180px] rounded-xl sm:size-[220px]"
                />
              </TrackedAnchor>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
                {copy.footer.location}
              </p>
              <h2 className="mt-5 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight">
                {copy.footer.title}
                <br />
                <span className="text-yellow-main">{copy.footer.highlight}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t-2 border-cream/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href={localePath(locale)} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border-2 border-cream/30 bg-white">
              <Image src="/logo.png" alt="Humanoice" width={30} height={30} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-base font-extrabold tracking-tight">
                ฮิวแมนน้อย
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-yellow-main">
                Humanoice
              </span>
            </span>
          </Link>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-cream/70 transition-colors hover:text-yellow-main"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <TrackedAnchor
              event="line_click"
              params={{ location: "footer_social" }}
              href={siteConfig.lineAddUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow Humanoice on LINE"
              className="group inline-flex size-8 items-center justify-center rounded-md transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-main"
            >
              <Image
                src="/line-logo.png"
                alt="LINE"
                width={28}
                height={28}
                className="invert transition-transform group-hover:scale-110"
              />
            </TrackedAnchor>

            <p className="font-mono text-xs uppercase tracking-[0.14em] text-cream/50">
              © 2026 Humanoice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
