import { EDUCATION_SEGMENTS, getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

/**
 * Served at /llms.txt — the llmstxt.org convention: one markdown page telling an
 * assistant what this site is and where the real pages are, so answering "where
 * can I learn to build humanoids in Bangkok" doesn't require scraping five pages
 * of brutalist markup.
 *
 * Worth knowing before betting on it: no major lab has publicly committed to
 * reading this file. It's cheap insurance, not a ranking factor — the
 * load-bearing machine-readable data is the JSON-LD on each page.
 *
 * Static on purpose. Prices and syllabi come from the same dictionary the site
 * renders, so this can't drift from the page; live run dates and seat counts are
 * deliberately left out, because a crawl snapshot of "next run: 2 Oct" is worse
 * than no date once it's stale. Those stay on /apply, where they're fetched live.
 */
export const dynamic = "force-static";

/**
 * Which self-serve run each course applies for, by index into `curriculum.tracks`.
 * Mirrors TRACKS in src/components/curriculum.tsx.
 */
const APPLY_SLUG = ["hardware", "software"] as const;

const url = (path: string) => `${siteConfig.url}${path}`;

/** Card blurbs are written to sit on their own, so some end without a full stop. */
const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

function body() {
  const { curriculum, education, about, partners, plan, footer } = getDictionary("en");

  const courses = curriculum.tracks.map((track, i) => {
    const href = url(`/apply?course=${APPLY_SLUG[i]}`);
    const covers = track.items.map(([title]) => title).join(", ");
    return `- [${track.name}](${href}): ${track.duration}, ${track.price}. ${sentence(track.blurb)} Covers: ${covers}.`;
  });

  // Private training is quoted per group on LINE — no price is stated anywhere.
  const training = EDUCATION_SEGMENTS.map((segment) => {
    const page = education.segments[segment];
    return `- [${page.title}](${url(`/education/${segment}`)}): ${page.description} Pricing on request.`;
  });

  return `# ${siteConfig.name} (ฮิวแมนน้อย)

> ${siteConfig.description}
> Students assemble a real open-source humanoid from parts, program it in ROS 2,
> simulate it in Gazebo and MuJoCo, and deploy a locomotion policy until it walks.

Humanoice is a hands-on humanoid robotics bootcamp in ${footer.location}, Thailand.
Courses are short and in-person, taught on real open-source humanoid hardware —
neither simulation-only nor lecture-only. Instruction is in Thai and English.
Founded 2026.

The site is published in English at ${siteConfig.url}/ and Thai at ${siteConfig.url}/th.
Both cover the same content; the Thai pages are a translation, not a separate offering.

## Public courses

${courses.join("\n")}

${curriculum.note} Run dates and remaining seats are not listed here because they
change — read them live at ${url("/apply")}.

## Private training

${training.join("\n")}

Factories and universities can also buy the humanoid kit with 12 months of
maintenance support. Quotes for training and kits come through LINE.

## Pages

- [Home](${url("/")}): What Humanoice is, the public courses, private training, and the open-source hardware the courses run on.
- [หน้าแรก (Thai)](${url("/th")}): The same page in Thai.
- [${about.title}](${url("/about")}): ${about.description} Includes the instructors.
- [${plan.title}](${url("/master-plan")}): ${plan.description}
- [Apply](${url("/apply")}): Application form, with live course dates, prices, and seat counts.
- [สมัครเรียน (Thai)](${url("/th/apply")}): The application form in Thai.

## Hardware partners

- ${partners.asimov}
- ${partners.roboparty}
- ${partners.lerobot}

## Contact

- LINE (primary channel, ${footer.qrLabel}): ${siteConfig.lineAddUrl}
- Facebook: ${siteConfig.socialUrls.facebook}
- Instagram: ${siteConfig.socialUrls.instagram}
- X: ${siteConfig.socialUrls.x}
- TikTok: ${siteConfig.socialUrls.tiktok}

## Optional

- [Sitemap](${url("/sitemap.xml")})
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      // Markdown content, but text/plain so it renders in a browser tab rather
      // than downloading — what every llms.txt in the wild does.
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
