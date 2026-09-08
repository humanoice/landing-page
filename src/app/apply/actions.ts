"use server";

import { after } from "next/server";
import { EMAIL, LANGUAGES, PROGRAMMING_LANGUAGES, SKILLS } from "@/lib/apply-options";
import { buildIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import { formatRun, runEnd, type RunSummary } from "@/lib/courses";
import { db } from "@/lib/db";
import { directionsText, sendPaymentConfirmation, type ConfirmationRun } from "@/lib/email";
import { getDictionary, type ApplyCopy, type Locale } from "@/lib/i18n";
import { announceApplication, announceSlipVerdict } from "@/lib/notify";
import { amountDue, isPayerType, withholding, type PayerType } from "@/lib/payment";
import { clientKey, LOOKUP, SLIP, SUBMIT, take } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";
import { verifySlip } from "@/lib/slip";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  type SlipIssue,
  type SlipReading,
} from "@/lib/slip-types";

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
  /** "" while they haven't picked. */
  payerType: PayerType | "";
  receiptName: string;
  receiptTaxId: string;
  receiptAddress: string;
  /** Ids of the runs they picked — at most one per track, at least one in total. */
  courses: string[];
};

/**
 * What a returning applicant gets handed back: everything they told us last time
 * except their email (they just typed it), the runs (they pick those fresh) and
 * the receipt details (those belong to a payment, not a person).
 */
export type ApplyPrefill = Omit<
  ApplyValues,
  "email" | "courses" | "payerType" | "receiptName" | "receiptTaxId" | "receiptAddress"
>;

/** Keys into i18n `apply.errors` — the action stays locale-agnostic. */
export type ApplyErrorCode =
  | "required"
  | "email"
  | "number"
  | "course"
  | "oneTrack"
  | "full"
  | "payer"
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
    | "payerType"
    | "receiptName"
    | "receiptTaxId"
    | "receiptAddress"
    | "form",
    ApplyErrorCode
  >
>;

/** What the payment step needs to show — and the one id it needs to send back. */
export type PaymentSummary = {
  /** payments.id. Random, never listed anywhere: holding it is what proves you submitted the form. */
  id: string;
  priceThb: number;
  withholdingThb: number;
  runs: RunSummary[];
};

export type ApplyState =
  | { status: "idle" }
  | { status: "error"; errors: ApplyErrors; values: ApplyValues }
  /** Saved, but nothing to pay for here: a B2B run, or seats they'd already paid for. LINE takes it from there. */
  | { status: "success" }
  /** Saved and priced — step 2 is the transfer. */
  | { status: "pay"; payment: PaymentSummary };

const MAX_LENGTH = 200;
/** Thai addresses run long: building, soi, khwaeng, khet, province, postcode. */
const MAX_ADDRESS = 500;
/** One run per track caps this in practice; the ceiling is only here to bound a hand-rolled POST. */
const MAX_COURSES = 10;

function text(formData: FormData, key: string, max = MAX_LENGTH) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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

/** The posted payer type, or "" for anything that isn't one of the two. */
function payerTypeOf(value: string): PayerType | "" {
  return isPayerType(value) ? value : "";
}

/** The page's locale rides along as a hidden field, so dates come back in the language they're reading. */
function localeOf(formData: FormData): Locale {
  return text(formData, "locale") === "th" ? "th" : "en";
}

/** "" → undefined (left blank), whole number 0–80 → that number, anything else → "invalid". */
function parseYears(raw: string): number | undefined | "invalid" {
  if (raw === "") return undefined;
  const years = Number(raw);
  return Number.isInteger(years) && years >= 0 && years <= 80 ? years : "invalid";
}

