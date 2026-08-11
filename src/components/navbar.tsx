import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { localePath, type HomeDictionary, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type NavbarProps = { locale: Locale; copy: HomeDictionary["nav"] };

export function Navbar({ locale, copy }: NavbarProps) {
  const links = [
    { label: copy.curriculum, href: "#curriculum", n: "01" },
    { label: copy.team, href: "#team", n: "02" },
    { label: copy.partners, href: "#partners", n: "03" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        {/* Brand */}
        <Link href={localePath(locale)} className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[3px_3px_0_0_var(--ink)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
            <Image
              src="/logo.png"
              alt="Humanoice"
              width={28}
              height={28}
              preload
            />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-extrabold tracking-tight text-ink">
              ฮิวแมนน้อย
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-crimson">
              Humanoice
            </span>
          </span>
        </Link>

        {/* Section links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-crimson"
              >
                <span className="text-crimson/50 group-hover:text-crimson">
                  {link.n}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher
            locale={locale}
            englishHref={localePath("en")}
            thaiHref={localePath("th")}
            label={copy.language}
          />
          <a
            href={siteConfig.lineAddUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-crimson px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[3px_3px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)] sm:px-5"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-yellow-main" />
            {copy.apply}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
