# Humanoice / ฮิวแมนน้อย — Design System

The design language is called **"Build Joyfully"**: industrial-playful brutalism, deliberately *not* robotics-blue. Warm cream paper, a fixed grain film, 2–3px ink borders, hard un-blurred offset shadows, and three signal colours: yellow, coral, crimson.

**Sources of truth**
- **This codebase wins.** `src/app/globals.css` holds the colour and font tokens (under `:root` and `@theme inline` — Tailwind v4, no `tailwind.config`) plus every animation and pattern class. Everything else — shadows, radii, type sizes, tracking — is written as Tailwind utilities, mostly arbitrary values like `shadow-[5px_5px_0_0_var(--ink)]`. There are no `--shadow-*`, `--radius-*`, `--space-*` or `--dur-*` variables; don't reference them.
- Shared form and button primitives live in `src/components/apply-ui.tsx`. Copy the class strings from there or from the component that already does the thing.
- All user-facing strings, in en and th, are in `src/lib/i18n.ts`.
- Surfaces: home (`/`, `/th`), the application and payment flow (`/apply`), and `/master-plan`. `/certificate` uses its own print vocabulary (§12).

---

## 1. Voice & content

- **Informative:** Give one concrete takeaway, useful fact, or clear benefit. Explain robotics terms in everyday language when needed.
- **Bold and playful:** Use confident hooks, lively verbs, and occasional light robot or building humor. Avoid unsupported superlatives, forced jokes, or belittling beginners.
- **Friendly and casual:** Sound like an approachable builder sharing something worth knowing. Avoid corporate jargon, hard selling, and excessive exclamation marks.
- **Short, simple, and concise:** One main idea per block. Cut filler and repeated claims.

Thai should sound natural and conversational, not like translated marketing copy. Avoid repetitive polite particles and invented gendered speaker identities. English should be plain and idiomatic. Adapt phrasing and humor independently while preserving the same facts and intent in both languages.

| Rule | Do |
|---|---|
| **Person** | "We" = Humanoice, "you" = the student, addressed as equals: *"We check it on the spot."* |
| **Vocabulary** | The offering is a **bootcamp**. Each self-serve run belongs to a **track** (`01` hardware, `02` software, `03` the full bootcamp combining both). |
| **Headlines** | ALL CAPS in the display face, with the last phrase in the accent colour: *Pick your **track***, *Meet your **instructors***, *Questions, **answered***. In i18n this is a `title` + `highlight` pair. |
| **Eyebrows** | Mono, uppercase, wide tracking, prefixed with `//`: `// The Tracks`, `// FAQ`, `// Step 2 of 2`. The hero eyebrow (`Humanoid School · Bangkok`) and footer location line are plain labels without `//`. |
| **Body** | Sentence case. One idea per line. Card blurbs run 8–20 words. Curriculum items: a 2–4 word title plus one sentence (*"ROS 2 — The framework every modern robot runs on — nodes, topics, and control loops."*). |
| **Errors** | 2–8 words, mono caps, no apology theatre: *"Required"*, *"Whole years, please"*, *"That doesn't look like an email"*. |
| **Dead ends** | Always offer LINE as the human escape hatch (`LineCta` / `LineQr`): *"…send us the slip on LINE and a human will sort it out."* |
| **Bilingual** | Every string exists in both `en` and `th`. ฮิวแมนน้อย is the primary lockup, with `HUMANOICE` as the mono kicker underneath. |

---

## 2. Colour

Red was chosen *"to represent the boldness and innovative in modern robot technology."*

### Tokens (`globals.css`)

| CSS var | Hex | Tailwind names | Role |
|---|---|---|---|
| `--red` | `#bd114a` | `crimson`, `red` | **Brand voice.** Hero and footer fields, featured cards, accent words in headlines. |
| `--yellow-main` | `#fae251` | `yellow-main`, `yellow` | **Action colour.** Primary CTA fill, accents on dark, focus ring, selection, the home ticker. |
| `--orange-secondary` | `#d75656` | `coral`, `orange-secondary` | Second rotation accent. It is a coral red, not an orange. |
| `--ink` | `#1b0a11` | `ink`, `foreground` | Warm near-black. **Every border and all body type.** Never use a grey border. |
| `--cream` | `#fbf3e2` | `cream`, `background` | Page canvas. Also `siteConfig.themeColor`. |
| `--cream-deep` | `#f3e6cd` | `cream-deep` | Alternating section, closed accordion rows, skeleton blocks. |
| `--white` | `#ffffff` | `white` | Card and field fill. |
| `--grey` | `#eeeeee` | `grey` | Legacy brand value, unused. |

