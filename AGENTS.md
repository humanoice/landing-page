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
- `src/components/` — every section; `home-page.tsx` composes them in order (Navbar → Hero → Curriculum → Education → Testimonials → Partners → FAQ → Footer). Other pages: `education-page.tsx` (`/education/[factory|school|kids]`), `about-page.tsx` (`/about`, holds Team), `apply-page.tsx`, `master-plan-page.tsx` (English only). Shared primitives (CTA, Eyebrow, SectionHeading, accent rotation, LINE tiles) live in `ui.tsx`.
- Every route follows one pattern: `getDictionary(locale)` → `pageMetadata(...)` from `src/lib/metadata.ts` → render `<XPage locale copy />`. Thai routes are the same file under `src/app/th/`; `th/layout.tsx` sets `lang="th"` once.
- `src/lib/site.ts` — single source of SEO truth (name, url, ogImage, themeColor, `lineAddUrl`). Metadata, sitemap, robots, manifest all read from it.
- `src/lib/i18n.ts` — every user-facing string, `en` + `th`, plus the route helpers (`localePath`, `applyPath`, `educationPath`, `COURSE_SLUGS`). Marked `server-only`. Non-translatable switches (which segment shows the kit or certificate) live in the component, not here.
- `db/` — Neon Postgres. `schema.sql` = database schema

## Offer structure

- **B2C** — the two public courses, *Building Humanoids* (track 1, hardware) and *Physical AI Basic* (track 2, software). The only offers with a price on the site; CTA goes to `/apply`. Run names and prices on `/apply` come from the `courses` rows, so keep them in step with `curriculum` in i18n.
- **B2B** — private training for Factory / Uni-School / Kids, plus the humanoid kit and maintenance. Never show a price; every CTA is LINE.

## Design language — "Build Joyfully"

@DESIGN.md

## Database

`courses` / `students` / `participations` — read the comments in `db/schema.sql` before touching it. The schema is deployed, so `create table if not exists` in `schema.sql` no-ops on production: every live change is a new `db/migrations/NNNN_*.sql` (`alter table …`), applied over `DATABASE_URL_UNPOOLED`, then mirrored into `schema.sql`. Test on a throwaway Neon branch first (`npx neon@latest branches create --project-id … --name dev-…`). 
