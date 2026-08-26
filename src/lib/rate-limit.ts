import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";

/**
 * Two sliding windows per caller: the short one stops a fast loop, the long one
 * catches a slow drip. Thai carriers put a lot of people behind one CGNAT
 * address, so the numbers are loose enough that an office applying together
 * won't trip them.
 */
const BURST = { limit: 5, ms: 10 * 60_000 };
const HOURLY = { limit: 15, ms: 60 * 60_000 };

/** Room for far more real callers than we'll see; past it, the coldest keys go. */
const MAX_KEYS = 10_000;

/** key → hit timestamps, oldest first, never more than HOURLY.limit of them. */
const hits = new Map<string, number[]>();

/**
 * In-memory, so it only holds within one server instance and resets on a cold
 * start — a spread-out attacker gets one budget per instance. It's a speed bump
 * on the public write path, not a guarantee; a shared store (the Neon table we
 * skipped, or Redis) is what makes it one.
 *
 * Returns false when the caller is over either window. A rejected attempt isn't
 * recorded, so hammering can't extend anyone's own lockout indefinitely.
 */
export function take(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((at) => now - at < HOURLY.ms);

  if (
    recent.length >= HOURLY.limit ||
    recent.filter((at) => now - at < BURST.ms).length >= BURST.limit
  ) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  // Delete first so the re-insert moves the key to the end: Map keeps insertion
  // order, which makes the eviction sweep below a real LRU.
  hits.delete(key);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) evict(now);
  return true;
}

function evict(now: number) {
  for (const [key, times] of hits) {
    if (now - times[times.length - 1] >= HOURLY.ms) hits.delete(key);
  }
  for (const key of hits.keys()) {
    if (hits.size <= MAX_KEYS) break;
    hits.delete(key);
  }
}

/** Per-process, so a hashed key means nothing outside this instance's memory. */
const SALT = randomUUID();

/**
 * The caller's IP, hashed — a heap dump or a stray log line never holds a raw
 * address. `x-forwarded-for` is client-settable when nothing trusted sits in
 * front of the app, but spoofing it only rotates the attacker's own bucket;
 * it can't push anyone else over a limit.
 */
export async function clientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    headerList.get("x-vercel-forwarded-for") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("x-real-ip") ||
    forwarded ||
    "unknown";

  return createHash("sha256").update(SALT).update(ip).digest("hex").slice(0, 32);
}