In classes use the Tailwind names (`bg-crimson`, `text-ink/70`). In inline styles and shadow arbitrary values use the vars (`var(--yellow-main)`, `shadow-[8px_8px_0_0_var(--shadow)]`). Prefer `crimson` and `coral` in new code.

### Semantic usage (opacity steps, not tokens)

| Role | Classes |
|---|---|
| Body / muted / soft / faint | `text-ink` / `text-ink/70` / `text-ink/60` / `text-ink/45`; placeholders `ink/30` |
| Body on dark | `text-cream`, `text-cream/80` (lead), `text-cream/70` (detail) |
| Accent text | `text-crimson` on light grounds; `text-yellow-main` on crimson or ink |
| Borders | `border-ink` strong · `border-ink/15` hairline and dashed dividers · `border-cream/20` section rules on dark · `border-cream/15` cells and card borders on ink |
| Focus | `ring-4 ring-yellow-main/60` on fields, chips, run cards, language switcher |
| `::selection` | yellow background, ink text |

### Usage rules
- **Section rhythm:** sections alternate so the page reads as stacked paper. Home runs crimson hero → yellow ticker → cream curriculum → cream-deep team → ink partners → cream FAQ → footer (ink ticker → photo CTA on ink → crimson bottom bar).
- **At most two background colours** per screen region.
- **Accent rotation:** rows rotate their shadow colour **yellow → coral → crimson** (team cards, FAQ rows). Curriculum runs yellow → coral → featured crimson card on a yellow shadow. Form sections run yellow → coral → yellow.
- **Featured content inverts:** crimson fill, cream type, yellow accents, yellow shadow (track 03, outcome panels).
- On ink grounds a cream card takes a `border-cream/15` border and a coral shadow (partner card).

---

## 3. Typography

| Token | Family | Loaded as | Use |
|---|---|---|---|
| `--font-display` | **Unbounded** (variable weight; used at 900 / 800 / 700) | `--font-unbounded` | Headlines, card titles, names, ticker text, the ฮิวแมนน้อย wordmark |
| `--font-sans` | **Prompt** 400–700, latin + thai | `--font-prompt` | Body text. Carries Thai script. |
| `--font-mono` | **Space Mono** 400 / 700 | `--font-space-mono` | Spec-sheet labels, eyebrows, buttons, chips, prices, errors |

Fonts are self-hosted through `next/font/google` in `src/app/layout.tsx` — don't add a Google Fonts `<link>`. Unbounded is loaded with the latin subset only, so Thai text set in `font-display` falls back to a system Thai face.

### Display sizes (uppercase, `font-black`, `tracking-tight`)

| Where | Classes |
|---|---|
| Hero h1 | `text-[clamp(2.6rem,8.5vw,6rem)] leading-[0.92]` |
| Footer closer | `text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.92]` |
| Apply h1 | `text-[clamp(2.6rem,8vw,5rem)] leading-[0.92]` |
| Master Plan h1 | `text-[clamp(2.4rem,7vw,4rem)] leading-[0.95]` |
| Section h2 | `text-[clamp(2rem,5.5vw,3.75rem)] leading-[0.95]`, `max-w-2xl` |
| Outcome panel | `text-[clamp(1.8rem,5.5vw,3rem)]`; compact `text-[clamp(1.6rem,5vw,2.4rem)]`; payment header `text-[clamp(1.8rem,5vw,2.8rem)]` |
| Card titles (`font-extrabold`) | `text-2xl` names and partners · `text-[1.35rem] sm:text-2xl leading-[1.1]` track names · `text-lg sm:text-xl` form sections · `text-sm font-bold` list item titles |

