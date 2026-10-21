/**
 * Flash Sale campaign, 21–26 Oct 2026. Temporary: the popup on home and /apply,
 * and the code pre-filled on the form. The code itself is a row in
 * `discount_codes` (50%, 20 uses) — the form only types it in for them.
 */

export const FLASH_SALE_CODE = "FLASHSALE";

/** Set once the popup has been shown, so it greets a visitor once, not on every page. */
export const FLASH_SALE_SEEN_KEY = "humanoice:flash-sale-seen";
