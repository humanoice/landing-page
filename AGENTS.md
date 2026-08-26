<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Humanoice landing page

Marketing site for Humanoice / ฮิวแมนน้อย — a hands-on humanoid-robotics bootcamp in Phra Khanong, Bangkok. Students assemble, simulate, and deploy real open-source humanoids.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4. `npm run dev | build | lint`. 
No test suite. No `tailwind.config` — design tokens live in `src/app/globals.css` under `@theme inline`.
Database is Neon

## Folder Structure

- `src/app/` — routes only
- `src/components/` — every section; `home-page.tsx` composes them in order (Navbar → Hero → Marquee → Curriculum → Team → Partners → Footer).
- `src/lib/site.ts` — single source of SEO truth (name, url, ogImage, themeColor, `lineAddUrl`). Metadata, sitemap, robots, manifest all read from it.
- `src/lib/i18n.ts` — every user-facing string, `en` + `th`. Marked `server-only`.
- `db/` — Neon Postgres. `schema.sql` = full current picture (already live on production), `seed.sql` = course catalog, `migrations/NNNN_*.sql` = the `alter` steps actually run against production.

## Design language — "Build Joyfully"

Industrial-playful brutalism, deliberately not robotics-blue: `border-2 border-ink`, hard offset shadows (`shadow-[3px_3px_0_0_var(--ink)]`), warm cream paper canvas with a fixed grain overlay, yellow / coral / crimson accents. Fonts: `font-display` Unbounded (headlines), `font-mono` Space Mono (spec-sheet labels), `font-sans` Prompt (body + Thai). Animation is CSS classes in `globals.css` (`.reveal`, `.marquee`, `.float`, `.pop-in`, `.wave`), all neutralized under `prefers-reduced-motion`; scroll-in uses the `Reveal` client wrapper, with a `<noscript>` fallback in `layout.tsx`. Reuse this vocabulary for anything new.

## Database

`courses` / `students` / `participations` — read the comments in `db/schema.sql` before touching it. The schema is deployed, so `create table if not exists` in `schema.sql` no-ops on production: every live change is a new `db/migrations/NNNN_*.sql` (`alter table …`), applied over `DATABASE_URL_UNPOOLED`, then mirrored into `schema.sql`. Test on a throwaway Neon branch first (`npx neon@latest branches create --project-id … --name dev-…`). 