`tracking-tight` is Tailwind's `-0.025em`. Body uses `leading-relaxed` (1.625) at `text-sm` / `text-base` / `sm:text-lg`; detail lines `text-[13px] leading-snug`. FAQ questions are display extrabold in sentence case, not caps.

### Mono tracking ladder

| Tracking | Size | Use |
|---|---|---|
| `0.32em` / `0.28em` | 10px | `HUMANOICE` kicker (navbar / footer) |
| `0.28em` | 12px `text-xs` | Section eyebrows |
| `0.22em` | 10px | Spec-bar captions |
| `0.18em` | 11px | Field labels, card kickers, FAQ index; nav links at 12px; `META` captions at 10px |
| `0.16em` | 12px / 10–11px | Footer nav, team roles, photo number chips, "★ combined" line |
| `0.14em` | 11–12px | Meta pills, nav CTA, apply sticker, copyright |
| `0.12em` | 10–14px | Buttons, chips, pills, errors, busy notes |
| `0.08em` | 10–12px | Language switcher, topic pills |

---

## 4. Spacing & layout

Tailwind's default 4px scale; no custom spacing tokens.

| Role | Classes |
|---|---|
| Container | `mx-auto max-w-7xl` (80rem) on every home section |
| Narrow pages | `max-w-3xl` (48rem) `/apply`; `max-w-2xl` (42rem) `/master-plan` |
| Gutter | `px-5 sm:px-8` (`px-6` on Master Plan) |
| Section padding | `py-20 sm:py-28` |
| Anchored sections | `scroll-mt-20` so the sticky navbar doesn't cover them |
| Card padding | `p-6 sm:p-7` tracks · `p-6 sm:p-8` form sections · `p-7` partners · `p-7 sm:p-10` outcome panel |
| Grid gaps | `gap-6` partners · `gap-8` team · `gap-x-6 gap-y-10 xl:gap-x-8` tracks (room for stickers) · `gap-4` FAQ · `space-y-10` form sections |

- The **home navbar is the only fixed element**: `sticky top-0`, `bg-cream/90 backdrop-blur-sm`, `border-b-2 border-ink`. `/apply` and `/master-plan` get a slim, non-sticky header (logo badge + wordmark).
- Transparency appears in exactly **two places**: that navbar, and the ink scrim over the footer photo (`bg-ink/55`, widening to a left-to-right `ink/85 → ink/55 → ink/30` gradient at `sm`). The scrim is the only gradient that isn't atmosphere.

---

## 5. Borders, radii, shadows

**Nothing is ever blurred or soft-shadowed.** Every shadow is a hard offset `Npx Npx 0 0`, coloured ink or an accent.

| Class | Use |
|---|---|
| `border-2 border-ink` | Controls: buttons, fields, chips, badges, stickers, run cards |
| `border-[3px] border-ink` | Cards, panels, accordion rows, the hero reel |
| `border-t-2 border-dashed border-ink/15` | Divider between a card's header and its list (`border-cream/25` on crimson) |
| `shadow-[2px_2px_0_0_var(--ink)]` | Chips, pills, language switcher, slim-header logo badge, form price tags |
| `shadow-[3px_3px_0_0_var(--ink)]` | Fields, nav CTA, navbar logo badge, yellow notices, apply sticker |
| `shadow-[4px_4px_0_0_var(--ink)]` | Small CTA, price sticker, summary box, track fieldsets, checked run card |
| `shadow-[5px_5px_0_0_var(--ink)]` | Primary CTA (→ 9px hover, 3px press) |
| `shadow-[6px_6px_0_0_var(--shadow)]` | Accordion rows (→ 9px) |
| `shadow-[6px_6px_0_0_var(--ink)]` | LINE QR tile (→ 9px) |
| `shadow-[8px_8px_0_0_var(--shadow)]` | Cards; set the accent with `style={{ "--shadow": … }}` (→ 12px where cards lift) |
| `shadow-[10px_10px_0_0_var(--yellow-main)]` | Outcome panel (compact: 8px) |
| `shadow-[12px_12px_0_0_var(--yellow-main)]` | Hero reel |

