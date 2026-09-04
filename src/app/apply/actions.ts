"use server";

import { LANGUAGES, PROGRAMMING_LANGUAGES, SKILLS } from "@/lib/apply-options";
import { db } from "@/lib/db";
import { clientKey, LOOKUP, SUBMIT, take } from "@/lib/rate-limit";

/** Everything the form posted, echoed back on error so nothing the applicant typed is lost. */
export type ApplyValues = {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  lineId: string;
  jobTitle: string;
  company: string;
  languages: string[];
  roboticsYears: string;
  programmingYears: string;
  programmingLanguages: string[];
  skills: string[];
  /** Ids of the runs they picked — at most one per track, at least one in total. */
  courses: string[];
};

/**
 * What a returning applicant gets handed back: everything they told us last time
 * except their email (they just typed it) and the runs (they pick those fresh).
 */
export type ApplyPrefill = Omit<ApplyValues, "email" | "courses">;

/** Keys into i18n `apply.errors` — the action stays locale-agnostic. */
export type ApplyErrorCode =
  | "required"
  | "email"
  | "number"
  | "course"
  | "oneTrack"
  | "full"
  | "rateLimit"
  | "server";

export type ApplyErrors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "lineId"
    | "roboticsYears"
    | "programmingYears"
    | "course"
    | "form",
    ApplyErrorCode
  >
>;

export type ApplyState =
  | { status: "idle" }
  | { status: "error"; errors: ApplyErrors; values: ApplyValues }
  | { status: "success" };

const MAX_LENGTH = 200;
/** One run per track caps this in practice; the ceiling is only here to bound a hand-rolled POST. */
const MAX_COURSES = 10;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, MAX_LENGTH) : "";
}

function picks<T extends string>(formData: FormData, key: string, allowed: readonly T[]): T[] {
  return formData
    .getAll(key)
    .filter((value): value is T => typeof value === "string" && (allowed as readonly string[]).includes(value));
}

/** The ticked runs, ids only — anything that isn't one is dropped and the "pick one" check catches it. */
function courseIds(formData: FormData): string[] {
  return formData
    .getAll("course")
    .filter((value): value is string => typeof value === "string" && /^\d+$/.test(value))
    .slice(0, MAX_COURSES);
}

/** "" → undefined (left blank), whole number 0–80 → that number, anything else → "invalid". */
function parseYears(raw: string): number | undefined | "invalid" {
  if (raw === "") return undefined;
  const years = Number(raw);
  return Number.isInteger(years) && years >= 0 && years <= 80 ? years : "invalid";
}

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const values: ApplyValues = {
    firstName: text(formData, "firstName"),
    lastName: text(formData, "lastName"),
    nickname: text(formData, "nickname"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    lineId: text(formData, "lineId"),
    jobTitle: text(formData, "jobTitle"),
    company: text(formData, "company"),
    languages: picks(formData, "languages", LANGUAGES),
    roboticsYears: text(formData, "roboticsYears"),
    programmingYears: text(formData, "programmingYears"),
    programmingLanguages: picks(formData, "programmingLanguages", PROGRAMMING_LANGUAGES),
    skills: picks(formData, "skills", SKILLS),
    courses: courseIds(formData),
  };

  // Honeypot: the field is hidden from people, so anything in it came from a bot.
  // Pretend it worked so the bot moves on.
  if (text(formData, "website")) return { status: "success" };

  // Nothing authenticates this action, so the only thing between a script and an
  // unbounded pile of rows is how often one caller may try. Checked after the
  // honeypot, which costs nothing and gives bots no signal that a limit exists.
  const key = await clientKey();
  if (!take(key, SUBMIT)) {
    console.warn("[apply] rate limited", key);
    return { status: "error", errors: { form: "rateLimit" }, values };
  }

  const errors: ApplyErrors = {};
  if (!values.firstName) errors.firstName = "required";
  if (!values.lastName) errors.lastName = "required";
  if (!values.email) errors.email = "required";
  else if (!EMAIL.test(values.email)) errors.email = "email";
  if (!values.phone) errors.phone = "required";
  if (!values.lineId) errors.lineId = "required";

  const roboticsYears = parseYears(values.roboticsYears);
  if (roboticsYears === "invalid") errors.roboticsYears = "number";
  const programmingYears = parseYears(values.programmingYears);
  if (programmingYears === "invalid") errors.programmingYears = "number";

  // Deduped, so the same run ticked twice can't become two participations.
  const courses = [...new Set(values.courses.map(Number))];
  if (courses.length === 0) errors.course = "course";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  // Only store the survey answers that were actually given (see the `background` comment in db/schema.sql).
  const background: Record<string, number | string[]> = {};
  if (typeof roboticsYears === "number") background.robotics_years = roboticsYears;
  if (typeof programmingYears === "number") background.programming_years = programmingYears;
  if (values.programmingLanguages.length > 0) background.programming_languages = values.programmingLanguages;
  if (values.skills.length > 0) background.skills = values.skills;

  try {
    const sql = db();

    // Same rule as the page's list: every run picked must still be open, with a
    // seat left. A stale tab, a filled-up run, or a hand-crafted POST stops here.
    const open = (await sql`
      select
        c.id,
        c.track_no,
        case
          when c.limit_seat is null then null
          else (c.limit_seat - (
            select count(*) from participations p
            where p.course_id = c.id and p.paid_status
          ))::int
        end as seats_left
      from courses c
      where c.id = any(${courses}::int[]) and c.is_active and c.start_time > now()
    `) as { id: number; track_no: number | null; seats_left: number | null }[];
    if (open.length !== courses.length) {
      return { status: "error", errors: { course: "course" }, values };
    }
    if (open.some((course) => course.seats_left !== null && course.seats_left <= 0)) {
      return { status: "error", errors: { course: "full" }, values };
    }
    // Two runs of the same track are the same content twice — the form won't
    // offer it, so this is only reachable without JS. Untracked runs share a
    // null, which a Set collapses just like the form groups them.
    if (new Set(open.map((course) => course.track_no)).size !== open.length) {
      return { status: "error", errors: { course: "oneTrack" }, values };
    }

    // One statement, so the student row and their participations land together or not at all.
    //
    // Email is the identity (unique index on lower(email), db/schema.sql): a
    // returning applicant updates the row they already have instead of starting a
    // second one. Every column is overwritten, `background` included — the form was
    // filled in from this row, so what came back is the whole record and a field
    // they cleared is a field they meant to clear. `email` itself isn't touched,
    // so the casing we first stored is the casing we keep.
    await sql`
      with student as (
        insert into students
          (first_name, last_name, nickname, email, phone, line_id, job_title, company, languages, background)
        values (
          ${values.firstName},
          ${values.lastName},
          ${values.nickname || null},
          ${values.email || null},
          ${values.phone || null},
          ${values.lineId || null},
          ${values.jobTitle || null},
          ${values.company || null},
          ${values.languages}::text[],
          ${JSON.stringify(background)}::jsonb
        )
        on conflict (lower(email)) do update set
          first_name = excluded.first_name,
          last_name  = excluded.last_name,
          nickname   = excluded.nickname,
          phone      = excluded.phone,
          line_id    = excluded.line_id,
          job_title  = excluded.job_title,
          company    = excluded.company,
          languages  = excluded.languages,
          background = excluded.background
        returning id
      )
      insert into participations (student_id, course_id)
      select student.id, picked.course_id
      from student, unnest(${courses}::int[]) as picked(course_id)
      -- Already applied for a run: their status and payment stay as they are.
      on conflict (student_id, course_id) do nothing
      returning id
    `;

    return { status: "success" };
  } catch (error) {
    console.error("[apply] failed to save application", error);
    return { status: "error", errors: { form: "server" }, values };
  }
}

