import Image from "next/image";
import Link from "next/link";
import { EarlyList } from "@/components/early-list";
import { Marquee } from "@/components/marquee";

const NAV = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "Builders", href: "#team" },
  { label: "Partners", href: "#partners" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-crimson text-cream">
      {/* mission ticker as the section's top edge */}
      <Marquee
        items={["Make Thailand the Shenzhen of Southeast Asia"]}
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
      <div
        id="early-list"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
              Bangkok, Thailand
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight">
              Doors open
              <br />
              <span className="text-yellow-main">Q4 2026.</span>
            </h2>
          </div>

          <div>
            <p className="text-base leading-relaxed text-cream/80">
              Be first through the door. Get the curriculum, open days, and
              enrollment news before anyone else.
            </p>
            <div className="mt-6">
              <EarlyList />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t-2 border-cream/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border-2 border-cream/30 bg-white">
              <Image src="/logo.png" alt="Humanoice" width={24} height={24} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-base font-extrabold tracking-tight">
                ฮิวแมนน้อยส์
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-yellow-main">
                Humanoice
              </span>
            </span>
          </Link>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
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

          <p className="font-mono text-xs uppercase tracking-[0.14em] text-cream/50">
            © 2026 Humanoice
          </p>
        </div>
      </div>
    </footer>
  );
}
