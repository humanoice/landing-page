"use client";

import Image from "next/image";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { track, TrackedAnchor } from "@/components/track";
import {
  lookupApplicant,
  submitApplication,
  type ApplyErrors,
  type ApplyPrefill,
  type ApplyState,
  type ApplyValues,
} from "@/app/apply/actions";
import { LANGUAGES, PROGRAMMING_LANGUAGES, SKILLS } from "@/lib/apply-options";
import type { CourseOption } from "@/lib/courses";
import type { ApplyCopy } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type ApplyFormProps = {
  copy: ApplyCopy;
  courses: CourseOption[];
  /** Course id to pre-tick, from `?course=` */
  preselected?: number;
  lineUrl: string;
};

const LABEL =
  "mb-2 flex items-baseline gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70";
const INPUT =
  "w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-base text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none transition-all duration-200 placeholder:text-ink/30 focus-visible:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-yellow-main/60 aria-invalid:border-crimson aria-invalid:shadow-[3px_3px_0_0_var(--red)]";
const ERROR = "mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-crimson";
const CHIP =
  "inline-flex cursor-pointer select-none items-center rounded-full border-2 border-ink bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[2px_2px_0_0_var(--ink)] transition-all duration-150 hover:-translate-y-0.5 has-[:checked]:bg-ink has-[:checked]:text-yellow-main has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-yellow-main/60";
const CTA =
  "group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]";

const INITIAL: ApplyState = { status: "idle" };

/** Everything the applicant types. The runs they pick live in their own state — a lookup never touches those. */
type FormValues = Omit<ApplyValues, "courses">;
type ChipField = "languages" | "programmingLanguages" | "skills";
type TextName = Exclude<keyof FormValues, ChipField>;

const EMPTY: FormValues = {
  firstName: "",
  lastName: "",
  nickname: "",
  email: "",
  phone: "",
  lineId: "",
  jobTitle: "",
  company: "",
  languages: [],
  roboticsYears: "",
  programmingYears: "",
  programmingLanguages: [],
  skills: [],
};

/** Same shape the action validates with; here it only decides when an address is worth asking about. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Long enough that typing an address doesn't fire a query per keystroke. */
const LOOKUP_DELAY = 500;

type Lookup =
  | { status: "idle" }
  | { status: "checking" }
  /** `offer`: we know them, but the form already had answers in it — filling it in is their call. */
  | { status: "found"; prefill: ApplyPrefill; offer: boolean };

