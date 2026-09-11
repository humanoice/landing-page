"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Arrow,
  BusyNote,
  CHIP,
  CTA,
  CTA_BUSY,
  ERROR,
  LABEL,
  LineCta,
  META,
  OutcomePanel,
  PILL,
  Section,
  TextField,
} from "@/components/apply-ui";
import { PaymentPanel } from "@/components/payment-panel";
import { track } from "@/components/track";
import {
  lookupApplicant,
  submitApplication,
  type ApplyErrors,
  type ApplyPrefill,
  type ApplyState,
  type ApplyValues,
} from "@/app/apply/actions";
import { EMAIL, LANGUAGES, PROGRAMMING_LANGUAGES, SKILLS } from "@/lib/apply-options";
import type { CourseOption } from "@/lib/courses";
import type { ApplyCopy, Locale } from "@/lib/i18n";
import {
  amountDueFor,
  formatThb,
  isPayerType,
  PAYER_TYPES,
  withholding,
  type PayerType,
} from "@/lib/payment";

type ApplyFormProps = {
  locale: Locale;
  copy: ApplyCopy;
  courses: CourseOption[];
  /** Course id to pre-tick, from `?course=` */
  preselected?: number;
};

const INITIAL: ApplyState = { status: "idle" };

/** Everything the applicant types. The runs they pick live in their own state — a lookup never touches those. */
type FormValues = Omit<ApplyValues, "courses">;
type ChipField = "languages" | "programmingLanguages" | "skills";
type TextName = Exclude<keyof FormValues, ChipField | "payerType">;

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
  payerType: "",
  receiptName: "",
  receiptTaxId: "",
  receiptAddress: "",
};

/** Long enough that typing an address doesn't fire a query per keystroke. */
const LOOKUP_DELAY = 500;

type Lookup =
  | { status: "idle" }
  | { status: "checking" }
  /** `offer`: we know them, but the form already had answers in it — filling it in is their call. */
  | { status: "found"; prefill: ApplyPrefill; offer: boolean };

export function ApplyForm({ locale, copy, courses, preselected }: ApplyFormProps) {
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

  // Depend only on props, so a keystroke in any of the ~17 text fields doesn't
  // re-sort the runs and rebuild three option lists.
  const groups = useMemo(() => groupByTrack(courses), [courses]);
  const chipOptions = useMemo(
    () => ({
      languages: LANGUAGES.map((code) => [code, copy.languages[code]] as [string, string]),
      programmingLanguages: PROGRAMMING_LANGUAGES.map(
        (code) => [code, copy.programmingLanguages[code]] as [string, string],
      ),
      skills: SKILLS.map((code) => [code, copy.skills[code]] as [string, string]),
    }),
    [copy],
  );

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
    return <SuccessPanel copy={copy.success} />;
  }
  if (state.status === "pay") {
    return <PaymentPanel payment={state.payment} copy={copy} locale={locale} />;
  }

  const errors: ApplyErrors = state.status === "error" ? state.errors : {};
  const message = (key: keyof ApplyErrors) => (errors[key] ? copy.errors[errors[key]] : undefined);
  const payer: PayerType | null = isPayerType(values.payerType) ? values.payerType : null;

  return (
    <form action={formAction} noValidate className="space-y-10">
      <input type="hidden" name="locale" value={locale} />

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
          options={chipOptions.languages}
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
          options={chipOptions.programmingLanguages}
          picked={values.programmingLanguages}
          onToggle={toggle}
        />
        <Chips
          className="mt-6"
          name="skills"
          legend={copy.fields.skills}
          options={chipOptions.skills}
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
            <LineCta small className="mt-5" location="apply_no_courses" label={copy.course.line} />
          </div>
        ) : (
          <fieldset aria-invalid={errors.course ? true : undefined}>
            <legend className="sr-only">{copy.sections.course}</legend>
            <div className="space-y-5">
              {groups.map((group) => (
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

      {/* ---------- 04 · Receipt & payment ---------- */}
      {courses.length > 0 && (
        <Section n="04" title={copy.sections.payer} hint={copy.payer.hint} shadow="var(--orange-secondary)">
          <fieldset aria-invalid={errors.payerType ? true : undefined}>
            <legend className="sr-only">{copy.sections.payer}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYER_TYPES.map((type) => (
                <PayerCard
                  key={type}
                  type={type}
                  label={copy.payer[type]}
                  hint={copy.payer[`${type}Hint`]}
                  checked={payer === type}
                  onPick={() => setValues((current) => ({ ...current, payerType: type }))}
                />
              ))}
            </div>
            {errors.payerType && (
              <p role="alert" className={ERROR}>
                {message("payerType")}
              </p>
            )}
          </fieldset>

          {payer && (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-ink/60">
                {payer === "company" ? copy.payer.companyNote : copy.payer.individualNote}
              </p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <TextField
                  name="receiptName"
                  label={copy.payer.fields[payer].name}
                  optional={payer === "individual" ? copy.optional : undefined}
                  autoComplete={payer === "company" ? "organization" : "name"}
                  value={values.receiptName}
                  onValueChange={set}
                  error={message("receiptName")}
                />
                <TextField
                  name="receiptTaxId"
                  label={copy.payer.fields[payer].taxId}
                  optional={payer === "individual" ? copy.optional : undefined}
                  autoComplete="off"
                  inputMode="numeric"
                  value={values.receiptTaxId}
                  onValueChange={set}
                  error={message("receiptTaxId")}
                />
                <div className="sm:col-span-2">
                  <TextField
                    name="receiptAddress"
                    label={copy.payer.fields[payer].address}
                    optional={payer === "individual" ? copy.optional : undefined}
                    autoComplete="street-address"
                    multiline
                    value={values.receiptAddress}
                    onValueChange={set}
                    error={message("receiptAddress")}
                  />
                </div>
              </div>
            </div>
          )}

          <AmountPreview
            copy={copy.payer.preview}
            unit={copy.course.priceUnit}
            picked={picked}
            courses={courses}
            payer={payer}
          />
        </Section>
      )}

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
            className={`${CTA} ${CTA_BUSY}`}
          >
            {pending ? copy.submitting : copy.submit}
            <Arrow />
          </button>
        </div>
      )}
    </form>
  );
}

