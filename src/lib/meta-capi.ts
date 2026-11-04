import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { siteConfig } from "@/lib/site";

/**
 * Meta Conversions API — server-side events for Meta ads measurement.
 * https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api
 *
 * The browser Pixel (src/components/meta-pixel.tsx) sends PageViews and sets
 * the `_fbp` / `_fbc` cookies; server events pass those along so Meta can tie
 * them to the same person. Without the cookies (Pixel blocked, QR straight to
 * /line) matching falls back to IP + user agent — plus hashed contact details
 * when the event comes from a form.
 *
 * An event the browser also reports (SubmitApplication) carries the same
 * `eventId` on both sides, and Meta keeps whichever arrives first. /line's
 * Contact is server-only.
 *
 * Env:
 *  - META_CONVERSION_ACCESS_TOKEN  — Conversions API token for `siteConfig.metaPixelId`
 *  - META_TEST_EVENT_CODE          — optional; routes events to Events Manager → Test events.
 *                                    Remove it once verified.
 * Without the token, sending is a silent no-op (local dev, previews).
 */
const API_VERSION = "v26.0";

/** The Meta Pixel's own cookie names — the Pixel and src/proxy.ts both write `_fbc`. */
export const FBC_COOKIE = "_fbc";
export const FBP_COOKIE = "_fbp";

/**
 * `fb.{subdomainIndex}.{creationTime ms}.{fbclid}`. subdomainIndex 1 = "humanoice.com".
 * The fbclid is case-sensitive and goes in untouched.
 */
export function fbcFromClickId(fbclid: string, at = Date.now()): string {
  return `fb.1.${at}.${fbclid}`;
}

/**
 * Link unfurlers, crawlers and scripts — none of them is a person opening LINE.
 * `facebookexternalhit` matters most: Meta's own preview fetcher would otherwise
 * report a Contact every time someone pastes the link in Messenger.
 * LINE's in-app browser says "Line/13.x" — not matched; its preview bot says "line-poker".
 */
const BOT_UA =
  /bot\b|bot\/|crawl|spider|slurp|facebookexternalhit|facebookcatalog|meta-externalagent|line-poker|whatsapp|telegram|skypeuripreview|embedly|preview|headless|lighthouse|pingdom|uptime|curl|wget|python|go-http|node-fetch|undici|axios|okhttp|java\//i;

export function isLikelyBot(userAgent: string | null): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

export function clientIp(headers: Headers): string | undefined {
  return (
    headers.get("x-vercel-forwarded-for") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined
  );
}

/** Contact details as typed. Hashed here, never sent raw. */
export type MetaPerson = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Our own id for them (students.id) — stable across devices. */
  externalId?: string;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Meta's normalisation: trimmed, lower-cased, then SHA-256. Empty → left out. */
const hashed = (value: string | undefined) => {
  const normal = value?.trim().toLowerCase();
  return normal ? [sha256(normal)] : undefined;
};

/**
 * Digits only, with the country code: a Thai "081-234-5678" becomes 66812345678.
 * A number typed with its own "+" or "00" prefix keeps that country.
 */
function normalPhone(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const international = /^\s*(\+|00)/.test(raw);
  let digits = raw.replace(/\D/g, "");
  if (international) digits = digits.replace(/^00/, "");
  else if (digits.startsWith("0")) digits = `66${digits.slice(1)}`;
  return digits.length >= 8 ? digits : undefined;
}

function personData(person: MetaPerson | undefined) {
  if (!person) return {};
  const phone = normalPhone(person.phone);
  return {
    em: hashed(person.email),
    ph: phone ? [sha256(phone)] : undefined,
    fn: hashed(person.firstName),
    ln: hashed(person.lastName),
    external_id: hashed(person.externalId),
  };
}

type WebEvent = {
  /** A Meta standard event ("Contact", "SubmitApplication", …) or a custom name. */
  name: string;
  /** Shared with the browser Pixel's `eventID` when both report the event. Random otherwise. */
  eventId?: string;
  /** Full URL the event happened on. Required for `action_source: "website"`. */
  url: string;
  ip?: string;
  userAgent: string;
  fbc?: string;
  fbp?: string;
  person?: MetaPerson;
  customData?: Record<string, string | number | string[]>;
};

/** Sends one website event. Never throws — tracking must not break the page. */
export async function sendMetaEvent(event: WebEvent): Promise<void> {
  const pixelId = siteConfig.metaPixelId;
  const token = process.env.META_CONVERSION_ACCESS_TOKEN;
  if (!token) return;

  const body = {
    data: [
      {
        event_name: event.name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId ?? randomUUID(),
        event_source_url: event.url,
        action_source: "website",
        user_data: {
          client_ip_address: event.ip,
          client_user_agent: event.userAgent,
          fbc: event.fbc,
          fbp: event.fbp,
          ...personData(event.person),
        },
        custom_data: event.customData,
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) {
      console.error(`[meta-capi] ${event.name} rejected: ${res.status} ${await res.text()}`);
    }
  } catch (error) {
    console.error(`[meta-capi] ${event.name} failed:`, error);
  }
}