/* ---------- Looking a returning applicant up ---------- */

/** The columns the form can put back on screen — never the row itself. */
type StudentRow = {
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  phone: string | null;
  line_id: string | null;
  job_title: string | null;
  company: string | null;
  languages: string[] | null;
  background: Record<string, unknown> | null;
};

/** jsonb comes back as `unknown`; keep only codes the form can actually render. */
function codes<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  return Array.isArray(value)
    ? value.filter(
        (code): code is T => typeof code === "string" && (allowed as readonly string[]).includes(code),
      )
    : [];
}

/** A stored year count back into what the number input wants; anything odd → blank. */
function years(value: unknown): string {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 80
    ? String(value)
    : "";
}

/**
 * Everything we already know about whoever owns this email, so the form can fill
 * itself in — or null if it's a new address, if we're being hammered, or if the
 * query fails. The form treats all three the same: a blank form still works.
 *
 * Nothing authenticates this, so it hands one person's details to anyone who can
 * guess their address — the trade every "we remember you" form makes. It returns
 * only what the applicant would see filled in anyway (no ids, no dates, no
 * enrollments), and the LOOKUP budget keeps a list from being walked through it.
 */
export async function lookupApplicant(rawEmail: unknown): Promise<ApplyPrefill | null> {
  const email = typeof rawEmail === "string" ? rawEmail.trim().slice(0, MAX_LENGTH) : "";
  if (!EMAIL.test(email)) return null;

  const key = await clientKey();
  if (!take(`lookup:${key}`, LOOKUP)) {
    console.warn("[apply] lookup rate limited", key);
    return null;
  }

  try {
    // lower() on both sides so it rides students_email_lower_idx.
    const [student] = (await db()`
      select first_name, last_name, nickname, phone, line_id, job_title, company, languages, background
      from students
      where lower(email) = lower(${email})
      limit 1
    `) as StudentRow[];
    if (!student) return null;

    const background = student.background ?? {};
    return {
      firstName: student.first_name ?? "",
      lastName: student.last_name ?? "",
      nickname: student.nickname ?? "",
      phone: student.phone ?? "",
      lineId: student.line_id ?? "",
      jobTitle: student.job_title ?? "",
      company: student.company ?? "",
      languages: codes(student.languages, LANGUAGES),
      roboticsYears: years(background.robotics_years),
      programmingYears: years(background.programming_years),
      programmingLanguages: codes(background.programming_languages, PROGRAMMING_LANGUAGES),
      skills: codes(background.skills, SKILLS),
    };
  } catch (error) {
    // Quietly — a lookup that fails just means the applicant types it all out.
    console.error("[apply] lookup failed", error);
    return null;
  }
}
