/**
 * Paying for a seat: where the money goes, and how much.
 *
 * Pure on purpose. The form previews the amount in the browser while someone
 * picks Individual or Company, and the action stores it on the server; both
 * read this file, so they agree to the satang.
 */

export const PAYER_TYPES = ["individual", "company"] as const;
export type PayerType = (typeof PAYER_TYPES)[number];

export function isPayerType(value: string): value is PayerType {
  return (PAYER_TYPES as readonly string[]).includes(value);
}

/** The Kasikorn account that takes bootcamp fees — shown to the applicant, who transfers by hand. */
export const BANK = {
  account: "238-1-20282-0",
  holder: "บจก. ฮิวแมน น้อย",
  logo: "/kbank_logo.png",
} as const;

/**
 * Thai withholding tax on a service fee. A company paying us deducts it at
 * source and remits it to the Revenue Department itself, so what reaches the
 * account is 97% — and that is the figure the slip has to show.
 */
const WITHHOLDING_RATE = 0.03;

const satang = (amount: number) => Math.round(amount * 100) / 100;

/** What a company holds back, to the satang. Nothing for an individual. */
export function withholding(priceThb: number, payerType: PayerType): number {
  return payerType === "company" ? satang(priceThb * WITHHOLDING_RATE) : 0;
}

/** What has to land in the account. The one place this subtraction is done. */
export function amountDue(priceThb: number, withholdingThb: number): number {
  return satang(priceThb - withholdingThb);
}

/** The same figure straight from a payer type — what the form's live preview needs. */
export function amountDueFor(priceThb: number, payerType: PayerType): number {
  return amountDue(priceThb, withholding(priceThb, payerType));
}

// Built once: constructing an Intl formatter costs ~60x formatting with it, and
// the payment preview re-renders on every keystroke.
const THB = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** "9,603" — and "298.50" when the satang aren't zero. */
export function formatThb(amount: number): string {
  return THB.format(amount);
}
