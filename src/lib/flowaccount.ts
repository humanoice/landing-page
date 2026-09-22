import "server-only";
import type { PayerType } from "@/lib/payment";

/**
 * Booking a verified payment as revenue in FlowAccount.
 *
 * We don't talk to FlowAccount ourselves. A Grok bot behind a Cursor automation
 * webhook does: it gets the row below, works out the receipt, and records it.
 * This file is the transport; src/app/apply/actions.ts decides when to send.
 *
 * Best-effort, like src/lib/lark.ts. The seat is already sold by the time this
 * runs and nothing the applicant sees waits on it, so a failed send is logged
 * for the team to book by hand — the Lark "Payment received" notice carries
 * the same figures. A missing GROK_WEBHOOK_URL is a quiet no-op for the same
 * reason: a preview deploy shouldn't be booking revenue anyway.
 */

/** One POST to a service we don't control; don't hang on a slow one. */
const TIMEOUT_MS = 8_000;

/** The payments row, as the bot wants it — column names as in db/schema.sql. */
export type RevenueRecord = {
  student_id: string;
  payer_type: PayerType;
  receipt_name: string | null;
  receipt_tax_id: string | null;
  receipt_address: string | null;
  /**
   * Net of any discount — what the receipt is for. (In the table, `price_thb`
   * is the list total and `discount_thb` sits beside it; the bot predates
   * discounts, so it gets the figure it always did and the split as extras.)
   */
  price_thb: number;
  list_price_thb: number;
  discount_thb: number;
  discount_code: string | null;
  /** 0 for an individual; 3% of the net for a company. The slip showed the difference. */
  withholding_thb: number;
};

/**
 * Hand a verified payment to the bot. Never throws: the caller has nothing
 * useful to do about a failure, so it's logged here and that's it.
 */
export async function recordRevenue(record: RevenueRecord): Promise<void> {
  const url = process.env.GROK_WEBHOOK_URL;
  const key = process.env.GROK_WEBHOOK_KEY;
  // The bot isn't wired up in this environment. Not an error — see the file comment.
  if (!url) return;
  if (!key) {
    console.error("[flowaccount] GROK_WEBHOOK_URL is set but GROK_WEBHOOK_KEY isn't; not sending");
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`${response.status} · ${body.slice(0, 500) || "no body"}`);
    }
  } catch (error) {
    // The student id is enough to find the payment; the rest is on the Lark notice.
    console.error("[flowaccount] record failed", { studentId: record.student_id }, error);
  }
}
