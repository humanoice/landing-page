import "server-only";
import { randomUUID } from "node:crypto";
import { siteConfig } from "@/lib/site";

/**
 * Meta Conversions API — server-side events for Meta ads measurement.
 * https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api
 *
 * The browser Pixel (src/components/meta-pixel.tsx) sends PageViews and sets
 * the `_fbp` / `_fbc` cookies; server events pass those along so Meta can tie
 * them to the same person. Events sent here have no browser twin, so there's
 * nothing to deduplicate. Without the cookies (Pixel blocked, QR straight to
 * /line) matching falls back to IP + user agent.
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

type WebEvent = {
  /** A Meta standard event ("Contact", "Lead", …) or a custom name. */
  name: string;
  /** Full URL the event happened on. Required for `action_source: "website"`. */
  url: string;
  ip?: string;
  userAgent: string;
  fbc?: string;
  fbp?: string;
  customData?: Record<string, string | number>;
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
        event_id: randomUUID(),
        event_source_url: event.url,
        action_source: "website",
        user_data: {
          client_ip_address: event.ip,
          client_user_agent: event.userAgent,
          fbc: event.fbc,
          fbp: event.fbp,
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
