import { Suspense } from "react";
import { ApplyForm } from "@/components/apply-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SlimHeader } from "@/components/navbar";
import { TrackedAnchor } from "@/components/track";
import { Eyebrow } from "@/components/ui";
import { getUpcomingCourses, pickCourse } from "@/lib/courses";
import { localePath, type ApplyCopy, type Dictionary, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type ApplyPageProps = {
  locale: Locale;
  copy: Dictionary;
  /** raw `?course=` value — id or slug */
  course?: string | string[];
};

export function ApplyPage({ locale, copy: dictionary, course }: ApplyPageProps) {
  const copy = dictionary.apply;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SlimHeader home={localePath(locale)} className="max-w-3xl px-5 py-5 sm:px-8">
        <LanguageSwitcher label={dictionary.nav.language} />
      </SlimHeader>

      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8 sm:px-8 sm:pt-14">
        <Eyebrow className="hero-rise">{copy.eyebrow}</Eyebrow>

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

        <p
          className="hero-rise mt-3 max-w-xl text-sm leading-relaxed text-ink/60"
          style={{ animationDelay: "0.2s" }}
        >
          {copy.privateTraining.text}{" "}
          <TrackedAnchor
            event="line_click"
            params={{ location: "apply_private_training" }}
            href={siteConfig.lineAddUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink underline decoration-2 underline-offset-4 transition-colors hover:text-crimson"
          >
            {copy.privateTraining.link} →
          </TrackedAnchor>
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

type FormProps = { locale: Locale; copy: ApplyCopy; course: ApplyPageProps["course"] };

async function Form({ locale, copy, course }: FormProps) {
  const courses = await getUpcomingCourses(locale);

  return (
    <ApplyForm
      locale={locale}
      copy={copy}
      courses={courses}
      preselected={pickCourse(courses, course)}
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