/** An unpaid seat of theirs on a run they just picked, priced. */
type UnpaidRow = {
  id: string;
  name: string;
  start_time: string;
  end_time: string | null;
  price_thb: number | null;
};

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
    payerType: payerTypeOf(text(formData, "payerType")),
    receiptName: text(formData, "receiptName"),
    receiptTaxId: text(formData, "receiptTaxId"),
    receiptAddress: text(formData, "receiptAddress", MAX_ADDRESS),
    courses: courseIds(formData),
  };
  const locale = localeOf(formData);

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

  // A company gets a receipt it can book against, so its details aren't optional.
  // An individual's are: the receipt still goes out, just to whatever they gave.
  const payerType = values.payerType || null;
  if (payerType === null) errors.payerType = "payer";
  else if (payerType === "company") {
    if (!values.receiptName) errors.receiptName = "required";
    if (!values.receiptTaxId) errors.receiptTaxId = "required";
    if (!values.receiptAddress) errors.receiptAddress = "required";
  }

  if (Object.keys(errors).length > 0 || payerType === null) {
    return { status: "error", errors, values };
  }

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
    //
    // `name`/`start_time`/`end_time` aren't part of that check — they're here so
    // the Lark notice can name the runs even on the path where nothing is billed
    // and `unpaid` below comes back empty.
    const open = (await sql`
      select
        c.id,
        c.track_no,
        c.name,
        c.start_time,
        c.end_time,
        case
          when c.limit_seat is null then null
          else (c.limit_seat - (
            select count(*) from participations p
            where p.course_id = c.id and p.paid_status
          ))::int
        end as seats_left
      from courses c
      where c.id = any(${courses}::int[]) and c.is_active and c.start_time > now()
      order by c.start_time, c.id
    `) as {
      id: number;
      track_no: number | null;
      name: string;
      start_time: string;
      end_time: string | null;
      seats_left: number | null;
    }[];
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
    //
    // `joined` isn't read below, but a data-modifying CTE runs regardless.
    const [student] = (await sql`
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
      ),
      joined as (
        insert into participations (student_id, course_id)
        select student.id, picked.course_id
        from student, unnest(${courses}::int[]) as picked(course_id)
        -- Already applied for a run: their status and payment stay as they are.
        on conflict (student_id, course_id) do nothing
        returning id
      )
      select id from student
    `) as { id: string }[];

    // What's left to pay for. A run they already paid for isn't billed twice; a
    // run with no price (B2B) can't be billed at all — either way, LINE takes over.
    const unpaid = (await sql`
      select p.id, c.name, c.start_time, c.end_time, c.price_thb
      from participations p
      join courses c on c.id = p.course_id
      where p.student_id = ${student.id}::uuid
        and p.course_id = any(${courses}::int[])
        and not p.paid_status
      order by c.start_time, c.id
    `) as UnpaidRow[];
    // Every run they ticked, in the words they saw them in — what the team wants
    // to read, whether or not there's a transfer to chase.
    const picked = open.map((run) => summarise(run, locale));

    if (unpaid.length === 0 || unpaid.some((run) => run.price_thb === null)) {
      announceApplication(values, picked, null);
      return { status: "success" };
    }

    const priceThb = unpaid.reduce((sum, run) => sum + (run.price_thb as number), 0);
    const withholdingThb = withholding(priceThb, payerType);

    // The payment and the seats it covers, in one statement. A re-submit (page
    // refreshed mid-payment) points the same seats at a fresh payment; the old
    // one stays behind unverified, which is a record of an attempt, not a debt.
    const [payment] = (await sql`
      with pay as (
        insert into payments
          (student_id, payer_type, receipt_name, receipt_tax_id, receipt_address, price_thb, withholding_thb)
        values (
          ${student.id}::uuid,
          ${payerType},
          ${values.receiptName || null},
          ${values.receiptTaxId || null},
          ${values.receiptAddress || null},
          ${priceThb},
          ${withholdingThb}
        )
        returning id
      )
      update participations p set payment_id = pay.id
      from pay
      where p.id = any(${unpaid.map((run) => run.id)}::uuid[])
      returning pay.id
    `) as { id: string }[];

    const dueThb = amountDue(priceThb, withholdingThb);
    announceApplication(values, picked, { paymentId: payment.id, priceThb, withholdingThb, dueThb });

    return {
      status: "pay",
      payment: {
        id: payment.id,
        priceThb,
        withholdingThb,
        runs: unpaid.map((run) => summarise(run, locale)),
      },
    };
  } catch (error) {
    console.error("[apply] failed to save application", error);
    return { status: "error", errors: { form: "server" }, values };
  }
}

