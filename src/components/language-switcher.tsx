"use client";

import { usePathname, useRouter } from "next/navigation";

/** Every bilingual page lives at /path and /th/path, so the twin is the same path with the prefix toggled. */
export function LanguageSwitcher({ label }: { label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.replace(/^\/th(?=\/|$)/, "") || "/";
  const englishHref = path;
  const thaiHref = path === "/" ? "/th" : `/th${path}`;
  const selectedHref = pathname === path ? englishHref : thaiHref;

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
