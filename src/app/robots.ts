import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Served at /robots.txt
 *
 * Everything public is open — to search engines and AI assistants alike. Being
 * quotable in a ChatGPT / Claude / Perplexity answer is the point, not a leak.
 *
 * The AI agents below are already covered by the `*` rule, so naming them
 * changes nothing functionally. They're listed so that staying open to them
 * reads as a decision rather than an oversight, and so blocking one later is a
 * one-line edit in an obvious place.
 *
 * robots.txt is only half the story: edge bot protection (Vercel's Bot Filter,
 * Cloudflare's "Block AI Scrapers" toggle) drops these agents before the request
 * ever reaches Next, whatever this file says. Keep the two in sync.
 */

// Agents that crawl to train models or ground assistant answers. Names are the
// ones each vendor documents — a user-agent token that doesn't match anything
// is simply ignored, so a stale entry is harmless.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training + ChatGPT grounding
  "OAI-SearchBot", // OpenAI — the ChatGPT Search index
  "ChatGPT-User", // OpenAI — fetches a page when a user's prompt calls for it
  "ClaudeBot", // Anthropic — crawler
  "Claude-SearchBot", // Anthropic — search index
  "Claude-User", // Anthropic — user-triggered fetch
  "PerplexityBot", // Perplexity — index
  "Perplexity-User", // Perplexity — user-triggered fetch
  "Google-Extended", // Gemini / Vertex grounding. Distinct from Googlebot:
  // toggling this does NOT affect Google Search ranking.
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "Amazonbot", // Alexa / Rufus
  "MistralAI-User", // Le Chat
  "CCBot", // Common Crawl — feeds most open training corpora
];

// A certificate URL carries a student's name, so it stays out of every index.
// The route 404s today; the rule is here so shipping the page can't leak them.
const PRIVATE = ["/certificate/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
