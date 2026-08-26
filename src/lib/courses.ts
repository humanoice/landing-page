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
  /** e.g. "9,900"; null = price on request (B2B) */
  price: string | null;
  /** limit_seat minus paid participations; null = no cap */
  seats: { left: number; total: number } | null;
};

const TIME_ZONE = "Asia/Bangkok";
// Gregorian for Thai too — the rest of the site says "2026", not "2569".
const DATE_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  th: "th-TH-u-ca-gregory",
};

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
  return courses.find((course) => String(course.id) === key || course.slug === key)?.id;
}

function toOption(row: CourseRow, locale: Locale): CourseOption {
  const start = new Date(row.start_time);
  const end = row.end_time ? new Date(row.end_time) : null;

  const dateFormat = new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    trackNo: row.track_no,
    description: row.description,
    dates: end ? dateFormat.formatRange(start, end) : dateFormat.format(start),
    hours: end
      ? `${timeFormat.format(start)}–${timeFormat.format(end)}`
      : timeFormat.format(start),
    // Sat 10:00 → Sun 17:00 is 31h; ceil makes that the 2 days it is.
    days: end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000)) : 1,
    price: row.price_thb === null ? null : new Intl.NumberFormat("en-US").format(row.price_thb),
    // A seat is taken once it's paid for — applied/confirmed-but-unpaid doesn't hold one.
    seats:
      row.limit_seat === null
        ? null
        : { total: row.limit_seat, left: Math.max(0, row.limit_seat - row.paid_count) },
  };
}
