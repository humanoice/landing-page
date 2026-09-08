import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

type CourseRow = {
  id: number;
  slug: string;
  name: string;
  track_no: number | null;
  start_time: string | Date;
  end_time: string | Date | null;
  price_thb: number | null;
  limit_seat: number | null;
  description: string | null;
  /** participations on this run with paid_status = true */
  paid_count: number;
};

/** A course run, pre-formatted for display so the client never touches dates. */
export type CourseOption = {
  id: number;
  slug: string;
  name: string;
  trackNo: number | null;
  description: string | null;
  /** e.g. "Sat 3 – Sun 4 Oct 2026" (Bangkok time) */
  dates: string;
  /** e.g. "10:00–17:00" */
  hours: string;
  days: number;
  /** THB; null = price on request (B2B). Formatted with `formatThb` where it's shown. */
  priceThb: number | null;
  /** limit_seat minus paid participations; null = no cap */
  seats: { left: number; total: number } | null;
};

/** When a run happens, in words. Shared with the payment step, which lists the same runs. */
export type RunTiming = {
  dates: string;
  hours: string;
  days: number;
};

/** A named run, in words — what the payment step, the confirmation and the email all list. */
export type RunSummary = RunTiming & { name: string };

const TIME_ZONE = "Asia/Bangkok";

// Built once per locale: constructing an Intl formatter costs ~60x formatting
// with it, and every run on the page goes through these.
// Gregorian for Thai too — the rest of the site says "2026", not "2569".
const DATE_FORMAT: Record<Locale, Intl.DateTimeFormat> = {
  en: dateFormat("en-GB"),
  th: dateFormat("th-TH-u-ca-gregory"),
};
const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function dateFormat(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * A run with no end_time is one working day — every run on the poster is
 * 10:00–17:00. The one place that default lives; the calendar invite reads it too.
 */
const DEFAULT_RUN_MS = 7 * 3_600_000;

/** When a run finishes, with the default filled in for a row that doesn't say. */
export function runEnd(startTime: string | Date, endTime: string | Date | null): Date {
  return endTime ? new Date(endTime) : new Date(new Date(startTime).getTime() + DEFAULT_RUN_MS);
}

/** Runs still open for applications: active and not started yet. TBD runs (null start) are hidden. */
export async function getUpcomingCourses(locale: Locale): Promise<CourseOption[]> {
  const rows = (await db()`
    select
      c.id, c.slug, c.name, c.track_no, c.start_time, c.end_time, c.price_thb, c.limit_seat, c.description,
      (
        select count(*) from participations p
        where p.course_id = c.id and p.paid_status
      )::int as paid_count
    from courses c
    where c.is_active and c.start_time > now()
    order by c.start_time, c.id
  `) as CourseRow[];

  return rows.map((row) => toOption(row, locale));
}

/** Resolve a `?course=` query value (id or slug) to the first matching upcoming run. */
export function pickCourse(courses: CourseOption[], query: string | string[] | undefined) {
  const key = Array.isArray(query) ? query[0] : query;
  if (!key) return undefined;
  // `?course=hardware` matches every run of that track — tick the first one that
  // still has a seat, since the form won't let a full run be picked anyway.
  return courses.find(
    (course) =>
      (String(course.id) === key || course.slug === key) && (course.seats === null || course.seats.left > 0),
  )?.id;
}

/** "Sat 3 – Sun 4 Oct 2026", "10:00–17:00", 2 — from a run's start and end. */
export function formatRun(
  startTime: string | Date,
  endTime: string | Date | null,
  locale: Locale,
): RunTiming {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;
  const dates = DATE_FORMAT[locale];

  return {
    dates: end ? dates.formatRange(start, end) : dates.format(start),
    hours: end
      ? `${TIME_FORMAT.format(start)}–${TIME_FORMAT.format(end)}`
      : TIME_FORMAT.format(start),
    // Sat 10:00 → Sun 17:00 is 31h; ceil makes that the 2 days it is.
    days: end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000)) : 1,
  };
}

function toOption(row: CourseRow, locale: Locale): CourseOption {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    trackNo: row.track_no,
    description: row.description,
    ...formatRun(row.start_time, row.end_time, locale),
    priceThb: row.price_thb,
    // A seat is taken once it's paid for — applied/confirmed-but-unpaid doesn't hold one.
    seats:
      row.limit_seat === null
        ? null
        : { total: row.limit_seat, left: Math.max(0, row.limit_seat - row.paid_count) },
  };
}