/* ---------- Paying for it ---------- */

/** Keys into i18n `apply.pay.errors`. */
export type PayErrorCode = "missingSlip" | "unsupportedType" | "tooLarge" | "rateLimit" | "expired" | "server";

export type Confirmation = {
  /** Where the invite went. */
  email: string;
  /** What they paid, for the GA purchase event. */
  amountThb: number;
  runs: ConfirmationRun[];
};

export type PayState =
  | { status: "idle" }
  /** The request itself was unusable — nothing was checked. */
  | { status: "error"; error: PayErrorCode }
  /** Checked, and it didn't pass: `issue` says why. */
  | { status: "rejected"; issue: SlipIssue }
  | { status: "paid"; confirmation: Confirmation };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PaidRun = { id: string; name: string; start_time: string; end_time: string | null };

type PaymentRow = {
  id: string;
  payer_type: PayerType;
  price_thb: number;
  /** numeric comes back as a string over HTTP. */
  withholding_thb: string;
  verified_at: string | null;
  email: string | null;
  first_name: string;
  /** Only the Lark notice reads these — a rejected slip is someone about to need chasing. */
  last_name: string | null;
  phone: string | null;
  line_id: string | null;
  receipt_name: string | null;
  runs: PaidRun[];
};

/**
 * Step 2: a slip for the payment the form just created. Verifies it, records
 * what it said, and on a pass marks the seats paid and sends the invite.
 *
 * The payment id is the only credential. It's a random uuid handed to whoever
 * submitted the form and never listed anywhere else, so holding it is as good
 * as having filled the form in — the same trust the seat itself rests on.
 */
export async function confirmPayment(_prev: PayState, formData: FormData): Promise<PayState> {
  const paymentId = text(formData, "paymentId");
  const locale = localeOf(formData);
  if (!UUID.test(paymentId)) return { status: "error", error: "expired" };

  const slip = formData.get("slip");
  if (!(slip instanceof File) || slip.size === 0) return { status: "error", error: "missingSlip" };
  // File.type is whatever the browser said, so it's a courtesy check, not a
  // guarantee — DeepSeek is the one that decides whether the bytes decode.
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(slip.type)) {
    return { status: "error", error: "unsupportedType" };
  }
  if (slip.size > MAX_IMAGE_BYTES) return { status: "error", error: "tooLarge" };

  // Every attempt past here is a vision call we pay for; the SLIP budget is what
  // stands between a script and the DeepSeek bill.
  const key = await clientKey();
  if (!take(`slip:${key}`, SLIP)) {
    console.warn("[pay] rate limited", key);
    return { status: "error", error: "rateLimit" };
  }

  try {
    const sql = db();
    const [payment] = (await sql`
      select
        pay.id, pay.payer_type, pay.price_thb, pay.withholding_thb, pay.verified_at, pay.receipt_name,
        s.email, s.first_name, s.last_name, s.phone, s.line_id,
        coalesce(
          (
            select json_agg(
              json_build_object('id', p.id, 'name', c.name, 'start_time', c.start_time, 'end_time', c.end_time)
              order by c.start_time, c.id
            )
            from participations p
            join courses c on c.id = p.course_id
            where p.payment_id = pay.id
          ),
          '[]'::json
        ) as runs
      from payments pay
      join students s on s.id = pay.student_id
      where pay.id = ${paymentId}::uuid
    `) as PaymentRow[];
    if (!payment || !payment.email || payment.runs.length === 0) {
      return { status: "error", error: "expired" };
    }

    const copy = getDictionary(locale).apply;
    const runs = runsOf(payment, locale, copy);
    const due = amountDue(payment.price_thb, Number(payment.withholding_thb));
    const confirmation: Confirmation = {
      email: payment.email,
      amountThb: due,
      runs: runs.map((run) => ({ ...run.summary, calendarUrl: googleCalendarUrl(run.event) })),
    };

    // Already through — a double-click, or a resend of the same form. Nothing to redo.
    if (payment.verified_at) return { status: "paid", confirmation };

    const verdict = await verifySlip({
      image: new Uint8Array(await slip.arrayBuffer()),
      mimeType: slip.type,
      totalPrice: due,
    });

    // One slip pays for one seat. The reference is the one field a bank never
    // repeats, so a verified payment already carrying it means this is a re-use —
    // the one call left to us, because the model can't see the other rows.
    const reused =
      verdict.ok && verdict.slip?.reference ? await slipReused(payment.id, verdict.slip.reference) : false;
    const issue: SlipIssue | null = reused ? "duplicate" : verdict.issue;

    // Worth having when someone insists they paid: the decision, and what we read.
    const reading = JSON.stringify({ ...verdict, ok: issue === null, issue });
    console.info("[pay] verdict", { key, paymentId: payment.id, due, issue });

    if (issue) {
      await sql`update payments set slip_reading = ${reading}::jsonb where id = ${payment.id}::uuid`;
      notifyTeam(payment, confirmation.runs, due, verdict.slip, issue);
      return { status: "rejected", issue };
    }

    // The payment and its seats flip together. `verified_at is null` makes a
    // race between two uploads of the same slip a no-op for the loser.
    await sql`
      with saved as (
        update payments
        set slip_reading = ${reading}::jsonb, verified_at = now()
        where id = ${payment.id}::uuid and verified_at is null
        returning id
      )
      update participations set paid_status = true
      where payment_id in (select id from saved)
    `;

    notifyTeam(payment, confirmation.runs, due, verdict.slip, null);

    // The seat is theirs whether or not the email lands, so it goes out after
    // the response — and a Resend failure is the team's problem, not the applicant's.
    const email = payment.email;
    after(async () => {
      try {
        await sendPaymentConfirmation({
          to: email,
          firstName: payment.first_name,
          copy: copy.email,
          directions: copy.directions,
          runs: confirmation.runs,
          ics: buildIcs(
            runs.map((run) => run.event),
            {
              organizer: { name: siteConfig.name, email: siteConfig.email.address },
              attendee: { name: payment.first_name, email },
            },
          ),
        });
      } catch (error) {
        console.error("[pay] confirmation email failed", { paymentId: payment.id }, error);
      }
    });

    return { status: "paid", confirmation };
  } catch (error) {
    console.error("[pay] failed", error);
    return { status: "error", error: "server" };
  }
}