| Radius | Value | Use |
|---|---|---|
| `rounded-full` | 999px | All actions: CTAs, pills, chips, meta pills, language switcher, icon buttons |
| `rounded-3xl` | 1.5rem | Cards, accordion rows, panels, hero reel |
| `rounded-[1.35rem]` | 1.35rem | LINE QR tile |
| `rounded-2xl` | 1rem | 48px icon badge, partner logos, summary and track boxes in the form |
| `rounded-xl` | 0.75rem | Fields, price sticker, 40px badge, logo badge, run cards, notices |
| `rounded-lg` | 0.5rem | Small numbered chips (28–36px), form price tags |

---

## 6. Backgrounds & patterns

| Pattern | Spec | Where |
|---|---|---|
| **Paper grain** | `body::before`: fixed SVG `feTurbulence` film (baseFrequency .85, 3 octaves), `opacity .06`, `mix-blend-mode: overlay` | Everywhere |
| **Blueprint grid** `.grid-lines` | 1px lines; set `--line` and `--cell` inline (defaults ink 6%, 72px) | Hero: white 7%, 80px · Partners: white 5%, 72px |
| **Dot field** `.dots` | 1.6px dots on a 22px grid; set `--dot` inline | FAQ: ink 7% · Footer: yellow 25% at `opacity-30` · Hero accent patch: yellow 40% at `opacity-40` |
| **Radial glow** | Inline `radial-gradient` | Hero: yellow 22% core · Partners: coral 18% |
| **Floating shapes** | Outlined circle (`border-yellow-main/25`) and pill (`border-cream/15`), 2px, `.float` | Hero |

- The hero field is flat crimson with the grid, glow, dots and floating outlines. Its one piece of media is the **bench window** (`HeroReel`): a 9:16 loop of real workshop footage (`/hero-loop.mp4`, poster `/hero-loop-poster.webp`) in a 3px ink frame with a 12px yellow shadow. It stands straight because it's evidence, not a sticker.
- Gradients are never used as decoration. The two radial glows are atmosphere; the footer scrim is legibility.
- Photography is warm and real: team portraits (`public/team/`, square crops), the footer bench shot (`roboparty-background.webp`). There's no illustration on the site today.

---

## 7. Interaction contract

| Element | Hover | Press / focus | Duration |
|---|---|---|---|
| **CTA** | Up-left 4px, shadow 5→9px, `→` nudges right 4px | Press snaps flat (translate 0, shadow 3px) | 200ms |
| **Small CTA in a card** (curriculum) | Up-left 2px, shadow 4→6px | Press: shadow 2px | 200ms |
| **Nav CTA** | Up-left 2px, shadow 3→5px, `→` nudges 2px | Press: shadow 2px | 200ms |
| **Card** (team, partners) | Lifts 6px, shadow 8→12px; team photo zooms 105% over 500ms | – | 200ms |
| **Track cards, form sections** | Static — they hold their own CTAs and inputs | – | – |
| **Accordion row** | Lifts 2px, shadow 6→9px | Focus: 2px ink outline, offset 4px | 200ms |
| **Pill / icon button** | Lifts 2px, shadow +1–2px | Focus: 2px ink outline, offset 2px | 150–200ms |
| **Chip, run card, language switcher** | Lifts 2px | Focus: 4px yellow ring (60%). Checked chip: ink fill, yellow text. Checked run card: yellow fill, up-left 2px, 4px shadow. | 150–200ms |
| **Field** | – | Focus: lifts 2px, 4px yellow ring (60%) | 200ms |
| **Invalid field** | – | `aria-invalid`: crimson border and crimson 3px shadow | – |
| **Link** | `ink/70` → crimson (`cream/70` → yellow on dark) | – | colour only |
| **Logo badge** | Lifts 2px, rotates −4° (partner logos −6°) | – | 200ms |
| **LINE QR tile** | Up-left 2px, shadow 6→9px | Focus: yellow outline, offset 4px | 200ms |
| **Social marks** | Lift 2px, scale 110%, opacity 90→100% | Focus: yellow outline, offset 2px | 200ms |
| **Disabled / busy** (`CTA_BUSY`) | None | 70% opacity, no transform, `cursor: wait` | – |
| **Full run** | – | Content at 55% opacity, not selectable | – |

