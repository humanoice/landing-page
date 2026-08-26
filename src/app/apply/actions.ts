"use server";

import { LANGUAGES, PROGRAMMING_LANGUAGES, SKILLS } from "@/lib/apply-options";
import { db } from "@/lib/db";

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
  course: string;
};

/** Keys into i18n `apply.errors` — the action stays locale-agnostic. */
export type ApplyErrorCode = "required" | "email" | "number" | "course" | "server";

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
    course: text(formData, "course"),
  };

  // Honeypot: the field is hidden from people, so anything in it came from a bot.
  // Pretend it worked so the bot moves on.
  if (text(formData, "website")) return { status: "success" };

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

  const courseId = /^\d+$/.test(values.course) ? Number(values.course) : NaN;
  if (!Number.isInteger(courseId)) errors.course = "course";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  // Only store the survey answers that were actually given (see the `background` comment in db/schema.sql).
  const background: Record<string, number | string[]> = {};
  if (typeof roboticsYears === "number") background.robotics_years = roboticsYears;
  if (typeof programmingYears === "number") background.programming_years = programmingYears;
  if (values.programmingLanguages.length > 0) background.programming_languages = values.programmingLanguages;
  if (values.skills.length > 0) background.skills = values.skills;

  try {
    const sql = db();

    // Same rule as the page's list: the run must still be open. A stale tab or a
    // hand-crafted POST for a past run stops here.
    const [course] = await sql`
      select id from courses
      where id = ${courseId}::int and is_active and start_time > now()
    `;
    if (!course) return { status: "error", errors: { course: "course" }, values };

    // One statement, so the student row and their participation land together or not at all.
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
        returning id
      )
      insert into participations (student_id, course_id)
      select id, ${courseId}::int from student
      returning id
    `;

    return { status: "success" };
  } catch (error) {
    console.error("[apply] failed to save application", error);
    return { status: "error", errors: { form: "server" }, values };
  }
}
