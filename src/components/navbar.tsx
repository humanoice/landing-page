import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DesktopNav, MobileNav, type NavLinks } from "@/components/nav-menu";
import { TrackedLink } from "@/components/track";
import {
  applyPath,
  EDUCATION_SEGMENTS,
  educationPath,
  localePath,
  type HomeDictionary,
  type Locale,
} from "@/lib/i18n";

type NavbarProps = { locale: Locale; copy: HomeDictionary };

/** The site's page links — the navbar's dropdown and the footer's list are both built from this. */
export function siteLinks(locale: Locale, copy: HomeDictionary): NavLinks {
  return {
    education: {
      label: copy.nav.education,
      items: EDUCATION_SEGMENTS.map((segment) => ({
        label: copy.education.segments[segment].nav,
        hint: copy.education.segments[segment].hint,
        href: educationPath(locale, segment),
      })),
    },
    about: { label: copy.nav.about, href: localePath(locale, "/about") },
  };
}

export function Navbar({ locale, copy }: NavbarProps) {
  const links = siteLinks(locale, copy);
  const languageSwitcher = <LanguageSwitcher label={copy.nav.language} />;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        {/* Brand */}
        <Link href={localePath(locale)} className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[3px_3px_0_0_var(--ink)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
            {/* Sized against the mark's own margin, not the badge, so the cat
                fills the frame the way the favicon does. */}
            <Image
              src="/logo.png"
              alt="Humanoice"
              width={34}
              height={34}
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

        <DesktopNav links={links} />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">{languageSwitcher}</div>
          <TrackedLink
            event="apply_click"
            params={{ location: "navbar" }}
            href={applyPath(locale)}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-crimson px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[3px_3px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)] sm:px-5"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-yellow-main" />
            {copy.nav.apply}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </TrackedLink>
          <MobileNav links={links} label={copy.nav.menu}>
            {languageSwitcher}
          </MobileNav>
        </div>
      </nav>
    </header>
  );
}

/**
 * The slim, non-sticky header of a single-purpose page (/apply, /master-plan):
 * logo badge and wordmark home, whatever the page needs on the right.
 * `className` sets the page's measure and gutter.
 */
export function SlimHeader({
  home,
  className,
  children,
}: {
  home: string;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={`mx-auto flex items-center justify-between gap-4 ${className}`}>
      <Link href={home} className="group flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-200 group-hover:rotate-[-4deg]">
          <Image src="/logo.png" alt="Humanoice" width={30} height={30} />
        </span>
        <span className="font-display text-base font-extrabold tracking-tight">ฮิวแมนน้อย</span>
      </Link>
      {children}
    </header>
  );
}
