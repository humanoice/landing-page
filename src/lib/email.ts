import "server-only";
import { Resend } from "resend";
import type { RunSummary } from "@/lib/courses";
import type { ApplyCopy } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

let client: Resend | undefined;

/**
 * Built lazily so `next build` doesn't need the key — same shape as `db()` and
 * `deepseek()`, for the same reason.
 */
function resend() {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    client = new Resend(apiKey);
  }
  return client;
}

/** Google Calendar link — the fallback for anyone whose mail client ignores the .ics. */
export type ConfirmationRun = RunSummary & { calendarUrl: string };

export type PaymentConfirmation = {
  to: string;
  firstName: string;
  copy: ApplyCopy["email"];
  directions: ApplyCopy["directions"];
  runs: ConfirmationRun[];
  /** The invite from `buildIcs`, attached as text/calendar so mail clients offer Accept. */
  ics: string;
};

/**
 * The one email the site sends: "paid, you're in", with the invite attached.
 * Throws on a Resend error so the caller can log it — the seat is already
 * confirmed by then, so a failure here is for the team, not the applicant.
 */
export async function sendPaymentConfirmation(mail: PaymentConfirmation): Promise<void> {
  const { subject, html, text } = renderConfirmation(mail);

  const { data, error } = await resend().emails.send({
    from: siteConfig.email.from,
    to: [mail.to],
    subject,
    html,
    text,
    attachments: [
      {
        filename: "humanoice-bootcamp.ics",
        content: Buffer.from(mail.ics, "utf8"),
        contentType: "text/calendar; method=REQUEST; charset=utf-8",
      },
    ],
  });

  if (error) throw new Error(`Resend: ${error.name} — ${error.message}`);
  console.info("[email] confirmation sent", { id: data?.id });
}

/* ---------- Templates ---------- */

/** Subject, HTML and plain text for one confirmation. */
function renderConfirmation(mail: PaymentConfirmation): { subject: string; html: string; text: string } {
  return {
    subject: `${mail.copy.subject} · ${mail.runs.map((run) => run.name).join(" + ")}`,
    html: renderHtml(mail),
    text: renderText(mail),
  };
}

/**
 * How to get here, as plain lines — the calendar event's DESCRIPTION, and the
 * text version of the email. The numbered steps are numbered here, not in the
 * copy, so the HTML can use a real list.
 */
export function directionsText(d: ApplyCopy["directions"]): string {
  return [
    d.title,
    ...d.steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    d.landmark,
    "",
    d.laptop,
    "",
    d.onTime,
    "",
    d.questions,
  ].join("\n");
}

/** Brand tokens from globals.css, spelled out — email clients don't read CSS variables. */
const INK = "#1b0a11";
const CREAM = "#fbf3e2";
const YELLOW = "#fae251";
const CRIMSON = "#bd114a";

const MONO = "'Space Mono', Menlo, Consolas, monospace";
const SANS = "Prompt, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function renderHtml({ firstName, copy, directions, runs }: PaymentConfirmation): string {
  const cards = runs
    .map(
      (run) => `
        <tr><td style="padding:16px 18px;border:2px solid ${INK};border-radius:14px;background:#ffffff">
          <div style="font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${CRIMSON}">${esc(run.dates)} &middot; ${esc(run.hours)}</div>
          <div style="font-size:18px;font-weight:800;line-height:1.2;margin-top:6px">${esc(run.name)}</div>
          <a href="${esc(run.calendarUrl)}" style="display:inline-block;margin-top:12px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${INK};text-decoration:underline">${esc(copy.calendarLink)}</a>
        </td></tr>
        <tr><td style="height:10px"></td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};color:${INK};font-family:${SANS};font-size:16px;line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM}"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
      <tr><td style="font-family:${MONO};font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:${CRIMSON}">// Humanoice</td></tr>
      <tr><td style="padding-top:18px;font-size:32px;font-weight:900;line-height:1.05;text-transform:uppercase">${esc(copy.subject)}</td></tr>
      <tr><td style="padding-top:22px">${esc(copy.greeting)} ${esc(firstName)},</td></tr>
      <tr><td style="padding-top:10px">${esc(copy.body)}</td></tr>
      <tr><td style="padding-top:18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}</table></td></tr>
      <tr><td style="padding-top:8px;font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${CRIMSON}">${esc(copy.where)}</td></tr>
      <tr><td style="padding-top:4px;font-weight:700">${esc(siteConfig.venue.label)}</td></tr>
      <tr><td style="padding-top:2px"><a href="${esc(siteConfig.venue.mapsUrl)}" style="color:${INK}">${esc(copy.map)}</a></td></tr>
      <tr><td style="padding-top:22px;font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${CRIMSON}">${esc(directions.title)}</td></tr>
      <tr><td style="padding-top:6px"><ol style="margin:0;padding-left:22px">${directions.steps.map((step) => `<li style="padding:2px 0">${esc(step)}</li>`).join("")}</ol></td></tr>
      <tr><td style="padding-top:12px">${esc(directions.landmark)}</td></tr>
      <tr><td style="padding-top:12px">${esc(directions.laptop)}</td></tr>
      <tr><td style="padding-top:12px;font-weight:700">${esc(directions.onTime)}</td></tr>
      <tr><td style="padding-top:12px">${esc(directions.questions)}</td></tr>
      <tr><td style="padding-top:12px"><a href="${esc(siteConfig.lineAddUrl)}" style="display:inline-block;padding:12px 22px;border:2px solid ${INK};border-radius:999px;background:${YELLOW};color:${INK};font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none">${esc(copy.lineCta)} &rarr;</a></td></tr>
      <tr><td style="padding-top:22px">${esc(copy.calendar)}</td></tr>
      <tr><td style="padding-top:28px">${esc(copy.signoff)}<br><strong>${esc(copy.team)}</strong></td></tr>
      <tr><td style="padding-top:28px;font-family:${MONO};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(27,10,17,.5)">${esc(siteConfig.url)}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function renderText({ firstName, copy, directions, runs }: PaymentConfirmation): string {
  return [
    `${copy.greeting} ${firstName},`,
    "",
    copy.body,
    "",
    ...runs.flatMap((run) => [`• ${run.name}`, `  ${run.dates} · ${run.hours}`, `  ${copy.calendarLink}: ${run.calendarUrl}`, ""]),
    `${copy.where}: ${siteConfig.venue.label}`,
    `${copy.map}: ${siteConfig.venue.mapsUrl}`,
    "",
    directionsText(directions),
    `${copy.lineCta}: ${siteConfig.lineAddUrl}`,
    "",
    copy.calendar,
    "",
    copy.signoff,
    copy.team,
  ].join("\n");
}
