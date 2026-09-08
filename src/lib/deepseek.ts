import "server-only";
import OpenAI from "openai";

/**
 * DeepSeek speaks the OpenAI chat-completions protocol, so the official SDK
 * talks to it unchanged — only the base URL and the key differ.
 * https://api-docs.deepseek.com/
 */
const BASE_URL = "https://api.deepseek.com";

/**
 * The only DeepSeek model that accepts image input, and experimental at that
 * (https://api-docs.deepseek.com/guides/vision). Anything reading a picture has
 * to use it; the text models will reject the request.
 */
export const VISION_MODEL = "deepseek-v4-flash-vision-exp";

let client: OpenAI | undefined;

/**
 * Built lazily so `next build` doesn't need the key — it's only read on the
 * first real call. Same shape as `db()` in src/lib/db.ts, for the same reason.
 */
export function deepseek() {
  if (!client) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set");
    client = new OpenAI({ apiKey, baseURL: BASE_URL });
  }
  return client;
}
