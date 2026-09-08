import "server-only";
import { after } from "next/server";
import type { RunSummary } from "@/lib/courses";
import { notifyLark } from "@/lib/lark";
import { formatThb } from "@/lib/payment";
import type { SlipIssue, SlipReading } from "@/lib/slip-types";

/**
 * What the team is told, and in what words. src/lib/lark.ts is the transport;
 * this is the copy.
 *
 * Both notices go out through `after()`, so nothing an applicant sees waits on
 * them. The payment id is the credential for the payment step, so only its first
 * eight characters go in: enough to find the row
 * (`select … from payments where id::text like 'xxxxxxxx%'`), not enough to pay with.
 */

/** Whoever is applying, in the words they typed. */
export type Applicant = {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  lineId?: string;
  jobTitle?: string;
  company?: string;
  payerType?: string;
  receiptName?: string | null;
  receiptTaxId?: string;
  receiptAddress?: string;
  languages?: string[];
  roboticsYears?: string;
  programmingYears?: string;
  programmingLanguages?: string[];
  skills?: string[];
};

/** What the applicant will owe, once the runs they picked have been priced. */
export type Billing = { paymentId: string; priceThb: number; withholdingThb: number; dueThb: number };

const fullName = (first: string, last?: string | null) => [first, last].filter(Boolean).join(" ");

/**
 * A new application, the moment it's saved. Everything they typed goes in —
 * whoever picks the conversation up on LINE shouldn't have to open the database
 * to know who they're talking to.
 */
export function announceApplication(who: Applicant, runs: RunSummary[], billing: Billing | null) {
  const name = fullName(who.firstName, who.lastName);

  after(() =>
    notifyLark(`🤖 New application · ${name || who.email}`, [
      ["Name", who.nickname ? `${name} (${who.nickname})` : name],
      ["Email", who.email],
      ["Phone", who.phone],
      ["LINE", who.lineId],
      ["Work", [who.jobTitle, who.company].filter(Boolean).join(" @ ")],
      null,
      ...runs.map((run) => ["Run", `${run.name} — ${run.dates}, ${run.hours}`] as const),
      null,
      ["Paying as", who.payerType],
      billing
        ? ["To pay", `${formatThb(billing.dueThb)} THB`]
        : // No transfer step: a B2B run with no price, or seats they'd already paid for.
          ["To pay", "nothing — LINE takes it from here"],
      billing && billing.withholdingThb > 0
        ? ["Of which", `${formatThb(billing.priceThb)} less ${formatThb(billing.withholdingThb)} withholding`]
        : null,
      ["Receipt to", who.receiptName],
      ["Tax ID", who.receiptTaxId],
      ["Address", who.receiptAddress],
      null,
      ["Speaks", who.languages],
      ["Robotics", who.roboticsYears && `${who.roboticsYears} yr`],
      ["Programming", who.programmingYears && `${who.programmingYears} yr`],
      ["Tools", who.programmingLanguages],
      ["Hands-on", who.skills],
      null,
      ["Payment ref", billing?.paymentId.slice(0, 8)],
    ]),
  );
}

/**
 * `SlipIssue` codes as words for the team's chat — the applicant gets the i18n
 * copy instead. The four in the middle are the model's own verdict, so the note
 * below them says what it actually saw; `unreadable` and `duplicate` are ours.
 */
const ISSUE_WORDS: Record<SlipIssue, string> = {
  unreadable: "no verdict — the checker failed twice, so this may well be a good slip",
  notSlip: "not a transfer slip",
  recipient: "paid to someone else",
  amount: "wrong amount",
  suspicious: "looked edited, or something else the checker wouldn't sign off",
  duplicate: "this slip already paid for another seat",
};

export type SlipVerdictNotice = {
  paymentId: string;
  who: Applicant;
  runs: RunSummary[];
  dueThb: number;
  slip: SlipReading | null;
  /** Null means it passed. */
  issue: SlipIssue | null;
};

/**
 * What happened to an uploaded slip. Both verdicts are worth a message: a pass
 * is a seat sold, and a rejection is someone who is about to appear on LINE
 * saying they paid — with everything needed to settle it by hand right there.
 *
 * The checker is deliberately generous (see the top of src/lib/slip.ts), so its
 * note is the row to read: on a rejection it says what it saw, and on a pass it
 * is the only warning that something about an accepted slip was odd. That is why
 * a note flags the title of a pass — otherwise nobody scrolls to it.
 */
export function announceSlipVerdict({ paymentId, who, runs, dueThb, slip, issue }: SlipVerdictNotice) {
  const paid = issue === null;
  const name = fullName(who.firstName, who.lastName);

  after(() =>
    notifyLark(
      paid ? `✅ Payment received${slip?.note ? " (with a note)" : ""} · ${name}` : `⚠️ Slip rejected · ${name}`,
      [
        ["Student", name],
        ["Email", who.email],
        ["Phone", who.phone],
        ["LINE", who.lineId],
        null,
        ...runs.map((run) => ["Run", `${run.name} — ${run.dates}`] as const),
        [paid ? "Paid" : "Owed", `${formatThb(dueThb)} THB`],
        ["Paying as", who.payerType],
        ["Receipt to", who.receiptName],
        null,
        ["Verdict", issue && ISSUE_WORDS[issue]],
        ["Checker note", slip?.note],
        // Verbatim off the image, and only ever evidence — see the comment at the
        // top of src/lib/slip.ts. It's here so a slip can be reconciled against the
        // bank account without going digging for the row.
        ["Slip amount", slip?.amount == null ? null : `${formatThb(slip.amount)} THB`],
        ["Slip to", [slip?.recipientName, slip?.recipientAccount].filter(Boolean).join(" · ")],
        ["Slip from", [slip?.senderName, slip?.bank].filter(Boolean).join(" · ")],
        ["Slip time", slip?.transferredAt],
        ["Slip ref", slip?.reference],
        null,
        ["Payment ref", paymentId.slice(0, 8)],
      ],
    ),
  );
}
