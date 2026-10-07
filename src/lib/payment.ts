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

/**
 * A discount code: what the owner hands a friend. Upper-case letters, digits
 * and dashes, so it can be read out loud and typed on a phone.
 */
export const DISCOUNT_CODE = /^[A-Z0-9-]{2,32}$/;

/** What was typed, as the row stores it — or "" when it can't be a code at all. */
export function normalizeCode(raw: string): string {
  const code = raw.trim().toUpperCase();
  return DISCOUNT_CODE.test(code) ? code : "";
}

/** Whole baht off a price — a percent of a price rounds to the baht, so the row stays an integer. */
export function discountAmount(priceThb: number, percent: number): number {
  return Math.round((priceThb * percent) / 100);
}

/**
 * What a company holds back, to the satang. Nothing for an individual. Taken
 * on the net fee — after any discount — since that is what's being paid for.
 */
export function withholding(netThb: number, payerType: PayerType): number {
  return payerType === "company" ? satang(netThb * WITHHOLDING_RATE) : 0;
}

/**
 * What has to land in the account. The one place this subtraction is done.
 * `offThb` is everything taken off the list price: the bundle plus any code.
 */
export function amountDue(priceThb: number, withholdingThb: number, offThb = 0): number {
  return satang(priceThb - offThb - withholdingThb);
}

/**
 * The two-track bundle: a hardware run and a software run on one application
 * take 10% off the total, no code needed. A code, if there is one, then takes
 * its percent off what's left — the two stack, the bundle first.
 */
export const BUNDLE_PERCENT = 10;
/** courses.track_no of the tracks that make the bundle — 1 Hardware, 2 Software. */
export const BUNDLE_TRACKS = [1, 2] as const;

/** Do these runs' tracks earn the bundle? */
export function isBundle(trackNos: (number | null)[]): boolean {
  return BUNDLE_TRACKS.every((trackNo) => trackNos.includes(trackNo));
}

/** A price, taken apart: what comes off it, and what's left to transfer. */
export type Bill = {
  priceThb: number;
  bundleThb: number;
  discountThb: number;
  withholdingThb: number;
  dueThb: number;
};

/**
 * The whole sum, in order: bundle off the list, code off the rest, withholding
 * on the net. The form's live preview and the stored payment both come from here.
 */
export function bill(
  priceThb: number,
  payerType: PayerType,
  { bundle, codePercent }: { bundle: boolean; codePercent: number | null },
): Bill {
  const bundleThb = bundle ? discountAmount(priceThb, BUNDLE_PERCENT) : 0;
  const discountThb = codePercent ? discountAmount(priceThb - bundleThb, codePercent) : 0;
  const withholdingThb = withholding(priceThb - bundleThb - discountThb, payerType);
  return {
    priceThb,
    bundleThb,
    discountThb,
    withholdingThb,
    dueThb: amountDue(priceThb, withholdingThb, bundleThb + discountThb),
  };
}

// Built once: constructing an Intl formatter costs ~60x formatting with it, and
// the payment preview re-renders on every keystroke.
const THB = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** "9,603" — and "298.50" when the satang aren't zero. */
export function formatThb(amount: number): string {
  return THB.format(amount);
}