/* ---------- Pieces ---------- */

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
    return <BusyNote className="mt-2">{copy.checking}</BusyNote>;
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
        <button type="button" onClick={onFill} className={PILL}>
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

type PayerCardProps = {
  type: PayerType;
  label: string;
  hint: string;
  checked: boolean;
  onPick: () => void;
};

/** A radio dressed like a run card: the same tick, the same lift when chosen. */
function PayerCard({ type, label, hint, checked, onPick }: PayerCardProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-ink bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 has-[:checked]:-translate-x-0.5 has-[:checked]:-translate-y-0.5 has-[:checked]:bg-yellow-main has-[:checked]:shadow-[4px_4px_0_0_var(--ink)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-yellow-main/60">
      <input
        type="radio"
        name="payerType"
        value={type}
        checked={checked}
        onChange={onPick}
        className="sr-only"
      />
      <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink bg-white">
        <span className="size-2 rounded-full bg-ink opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-extrabold uppercase leading-tight tracking-tight">
          {label}
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-ink/55">{hint}</span>
      </span>
    </label>
  );
}

type AmountPreviewProps = {
  copy: ApplyCopy["payer"]["preview"];
  unit: string;
  picked: number[];
  courses: CourseOption[];
  payer: PayerType | null;
};

/**
 * What the transfer will be, live, so nobody meets the number for the first
 * time on the payment step. Same arithmetic the action stores (src/lib/payment.ts).
 */
function AmountPreview({ copy, unit, picked, courses, payer }: AmountPreviewProps) {
  const prices = picked.map((id) => courses.find((course) => course.id === id)?.priceThb ?? null);
  const note =
    picked.length === 0 ? copy.pickFirst : prices.some((price) => price === null) ? copy.onRequest : null;

  if (note) {
    return (
      <p className="mt-7 rounded-2xl border-2 border-dashed border-ink/25 bg-cream/60 px-4 py-3 text-center text-sm text-ink/60">
        {note}
      </p>
    );
  }

  const fee = prices.reduce<number>((sum, price) => sum + (price ?? 0), 0);
  const type = payer ?? "individual";
  const held = withholding(fee, type);
  const due = amountDueFor(fee, type);

  return (
    <div className="mt-7 rounded-2xl border-2 border-ink bg-cream p-4 shadow-[4px_4px_0_0_var(--ink)] sm:p-5">
      <p className={`${META} text-ink/45`}>{copy.title}</p>
      <dl className="mt-3 space-y-1.5 font-mono text-sm">
        <div className="flex items-baseline justify-between gap-4 text-ink/70">
          <dt>{copy.fee}</dt>
          <dd>
            {formatThb(fee)} {unit}
          </dd>
        </div>
        {held > 0 && (
          <div className="flex items-baseline justify-between gap-4 text-ink/70">
            <dt>{copy.withholding}</dt>
            <dd>
              − {formatThb(held)} {unit}
            </dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink/10 pt-2 text-base font-bold">
          <dt>{copy.due}</dt>
          <dd className="text-crimson">
            {formatThb(due)} {unit}
          </dd>
        </div>
      </dl>
    </div>
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
  const sharedPrice = group.courses.every((course) => course.priceThb === lead.priceThb);
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
            {lead.priceThb === null ? copy.priceTbd : `${formatThb(lead.priceThb)} ${copy.priceUnit}`}
          </span>
        )}
      </div>

      {sharedDescription && lead.description && (
        <p className="mt-3 text-sm leading-snug text-ink/60">{lead.description}</p>
      )}

      <p className={`${META} mb-2.5 mt-5 flex items-center gap-3 text-ink/45`}>
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
              {full ? copy.full : `${seats.left} ${copy.seatsLeft[seats.left === 1 ? 0 : 1]}`}
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
          {course.priceThb === null ? copy.priceTbd : `${formatThb(course.priceThb)} ${copy.priceUnit}`}
        </span>
      )}
    </label>
  );
}

type SuccessPanelProps = { copy: ApplyCopy["success"] };

/** Saved, but nothing to pay for online — a B2B run, or seats already paid. LINE takes it from here. */
function SuccessPanel({ copy }: SuccessPanelProps) {
  // The conversion. Fires on mount because this panel only renders once the
  // server action has actually written the application.
  useEffect(() => {
    track("generate_lead");
  }, []);

  return (
    <OutcomePanel
      eyebrow={copy.eyebrow}
      title={copy.title}
      highlight={copy.highlight}
      qrLocation="apply_success_qr"
      qrLabel={copy.qrLabel}
    >
      <p className="mt-5 max-w-md leading-relaxed text-cream/80">{copy.body}</p>
      <div className="mt-8">
        <LineCta location="apply_success" label={copy.line} />
      </div>
    </OutcomePanel>
  );
}
