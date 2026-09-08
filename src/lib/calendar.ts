/**
 * Calendar invites for a confirmed seat: an .ics for the email, and a Google
 * Calendar link for the confirmation panel. Pure — no I/O, no env — so the
 * link and the file come from one description of the event.
 */

export type CalendarEvent = {
  /** Stable per seat, so a re-sent invite updates the entry instead of adding a twin. */
  uid: string;
  title: string;
  description: string;
  location: string;
  /** Map link. Kept on its own line so calendars make it clickable. */
  url: string;
  /** When the run starts, and when its last day ends. */
  start: Date;
  end: Date;
  /**
   * Calendar days it spans. Above one, the invite is one block per day
   * (10:00–17:00, 10:00–17:00) rather than a single one running through the night.
   */
  days: number;
};

export type IcsOptions = {
  organizer: { name: string; email: string };
  attendee: { name: string; email: string };
};

const DAY_MS = 86_400_000;

/** Day one's window: the run's start, ending at the last day's finishing time but on the first day. */
function firstDay(event: CalendarEvent): { start: Date; end: Date } {
  const end = new Date(event.end.getTime() - (event.days - 1) * DAY_MS);
  return { start: event.start, end: end > event.start ? end : event.end };
}

function rrule(event: CalendarEvent): string | null {
  return event.days > 1 ? `FREQ=DAILY;COUNT=${event.days}` : null;
}

/** 2026-10-03T03:00:00.000Z → 20261003T030000Z */
function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = firstDay(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: `${event.description}\n${event.url}`,
    location: event.location,
    ctz: "Asia/Bangkok",
  });
  const rule = rrule(event);
  if (rule) params.set("recur", `RRULE:${rule}`);
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** RFC 5545 text: backslash, semicolon, comma and newline are the four that need escaping. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** A parameter value (CN=…) goes in quotes, which is the one character it may not contain. */
function quote(value: string): string {
  return `"${value.replace(/"/g, "")}"`;
}

/** How many octets a code point costs in UTF-8. */
function octets(codePoint: number): number {
  return codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : codePoint < 0x10000 ? 3 : 4;
}

/**
 * Lines are capped at 75 octets; the rest continues on lines that start with a
 * space. Split per character, never per byte, so a Thai glyph isn't cut in half.
 */
function fold(line: string): string {
  const parts: string[] = [];
  let current = "";
  let width = 0;
  for (const char of line) {
    const size = octets(char.codePointAt(0) as number);
    // Continuation lines spend one octet on their leading space.
    const limit = parts.length === 0 ? 75 : 74;
    if (width + size > limit) {
      parts.push(current);
      current = "";
      width = 0;
    }
    current += char;
    width += size;
  }
  parts.push(current);
  return parts.map((part, i) => (i === 0 ? part : ` ${part}`)).join("\r\n");
}

/**
 * One invitation holding every run they paid for. METHOD:REQUEST is what makes
 * a mail client show Accept / Decline instead of a bare attachment.
 */
export function buildIcs(events: CalendarEvent[], { organizer, attendee }: IcsOptions): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Humanoice//Bootcamp//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
  ];

  for (const event of events) {
    const { start, end } = firstDay(event);
    const rule = rrule(event);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      ...(rule ? [`RRULE:${rule}`] : []),
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(`${event.description}\n${event.url}`)}`,
      `LOCATION:${escapeText(event.location)}`,
      `URL:${event.url}`,
      `ORGANIZER;CN=${quote(organizer.name)}:mailto:${organizer.email}`,
      `ATTENDEE;CN=${quote(attendee.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendee.email}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
