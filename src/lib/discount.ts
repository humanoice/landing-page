import "server-only";
import { db } from "@/lib/db";
import { normalizeCode } from "@/lib/payment";

/**
 * Looking a discount code up. One function, called from both the form's
 * live check and the submit itself, so the two can't disagree about a code.
 *
 * A use is a verified payment carrying the code (db/schema.sql, discount_codes):
 * an application that never pays holds nothing back.
 */

export type DiscountReason = "invalid" | "expired" | "exhausted";

export type Discount = { id: number; code: string; percent: number };

export type DiscountLookup = { ok: true; discount: Discount } | { ok: false; reason: DiscountReason };

type DiscountRow = {
  id: number;
  code: string;
  percent: number;
  max_uses: number;
  is_active: boolean;
  expires_at: string | null;
  used: number;
};

/** Resolve what someone typed to a code that can still be used — or why it can't. */
export async function findDiscount(raw: string): Promise<DiscountLookup> {
  const code = normalizeCode(raw);
  if (!code) return { ok: false, reason: "invalid" };

  const [row] = (await db()`
    select
      d.id, d.code, d.percent, d.max_uses, d.is_active, d.expires_at,
      (
        select count(*) from payments p
        where p.discount_code_id = d.id and p.verified_at is not null
      )::int as used
    from discount_codes d
    where d.code = ${code}
  `) as DiscountRow[];

  if (!row || !row.is_active) return { ok: false, reason: "invalid" };
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return { ok: false, reason: "expired" };
  if (row.used >= row.max_uses) return { ok: false, reason: "exhausted" };

  return { ok: true, discount: { id: row.id, code: row.code, percent: row.percent } };
}
