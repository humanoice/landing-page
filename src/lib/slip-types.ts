/**
 * The slip contract: what a reading looks like, why one can be turned down, and
 * the limits the file picker enforces. Everything both sides need, in one place —
 * src/lib/slip.ts, which owns the DeepSeek call, can't be imported from a client
 * component.
 */

/** DeepSeek accepts these (https://api-docs.deepseek.com/guides/vision); the copy offers the same three. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * A slip screenshot off a phone is well under a megabyte. The ceiling is low
 * because it also has to survive the host's request-body limit (4.5 MB on
 * Vercel, and `serverActions.bodySizeLimit` in next.config.ts) — not because
 * DeepSeek would mind, it takes 32 MiB an image.
 */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** What the model read off the image, for showing back, logging and manual review. */
export type SlipReading = {
  /** THB, as a plain number. */
  amount: number | null;
  /** Verbatim, masking symbols and all. */
  recipientName: string | null;
  recipientAccount: string | null;
  senderName: string | null;
  /** ISO 8601, Bangkok time unless the slip said otherwise. */
  transferredAt: string | null;
  reference: string | null;
  bank: string | null;
  /** Why it decided what it did, in the model's own words — the team's Lark notice leads on this. */
  note: string | null;
};

/**
 * Stable codes, locale-agnostic like `ApplyErrorCode` — the caller maps them to
 * copy. `duplicate` is the one slip.ts never raises: whether a slip was already
 * used for another seat is a database question, answered by the caller.
 */
export type SlipIssue = "unreadable" | "notSlip" | "recipient" | "amount" | "suspicious" | "duplicate";
