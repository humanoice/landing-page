import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

/**
 * Neon over HTTP — one fetch per query, nothing to pool, so it suits a form
 * that runs one or two statements per request. Uses the pooled DATABASE_URL;
 * migrations use DATABASE_URL_UNPOOLED and never go through here.
 *
 * Built lazily so `next build` doesn't need the env var — it's only read on
 * the first real query.
 */
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}