async function slipReused(paymentId: string, reference: string): Promise<boolean> {
  const rows = await db()`
    select 1 from payments
    where id <> ${paymentId}::uuid
      and verified_at is not null
      and slip_reading #>> '{slip,reference}' = ${reference}
    limit 1
  `;
  return rows.length > 0;
}

/* ---------- Telling the team ---------- */

/** The Lark notice for a slip verdict, from the row the confirm path already has. */
function notifyTeam(
  payment: PaymentRow,
  runs: RunSummary[],
  dueThb: number,
  slip: SlipReading | null,
  issue: SlipIssue | null,
) {
  announceSlipVerdict({
    paymentId: payment.id,
    who: {
      firstName: payment.first_name,
      lastName: payment.last_name ?? "",
      email: payment.email ?? "",
      phone: payment.phone ?? undefined,
      lineId: payment.line_id ?? undefined,
      payerType: payment.payer_type,
      receiptName: payment.receipt_name,
    },
    runs,
    dueThb,
    slip,
    issue,
  });
}

/** A run in the words the applicant saw it in. */
function summarise(run: { name: string; start_time: string; end_time: string | null }, locale: Locale): RunSummary {
  return { name: run.name, ...formatRun(run.start_time, run.end_time, locale) };
}

/** Each paid run as words for the page and as an event for the calendar. */
function runsOf(payment: PaymentRow, locale: Locale, copy: ApplyCopy) {
  // The same words on every run's invite — built once, not once per seat.
  const description = directionsText(copy.directions);

  return payment.runs.map((run) => {
    const summary = summarise(run, locale);
    const event: CalendarEvent = {
      uid: `${run.id}@humanoice.com`,
      title: `${run.name} · ${siteConfig.name}`,
      description,
      location: siteConfig.venue.label,
      url: siteConfig.venue.mapsUrl,
      start: new Date(run.start_time),
      end: runEnd(run.start_time, run.end_time),
      days: summary.days,
    };
    return { summary, event };
  });
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