---

## 8. Motion

All motion is CSS classes in `globals.css`; there are no duration or easing variables.

| Class | Value | Use |
|---|---|---|
| `.reveal` (+ `<Reveal>`) | 750ms `cubic-bezier(.16,1,.3,1)`, 30px rise plus fade, once | Section headers and cards on scroll |
| Stagger | `delay={i * 130}` across card rows, `i * 90` down FAQ rows | Reveal delay |
| `.hero-rise` | 900ms expo-out, 34px rise; stagger with inline `animationDelay` | Hero (0 → 0.7s), `/apply` and `/master-plan` headers (0.08s steps) |
| `.line-mask` / `.line-inner` | 1s expo-out, lines at 0.05 / 0.18 / 0.31s | Hero headline, line by line |
| `.pop-in` | 700ms `cubic-bezier(.34,1.56,.64,1)`, scales from 0.6; rotation from `--rot` (default −6deg — set `--rot: 0deg` for panels) | Apply sticker, outcome panels, payment header, form notices |
| `.float` | 6s ease-in-out, rises 14px and back | Hero floating shapes |
| `.marquee` | `--speed` (CSS default 32s; `Marquee` default 34s), linear, pauses on hover; `.marquee--rev` reverses | Home ticker 28s, footer ticker 30s |
| `.tick` | 0.9s, three square ticks staggered 0.15s | Hero reel buffering chip. **Never a spinner.** |
| `animate-pulse` (Tailwind) | – | 6px dots in the nav CTA and `BusyNote`; form skeleton |
| `.wave`, `.spin-slow` | 5s mascot wave / 26s rotation | Defined but currently unused |

Everything neutralises under `prefers-reduced-motion`: animations and transitions collapse to 0.001ms, and `.reveal`, `.hero-rise`, `.line-inner`, `.pop-in` render in place. `HeroReel` also stays on its poster frame and only plays while on screen. The `<noscript>` block in `layout.tsx` keeps `.reveal` content visible and hides the reel's buffering chip.

---

## 9. Iconography & glyphs

- **Line icons** are hand-drawn inline SVG: a 24×24 viewBox, `stroke-width: 2.4`, round caps and joins, `currentColor`, no fills (see `ICON_PROPS` in `curriculum.tsx`). There is no icon font or package. Existing icons: assemble (wrench), code (`</>`), walk (figure), and the FAQ plus (stroke 3, rotates 45° to a close).
- The LinkedIn mark is the only filled icon.
- **Draw new icons to that exact spec.** Don't substitute a CDN icon set.
- **Icons never float free.** They sit in a bordered accent **Badge**: 48px (`size-12 rounded-2xl`) on track cards, 32px round for the FAQ plus.
- **Social marks** (`public/social/`: LINE, Facebook, Instagram, X, TikTok) are solid black raster badges on transparency. On dark grounds apply `invert` to knock them out white. LINE renders one step larger (`size-8` vs `size-7`) because its bubble carries built-in padding.
- Unicode glyphs do real work: `→ ← ★ ✦ ◆ ※ // · ▾`. **No emoji in copy or UI** — the flag glyphs in the language switcher's native `<select>` are the lone exception.

---

## 10. Logo

| File | Use |
|---|---|
| `public/logo.png` | The mark (cat robot). Used in every logo badge and the JSON-LD `logo`. |
| `public/logo/logo_bw.png` | Mono / single-colour contexts |
| `public/logo/logo_horizontal_with_text.{png,jpg}` | Horizontal wordmark lockup (certificate header) |
| `public/logo/square_with_text.{png,jpg}` | Square lockup: social avatars |
| `public/logo/logo_white_bg.jpg` | Mark on a white field |
| `src/app/favicon.ico`, `src/app/apple-icon.png`, `public/android-chrome-*.png`, `public/opengraph.jpg` | Icons and OG image, wired through `siteConfig` and Next's file conventions |

