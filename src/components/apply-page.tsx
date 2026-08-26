import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ApplyForm } from "@/components/apply-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getUpcomingCourses, pickCourse } from "@/lib/courses";
import { localePath, type ApplyCopy, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type ApplyPageProps = {
  locale: Locale;
  copy: ApplyCopy;
  languageLabel: string;
  /** raw `?course=` value — id or slug */
  course?: string | string[];
};

export function ApplyPage({ locale, copy, languageLabel, course }: ApplyPageProps) {
  const home = localePath(locale);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href={home} className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-200 group-hover:rotate-[-4deg]">
            <Image src="/logo.png" alt="Humanoice" width={30} height={30} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">ฮิวแมนน้อย</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher
            locale={locale}
            englishHref={localePath("en", "/apply")}
            thaiHref={localePath("th", "/apply")}
            label={languageLabel}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8 sm:px-8 sm:pt-14">
        <p className="hero-rise flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
          <span className="inline-block h-px w-8 bg-crimson" />
          {copy.eyebrow}
        </p>

        <div className="relative mt-5">
          <h1
            className="hero-rise font-display text-[clamp(2.6rem,8vw,5rem)] font-black uppercase leading-[0.92] tracking-tight"
            style={{ animationDelay: "0.08s" }}
          >
            {copy.heading[0]} <span className="text-crimson">{copy.heading[1]}</span>
          </h1>
          <span
            className="pop-in absolute -top-4 right-0 hidden rounded-full border-2 border-ink bg-yellow-main px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[3px_3px_0_0_var(--ink)] sm:inline-block"
            style={{ "--rot": "6deg", animationDelay: "0.6s" } as React.CSSProperties}
          >
            ★ {copy.sticker}
          </span>
        </div>

        <p
          className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg"
          style={{ animationDelay: "0.16s" }}
        >
          {copy.intro}
        </p>

        {/* The shell above is sent at once; the form waits on the courses query and streams in. */}
        <div className="hero-rise mt-12" style={{ animationDelay: "0.28s" }}>
          <Suspense fallback={<FormSkeleton />}>
            <Form locale={locale} copy={copy} course={course} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function Form({ locale, copy, course }: Pick<ApplyPageProps, "locale" | "copy" | "course">) {
  const courses = await getUpcomingCourses(locale);

  return (
    <ApplyForm
      copy={copy}
      courses={courses}
      preselected={pickCourse(courses, course)}
      lineUrl={siteConfig.lineAddUrl}
    />
  );
}

/** Three ghost cards in the form's footprint, so the layout doesn't jump when it lands. */
function FormSkeleton() {
  return (
    <div className="space-y-10" aria-busy aria-hidden>
      {["var(--yellow-main)", "var(--orange-secondary)", "var(--yellow-main)"].map((shadow, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border-[3px] border-ink/15 bg-white/70 p-6 shadow-[8px_8px_0_0_var(--shadow)] sm:p-8"
          style={{ "--shadow": shadow, opacity: 0.6 } as React.CSSProperties}
        >
          <div className="mb-7 flex items-center gap-3.5">
            <span className="size-10 rounded-xl bg-cream-deep" />
            <span className="h-5 w-40 rounded-md bg-cream-deep" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <span className="h-12 rounded-xl bg-cream-deep" />
            <span className="h-12 rounded-xl bg-cream-deep" />
            <span className="h-12 rounded-xl bg-cream-deep" />
            <span className="h-12 rounded-xl bg-cream-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}