export function ApplyForm({ copy, courses, preselected, lineUrl }: ApplyFormProps) {
  const [state, formAction, pending] = useActionState(submitApplication, INITIAL);
  // Seeded from the action's echo, so a submit that fails without JS comes back filled in.
  const [values, setValues] = useState<FormValues>(() =>
    state.status === "error" ? { ...state.values } : EMPTY,
  );
  // The runs they've ticked. One per track, so a second pick in a track replaces
  // the first — but a track is optional, and picking none of them isn't.
  const [picked, setPicked] = useState<number[]>(() => {
    const open = new Set(courses.filter((course) => !isFull(course)).map((course) => course.id));
    const seeded =
      state.status === "error"
        ? state.values.courses.map(Number)
        : preselected !== undefined
          ? [preselected]
          : [];
    return seeded.filter((id) => open.has(id));
  });
  const [lookup, setLookup] = useState<Lookup>({ status: "idle" });
  /** Anything but the email touched by hand since the last fill? Then it isn't ours to overwrite. */
  const touched = useRef(false);
  /** Last address the server answered for, so re-renders don't ask again. */
  const asked = useRef<string | null>(null);

  const fill = useCallback((prefill: ApplyPrefill) => {
    setValues((current) => ({ ...current, ...prefill }));
    touched.current = false;
  }, []);

  const email = values.email.trim();

  // Once the address looks complete, ask quietly whether we already know them.
  // A miss says nothing at all: whether an address is on file isn't the form's
  // to announce.
  useEffect(() => {
    const key = email.toLowerCase();
    if (asked.current === key) return;
    // Whatever note is on screen belongs to the address they just edited away from.
    setLookup((current) => (current.status === "idle" ? current : { status: "idle" }));
    if (!EMAIL.test(email)) return;

    let live = true;
    const timer = setTimeout(async () => {
      setLookup({ status: "checking" });
      let prefill: ApplyPrefill | null = null;
      try {
        prefill = await lookupApplicant(email);
      } catch {
        // Offline, or the action never landed. Silent — an empty form still works.
      }
      if (!live) return;

      asked.current = key;
      if (!prefill) {
        setLookup({ status: "idle" });
        return;
      }
      track("apply_prefill");
      const offer = touched.current;
      if (!offer) fill(prefill);
      setLookup({ status: "found", prefill, offer });
    }, LOOKUP_DELAY);

    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [email, fill]);

  const set = (name: TextName, value: string) => {
    // Typing the email is what starts a lookup, so it can't be what blocks one.
    if (name !== "email") touched.current = true;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const toggle = (name: ChipField, code: string) => {
    touched.current = true;
    setValues((current) => ({
      ...current,
      [name]: current[name].includes(code)
        ? current[name].filter((value) => value !== code)
        : [...current[name], code],
    }));
  };

  const trackOf = (id: number) => courses.find((course) => course.id === id)?.trackNo ?? null;

  /** Tick a run — or untick it, which is how a track someone changed their mind about gets dropped. */
  const pick = (course: CourseOption) => {
    setPicked((current) =>
      current.includes(course.id)
        ? current.filter((id) => id !== course.id)
        : [...current.filter((id) => trackOf(id) !== course.trackNo), course.id],
    );
  };

  const clearTrack = (trackNo: number | null) => {
    setPicked((current) => current.filter((id) => trackOf(id) !== trackNo));
  };

  if (state.status === "success") {
    return <SuccessPanel copy={copy.success} lineUrl={lineUrl} />;
  }

  const errors: ApplyErrors = state.status === "error" ? state.errors : {};
  const message = (key: keyof ApplyErrors) => (errors[key] ? copy.errors[errors[key]] : undefined);

  return (
    <form action={formAction} noValidate className="space-y-10">
      {/* ---------- 01 · About you ---------- */}
      <Section n="01" title={copy.sections.about} shadow="var(--yellow-main)">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* First, and on its own row: it's the key we look everything else up by. */}
          <div className="sm:col-span-2">
            <TextField
              name="email"
              label={copy.fields.email}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onValueChange={set}
              error={message("email")}
            />
            <LookupNote
              lookup={lookup}
              copy={copy.lookup}
              onFill={() => {
                if (lookup.status !== "found") return;
                fill(lookup.prefill);
                setLookup({ ...lookup, offer: false });
              }}
            />
          </div>
          <TextField
            name="firstName"
            label={copy.fields.firstName}
            autoComplete="given-name"
            value={values.firstName}
            onValueChange={set}
            error={message("firstName")}
          />
          <TextField
            name="lastName"
            label={copy.fields.lastName}
            autoComplete="family-name"
            value={values.lastName}
            onValueChange={set}
            error={message("lastName")}
          />
          <TextField
            name="nickname"
            label={copy.fields.nickname}
            optional={copy.optional}
            autoComplete="nickname"
            value={values.nickname}
            onValueChange={set}
          />
          <TextField
            name="jobTitle"
            label={copy.fields.jobTitle}
            optional={copy.optional}
            autoComplete="organization-title"
            value={values.jobTitle}
            onValueChange={set}
          />
          <TextField
            name="phone"
            label={copy.fields.phone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onValueChange={set}
            error={message("phone")}
          />
          <TextField
            name="lineId"
            label={copy.fields.lineId}
            autoComplete="off"
            value={values.lineId}
            onValueChange={set}
            error={message("lineId")}
          />
          <div className="sm:col-span-2">
            <TextField
              name="company"
              label={copy.fields.company}
              optional={copy.optional}
              autoComplete="organization"
              value={values.company}
              onValueChange={set}
            />
          </div>
        </div>

        <Chips
          className="mt-7"
          name="languages"
          legend={copy.fields.languages}
          options={LANGUAGES.map((code) => [code, copy.languages[code]])}
          picked={values.languages}
          onToggle={toggle}
        />
      </Section>

      {/* ---------- 02 · Background ---------- */}
      <Section n="02" title={copy.sections.background} hint={copy.backgroundHint} shadow="var(--orange-secondary)">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="roboticsYears"
            label={copy.fields.roboticsYears}
            optional={copy.optional}
            type="number"
            inputMode="numeric"
            min={0}
            max={80}
            step={1}
            placeholder="0"
            value={values.roboticsYears}
            onValueChange={set}
            error={message("roboticsYears")}
          />
          <TextField
            name="programmingYears"
            label={copy.fields.programmingYears}
            optional={copy.optional}
            type="number"
            inputMode="numeric"
            min={0}
            max={80}
            step={1}
            placeholder="0"
            value={values.programmingYears}
            onValueChange={set}
            error={message("programmingYears")}
          />
        </div>
        <Chips
          className="mt-7"
          name="programmingLanguages"
          legend={copy.fields.programmingLanguages}
          options={PROGRAMMING_LANGUAGES.map((code) => [code, copy.programmingLanguages[code]])}
          picked={values.programmingLanguages}
          onToggle={toggle}
        />
        <Chips
          className="mt-6"
          name="skills"
          legend={copy.fields.skills}
          options={SKILLS.map((code) => [code, copy.skills[code]])}
          picked={values.skills}
          onToggle={toggle}
        />
      </Section>

      {/* ---------- 03 · Pick your track ---------- */}
      <Section
        n="03"
        title={copy.sections.course}
        hint={courses.length > 0 ? copy.courseHint : undefined}
        shadow="var(--yellow-main)"
      >
        {courses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-cream/60 p-6 text-center">
            <p className="text-sm leading-relaxed text-ink/70">{copy.course.empty}</p>
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("line_click", { location: "apply_no_courses" })}
              className={`${CTA} mt-5 px-6 py-3 text-xs shadow-[4px_4px_0_0_var(--ink)]`}
            >
              {copy.course.line}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        ) : (
          <fieldset aria-invalid={errors.course ? true : undefined}>
            <legend className="sr-only">{copy.sections.course}</legend>
            <div className="space-y-5">
              {groupByTrack(courses).map((group) => (
                <TrackGroup
                  key={group.trackNo ?? "other"}
                  group={group}
                  copy={copy.course}
                  picked={picked}
                  onPick={pick}
                  onClear={() => clearTrack(group.trackNo)}
                />
              ))}
            </div>
            {errors.course && (
              <p role="alert" className={ERROR}>
                {message("course")}
              </p>
            )}
          </fieldset>
        )}
      </Section>

      {/* Honeypot — hidden from people, irresistible to bots */}
      <div className="hidden" aria-hidden>
        <label>
          website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errors.form && (
        <p
          role="alert"
          className="rounded-xl border-2 border-crimson bg-crimson/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-crimson"
        >
          {message("form")}
        </p>
      )}

      {courses.length > 0 && (
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={pending}
            onClick={() => track("apply_submit")}
            className={`${CTA} disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[5px_5px_0_0_var(--ink)]`}
          >
            {pending ? copy.submitting : copy.submit}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
    </form>
  );
}

/* ---------- Pieces ---------- */

type SectionProps = {
  n: string;
  title: string;
  hint?: string;
  shadow: string;
  children: React.ReactNode;
};

function Section({ n, title, hint, shadow, children }: SectionProps) {
  return (
    <section
      className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_0_var(--shadow)] sm:p-8"
      style={{ "--shadow": shadow } as React.CSSProperties}
    >
      <div className="mb-7 flex items-center gap-3.5">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink font-mono text-sm font-bold text-ink"
          style={{ background: shadow }}
        >
          {n}
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold uppercase leading-tight tracking-tight sm:text-xl">
            {title}
          </h2>
          {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

type TextFieldProps = {
  name: TextName;
  label: string;
  optional?: string;
  error?: string;
  /** Controlled, so a lookup can drop someone's saved answers straight into the form. */
  value: string;
  onValueChange: (name: TextName, value: string) => void;
} & Pick<
  React.ComponentProps<"input">,
  "type" | "autoComplete" | "inputMode" | "placeholder" | "min" | "max" | "step"
>;

function TextField({ name, label, optional, error, value, onValueChange, ...input }: TextFieldProps) {
  const id = `apply-${name}`;
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {optional && (
          <span className="font-normal normal-case tracking-normal text-ink/40">({optional})</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        className={INPUT}
        value={value}
        onChange={(event) => onValueChange(name, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className={ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}

type LookupNoteProps = {
  lookup: Lookup;
  copy: ApplyCopy["lookup"];
  onFill: () => void;
};

/**
 * The only trace the lookup leaves. Nothing renders on a miss — a first-time
 * applicant sees the plain form they'd have seen anyway.
 */
function LookupNote({ lookup, copy, onFill }: LookupNoteProps) {
  if (lookup.status === "idle") return null;

  if (lookup.status === "checking") {
    return (
      <p
        aria-live="polite"
        className="mt-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink/45"
      >
        <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-ink/50" />
        {copy.checking}
      </p>
    );
  }

  return (
    <div
      aria-live="polite"
      className="pop-in mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl border-2 border-ink bg-yellow-main px-4 py-2.5 shadow-[3px_3px_0_0_var(--ink)]"
      style={{ "--rot": "0deg" } as React.CSSProperties}
    >
      <p className="flex-1 text-[13px] leading-snug text-ink">
        {lookup.offer ? copy.known : copy.found}
      </p>
      {/* Only when they'd already typed something we'd be trampling. */}
      {lookup.offer && (
        <button
          type="button"
          onClick={onFill}
          className="shrink-0 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[2px_2px_0_0_var(--ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {copy.fill}
        </button>
      )}
    </div>
  );
}

type ChipsProps = {
  name: ChipField;
  legend: string;
  options: [code: string, label: string][];
  picked: string[];
  onToggle: (name: ChipField, code: string) => void;
  className?: string;
};

function Chips({ name, legend, options, picked, onToggle, className = "" }: ChipsProps) {
  return (
    <fieldset className={className}>
      <legend className={LABEL}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map(([code, label]) => (
          <label key={code} className={CHIP}>
            <input
              type="checkbox"
              name={name}
              value={code}
              checked={picked.includes(code)}
              onChange={() => onToggle(name, code)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type TrackGroup = {
  /** courses.track_no — 1 Hardware / 2 Software / 3 B2B; null = untracked run */
  trackNo: number | null;
  courses: CourseOption[];
};

/** No seats left → the run can't be applied for, only looked at. */
const isFull = (course: CourseOption) => course.seats !== null && course.seats.left === 0;

const TRACK_ACCENT: Record<number, string> = {
  1: "var(--yellow-main)",
  2: "var(--orange-secondary)",
  3: "var(--red)",
};

/**
 * Runs of the same track differ only by date, so they belong in one box.
 * Hardware before software before B2B — same order as the curriculum section.
 */
function groupByTrack(courses: CourseOption[]): TrackGroup[] {
  const groups: TrackGroup[] = [];
  for (const course of courses) {
    const group = groups.find((g) => g.trackNo === course.trackNo);
    if (group) group.courses.push(course);
    else groups.push({ trackNo: course.trackNo, courses: [course] });
  }
  return groups.sort((a, b) => (a.trackNo ?? 99) - (b.trackNo ?? 99));
}

type TrackGroupProps = {
  group: TrackGroup;
  copy: ApplyCopy["course"];
  picked: number[];
  onPick: (course: CourseOption) => void;
  /** Drops this track's pick — the discoverable half of "click the date again to untick it". */
  onClear: () => void;
};

function TrackGroup({ group, copy, picked, onPick, onClear }: TrackGroupProps) {
  const [lead] = group.courses;
  const trackNo = String(lead.trackNo ?? 0).padStart(2, "0");
  const tag = lead.trackNo ? copy.trackTags[lead.trackNo - 1] : undefined;
  const accent = TRACK_ACCENT[lead.trackNo ?? 0] ?? "var(--yellow-main)";
  // Whatever every run shares gets hoisted into the header, so the options
  // below are just dates. Anything that differs stays on its own row.
  const sharedPrice = group.courses.every((course) => course.price === lead.price);
  const sharedDescription = group.courses.every((course) => course.description === lead.description);
  const chosen = group.courses.some((course) => picked.includes(course.id));

  return (
    <fieldset className="rounded-2xl border-2 border-ink bg-cream p-4 shadow-[4px_4px_0_0_var(--ink)] sm:p-5">
      <legend className="sr-only">{`${copy.track} ${trackNo}${tag ? ` · ${tag}` : ""} — ${lead.name}`}</legend>

      <div className="flex items-start gap-3.5">
        <span
          aria-hidden
          className={`grid size-9 shrink-0 place-items-center rounded-lg border-2 border-ink font-mono text-xs font-bold ${
            lead.trackNo === 1 ? "text-ink" : "text-cream"
          }`}
          style={{ background: accent }}
        >
          {trackNo}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-crimson">
            {copy.track} {trackNo}
            {tag && ` · ${tag}`}
          </p>
          <p className="mt-1 font-display text-base font-extrabold uppercase leading-tight tracking-tight sm:text-lg">
            {lead.name}
          </p>
        </div>
        {sharedPrice && (
          <span className="shrink-0 rounded-lg border-2 border-ink bg-crimson px-2.5 py-1 font-mono text-sm font-bold tracking-tight text-white shadow-[2px_2px_0_0_var(--ink)]">
            {lead.price ? `${lead.price} ${copy.priceUnit}` : copy.priceTbd}
          </span>
        )}
      </div>

      {sharedDescription && lead.description && (
        <p className="mt-3 text-sm leading-snug text-ink/60">{lead.description}</p>
      )}

      <p className="mb-2.5 mt-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">
        {copy.pickDate}
        <span aria-hidden className="h-0.5 flex-1 bg-ink/10" />
        {chosen && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-full border-2 border-ink/25 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/55 transition-colors duration-150 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {copy.clear}
          </button>
        )}
      </p>
      <div className="space-y-2.5">
        {group.courses.map((course) => (
          <CourseOption
            key={course.id}
            course={course}
            copy={copy}
            checked={picked.includes(course.id)}
            onPick={() => onPick(course)}
            showPrice={!sharedPrice}
            showDescription={!sharedDescription}
          />
        ))}
      </div>
    </fieldset>
  );
}

type CourseOptionProps = {
  course: CourseOption;
  copy: ApplyCopy["course"];
  /** Controlled: picking a date in this track unticks whatever the track had before. */
  checked: boolean;
  onPick: () => void;
  showPrice: boolean;
  showDescription: boolean;
};

function CourseOption({ course, copy, checked, onPick, showPrice, showDescription }: CourseOptionProps) {
  const dayUnit = copy.dayUnit[course.days === 1 ? 0 : 1];
  const seats = course.seats;
  const full = isFull(course);
  // Turn red when it's getting tight — two left is when people should hurry.
  const seatsTone = full
    ? "border-crimson bg-crimson text-white"
    : seats !== null && seats.left <= 2
      ? "border-crimson text-crimson"
      : "border-ink/25 text-ink/70";

  return (
    <label
      className={`group relative flex items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 sm:px-4 ${
        full
          ? "cursor-not-allowed border-dashed border-ink/30 bg-cream-deep/50"
          : "cursor-pointer border-ink bg-white hover:-translate-y-0.5 has-[:checked]:-translate-x-0.5 has-[:checked]:-translate-y-0.5 has-[:checked]:bg-yellow-main has-[:checked]:shadow-[4px_4px_0_0_var(--ink)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-yellow-main/60"
      }`}
    >
      <input
        type="checkbox"
        name="course"
        value={course.id}
        checked={checked}
        onChange={onPick}
        disabled={full}
        className="sr-only"
      />
      {/* Round like a radio: within a track it behaves like one — but it unticks. */}
      <span
        aria-hidden
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
          full ? "border-ink/30 bg-cream" : "border-ink bg-white"
        }`}
      >
        <span className="size-2 rounded-full bg-ink opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
      </span>

      <span className={`min-w-0 flex-1 ${full ? "opacity-55" : ""}`}>
        <span className="block font-mono text-[13px] font-bold leading-tight tracking-tight sm:text-sm">
          {course.dates}
        </span>
        {/* Seats ride along with the meta line so narrow screens wrap instead of squeezing. */}
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] text-ink/60">
          <span>{course.hours}</span>
          <span aria-hidden>·</span>
          <span>
            {course.days} {dayUnit}
          </span>
          {seats && (
            <span
              className={`rounded-full border-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${seatsTone}`}
            >
              {full ? copy.full : `${seats.left}/${seats.total} ${copy.seatsLeft}`}
            </span>
          )}
        </span>
        {showDescription && course.description && (
          <span className="mt-1.5 block text-sm leading-snug text-ink/60">{course.description}</span>
        )}
      </span>

      {showPrice && (
        <span
          className={`shrink-0 rounded-lg border-2 border-ink bg-crimson px-2.5 py-1 font-mono text-xs font-bold tracking-tight text-white shadow-[2px_2px_0_0_var(--ink)] ${
            full ? "opacity-55" : ""
          }`}
        >
          {course.price ? `${course.price} ${copy.priceUnit}` : copy.priceTbd}
        </span>
      )}
    </label>
  );
}

type SuccessPanelProps = { copy: ApplyCopy["success"]; lineUrl: string };

function SuccessPanel({ copy, lineUrl }: SuccessPanelProps) {
  // The conversion. Fires on mount because this panel only renders once the
  // server action has actually written the application.
  useEffect(() => {
    track("generate_lead");
  }, []);

  return (
    <section
      className="pop-in rounded-3xl border-[3px] border-ink bg-crimson p-7 text-cream shadow-[10px_10px_0_0_var(--yellow-main)] sm:p-10"
      style={{ "--rot": "0deg" } as React.CSSProperties}
      aria-live="polite"
    >
      <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
            <span className="inline-block h-px w-8 bg-yellow-main" />
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight">
            {copy.title}
            <br />
            <span className="text-yellow-main">{copy.highlight}</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-cream/80">{copy.body}</p>
          <div className="mt-8">
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("line_click", { location: "apply_success" })}
              className={CTA}
            >
              {copy.line}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* Same QR as the footer — on desktop it's the fastest way to add us. */}
        <TrackedAnchor
          event="line_click"
          params={{ location: "apply_success_qr" }}
          href={lineUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={copy.qrLabel}
          className="block shrink-0 justify-self-start rounded-[1.35rem] bg-cream p-3 shadow-[6px_6px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-main sm:justify-self-end"
        >
          <Image
            src={siteConfig.lineQrUrl}
            alt={copy.qrLabel}
            width={200}
            height={200}
            sizes="(max-width: 639px) 150px, 180px"
            className="size-[150px] rounded-xl sm:size-[180px]"
          />
        </TrackedAnchor>
      </div>
    </section>
  );
}