- **Navbar lockup:** a 40px white badge (`rounded-xl`, 2px ink border, 3px ink shadow) holding the mark at 34px, then **ฮิวแมนน้อย** in display extrabold `text-lg`, with **HUMANOICE** under it in mono 10px uppercase at `0.32em`, crimson.
- **Footer lockup:** 36px white badge with a `border-cream/30` border and no shadow; kicker at `0.28em` in yellow.
- **Slim header** (`/apply`, `/master-plan`): 36px badge with a 2px shadow, wordmark only, no kicker.
- There's no mascot illustration in this repo. If one is added, it's the only illustration allowed and animates with `.wave`.

---

## 11. Components

Production components live in `src/components/`. The shared primitives are exported from `apply-ui.tsx`: class strings `CTA`, `CTA_SMALL`, `CTA_BUSY`, `PILL`, `CHIP`, `INPUT`, `LABEL`, `ERROR`, `META`, and components `Arrow`, `BusyNote`, `Section`, `TextField`, `OutcomePanel`, `LineCta`, `LineQr`. The hero, navbar and curriculum inline their own CTA strings; keep them in step with `CTA` when changing the button.

Every CTA that leads to `/apply` or LINE goes through `TrackedLink` / `TrackedAnchor` (`track.tsx`) with a GA event and a `location` param.

### Actions
- **CTA.** Pill, 2px ink border, yellow fill. Mono 14px bold uppercase at `.12em`, `px-7 py-3.5`, 5px ink shadow, trailing `<Arrow />`.
  - *`CTA_SMALL`:* `px-6 py-3`, 12px text, 4px shadow, for a CTA inside a card. The curriculum cards use a full-width variant with the gentler hover from §7.
  - *Nav:* crimson fill, white 12px text at `.14em`, 3px shadow, leading pulsing yellow dot.
- **IconButton.** 36px circle, 2px ink border, cream fill, 3px accent shadow that grows to 5px. Used only for LinkedIn on team cards.
- **Pill.** Small outlined action inside a field or card (copy, fill). White, 2px border, mono 11px at `.12em`, 2px ink shadow. A ghost variant (clear a track pick) uses `border-ink/25 text-ink/55`, no shadow, inking up on hover.
- **LanguageSwitcher.** A native `<select>` styled as a 40px white pill with a 2px ink shadow and a `▾` glyph.

### Forms
- **TextField.** Label (`LABEL`) mono 11px bold at `.18em`, `ink/70`, with an optional "(optional)" in normal case at `ink/40`. Input (`INPUT`) white, 2px ink border, `rounded-xl`, `px-4 py-3`, 3px ink shadow; `multiline` swaps in a resizable textarea. Error line (`ERROR`) mono 11px caps in crimson.
- **Chip.** Selectable pill styled like Pill; checked is an ink fill with yellow text.
- **Run card.** A radio dressed as a card: white `rounded-xl`, 2px border, round radio dot. Checked: yellow fill, 4px ink shadow, lifted. Runs of one track group inside a cream `rounded-2xl` fieldset with a 4px shadow, a numbered badge, and a crimson price tag.

### Surfaces
- **Card.** 3px ink border, `rounded-3xl`, white, cream or crimson fill, 8px shadow coloured through `--shadow`.
- **Section** (form). White Card with a 40px mono number Badge, a display title (18–20px extrabold uppercase), and an optional hint at `ink/55`.
- **Badge.** Accent-filled square with a 2px ink border holding an icon or number: 48px `rounded-2xl` (track icon), 40px `rounded-xl` (form step), 36px / 28px `rounded-lg` (track numbers), 14px `rounded` (list bullet).
- **Price sticker.** Rides a track card's top edge (`absolute -top-5 right-5`). Mono 16px bold, `rounded-xl`, 2px border, 4px ink shadow, tilted ±2° statically. Crimson with white text on white cards; yellow with ink text on the featured card.
- **Apply sticker.** Yellow pill beside the `/apply` headline: mono 11px at `.14em`, `★` prefix, 3px shadow, `.pop-in` at `--rot: 6deg`. Hidden below `sm`.
- **MetaPill.** Read-only pill for duration: 2px border at `ink/15`, mono 11px at `.14em` in crimson, leading 6px dot. On crimson: `border-cream/30`, yellow.
- **Topic pill.** 1px `border-cream/30`, mono 10px at `.08em`, `cream/80` — the featured card's per-track topic list.
- **Notice.** Yellow `rounded-xl` box, 2px border, 3px shadow, `.pop-in` — discount applied, saved details found. Empty states use a dashed `border-ink/25` box on `bg-cream/60`.

