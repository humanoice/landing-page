import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { formatRun } from "@/lib/courses";
import { siteConfig } from "@/lib/site";

type CertificateRow = {
  id: string;
  first_name: string;
  last_name: string;
  course_name: string;
  course_slug: string;
  start_time: string | Date | null;
  end_time: string | Date | null;
  completed_at: string | Date;
};

/** A certificate, pre-formatted — the web page and the PDF render exactly these strings. */
export type Certificate = {
  id: string;
  studentName: string;
  /** Cormorant has no Thai (or much beyond Latin-1) — a name outside it is set in Prompt. */
  nameIsLatin: boolean;
  courseName: string;
  /** e.g. "Sat, 3 Oct – Sun, 4 Oct 2026"; null when the run has no start date */
  dates: string | null;
  /** e.g. "4 October 2026" */
  issuedOn: string;
  /** first block of the uuid, upper-cased — short enough to read out, the URL is the real proof */
  certNo: string;
  /** humanoice.com/certificate/<id>, no scheme — printed, and linked from the PDF */
  verifyUrl: string;
  /** humanoice-certificate-hardware-101-jane-doe.pdf */
  fileName: string;
};

/** English only, so the copy lives here rather than in i18n.ts. */
export const certificateCopy = {
  heading: "Certificate of Completion",
  presented: "This is to certify that",
  completed: "has successfully completed the hands-on humanoid robotics bootcamp",
  issued: "Date of issue",
  number: "Certificate No.",
  seal: "Bangkok · 2026",
  issuedBy: "Issued by",
  registration: "Company Registration No.",
  verify: "Verify at",
  download: "Download PDF",
  back: "Back to Humanoice",
} as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ISSUED_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * The certificate for one participation, or null when there isn't one: not a
 * uuid, no such row, or not completed yet (completed_at is the switch, per
 * db/schema.sql). Cached per request so metadata and the page share one query.
 */
export const getCertificate = cache(async (id: string): Promise<Certificate | null> => {
  // Postgres throws on a malformed uuid cast — a bad URL is a 404, not a 500.
  if (!UUID.test(id)) return null;

  const [row] = (await db()`
    select
      p.id, p.completed_at,
      s.first_name, s.last_name,
      c.name as course_name, c.slug as course_slug, c.start_time, c.end_time
    from participations p
    join students s on s.id = p.student_id
    join courses c on c.id = p.course_id
    where p.id = ${id} and p.completed_at is not null and p.status <> 'cancelled'
  `) as CertificateRow[];

  return row ? toCertificate(row) : null;
});

function toCertificate(row: CertificateRow): Certificate {
  const studentName = `${row.first_name} ${row.last_name}`.trim();
  // Intl puts thin spaces around the range dash; Space Mono has no glyph for them.
  const dates = row.start_time
    ? formatRun(row.start_time, row.end_time, "en").dates.replace(/[\u2009\u202f]/g, " ")
    : null;

  return {
    id: row.id,
    studentName,
    nameIsLatin: /^[\u0020-\u00ff]*$/.test(studentName),
    courseName: row.course_name,
    dates,
    issuedOn: ISSUED_FORMAT.format(new Date(row.completed_at)),
    certNo: `HN-${row.id.slice(0, 8).toUpperCase()}`,
    verifyUrl: `${new URL(siteConfig.url).host}/certificate/${row.id}`,
    fileName: `humanoice-certificate-${slugify(row.course_slug)}-${slugify(studentName) || "student"}.pdf`,
  };
}

/** ASCII-only, since it goes in a Content-Disposition header. */
function slugify(text: string) {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
