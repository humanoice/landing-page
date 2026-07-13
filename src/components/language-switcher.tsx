"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
  englishHref: string;
  thaiHref: string;
  label: string;
};

export function LanguageSwitcher({
  locale,
  englishHref,
  thaiHref,
  label,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const selectedHref = locale === "en" ? englishHref : thaiHref;

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={selectedHref}
        onChange={(event) => router.push(event.target.value)}
        className="h-10 appearance-none rounded-full border-2 border-ink bg-white py-2 pl-3 pr-8 font-mono text-xs font-bold tracking-[0.08em] text-ink shadow-[2px_2px_0_0_var(--ink)] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-yellow-main/60"
        aria-label={label}
      >
        <option value={englishHref}>🇬🇧 EN</option>
        <option value={thaiHref}>🇹🇭 TH</option>
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 text-[10px]">
        ▾
      </span>
    </label>
  );
}