### Typography
- **Eyebrow.** A 32×1px rule (`h-px w-8`), then mono 12px uppercase at `.28em`. Crimson on light grounds, yellow on dark.
- **SectionHeading.** Section h2 size from §3, black weight, uppercase, `title` then a space then the accent `highlight` span.
- **SpecItem.** Hero spec-bar cell: mono 10px caption at `.22em` in yellow over a display value at 18px bold, divided by `cream/15` rules; 2 columns on mobile, 4 from `sm`.

### Feedback
- **Accordion.** Native `<details>`, no client JS.
  - Row: cream-deep fill (cream when open), 3px border, 6px accent shadow growing to 9px.
  - Header: mono index (`01`) at `ink/40`, the question, then a 32px round accent badge with the plus, rotating 45° when open. The plus is ink on yellow and coral, cream on crimson.
  - A dashed `ink/15` divider separates the header from the answer.
- **BusyNote.** Pulsing 6px dot plus mono 11px caps at `ink/45`, `aria-live="polite"`.
- **OutcomePanel.** Where every ending lands (application received, slip rejected, seat confirmed): crimson Card, yellow panel shadow, yellow eyebrow, headline with yellow highlight, and a `LineQr` tile beside it. `compact` (rejection) runs smaller, uses `role="alert"`, and keeps the headline on one line.

### Motion
- **Marquee.** Renders the items twice and translates −50% for a seamless loop that pauses on hover.
  - Home ticker: yellow band with 2px ink rules, display 14px black at `.18em`, crimson `◆` separators.
  - Footer ticker: ink band, yellow display text at `.2em`, crimson `✦` separators.
- **Reveal.** IntersectionObserver wrapper (threshold .15, bottom margin −8%) that adds `.is-visible` once.

### Composites
- **Navbar:** lockup, numbered section links (`01`–`03` at `crimson/50`), language switcher, nav CTA.
- **Hero:** eyebrow, three-line masked headline, lead, CTA; bench window on the right; spec bar along the bottom.
- **Track card:** price sticker, icon badge, kicker, name, MetaPill, blurb, dashed rule, item list, CTA pinned to the bottom. Track 03 is the featured crimson card whose list items reference tracks 01 and 02.
- **Team card:** square photo Card with a numbered accent chip, LinkedIn IconButton, name, mono role in crimson, blurb.
- **Partner cards:** cream partner Card on ink.
- **Footer:** mission ticker, photo CTA (scrim, LINE QR, location eyebrow, closer headline), bottom bar (lockup, nav, social marks, copyright).
- **Apply flow:** form Sections with run picker and order summary; payment panel; OutcomePanel endings; skeleton cards (`border-ink/15`, `animate-pulse`) while courses stream in.
- **Master Plan:** prose page — eyebrow, h1, mono date, `text-lg` paragraphs at `ink/80`, a 2px `ink/15` rule, then numbered steps with large crimson display numerals.

---

## 12. Certificate (`/certificate`)

A printable document, deliberately outside the web kit:
- Off-white paper `#fffdf7`, A4 landscape (`aspect-[297/210]`), sized in container-query units (`cqw`) so the on-screen view and the PDF (`certificate-pdf.tsx`) scale identically.
- **Cormorant Garamond** (italic and semibold) for the ceremonial lines, alongside Prompt and Space Mono.
- A double frame (ink outer rule, thin crimson inner rule) with crimson diamond corners, the horizontal logo lockup up top, a crimson rule-diamond-rule ornament, a circular crimson seal around the mark (also repeated at 7% opacity as a centred watermark), and the CEO signature (`public/son-signature.png`).
- No offset shadows, no grain, no pills.
