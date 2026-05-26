import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

const description =
  "Make Thailand the Shenzhen of Southeast Asia. A humanoid bootcamp, a robotics installer, and a parts factory — each step pays for the next.";
// OG/Twitter titles aren't run through the layout's title.template, so spell out the brand.
const shareTitle = "The Master Plan — Humanoice";

export const metadata: Metadata = {
  // Becomes "The Master Plan · Humanoice" via the root layout's title.template.
  title: "The Master Plan",
  description,
  alternates: {
    canonical: "/master-plan",
  },
  // A child openGraph replaces the parent's wholesale, so re-state the shared image.
  openGraph: {
    type: "article",
    siteName: siteConfig.name,
    title: shareTitle,
    description,
    url: "/master-plan",
    locale: siteConfig.locale,
    images: [{ ...siteConfig.ogImage, alt: shareTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description,
    images: [siteConfig.ogImage.url],
  },
};

const STEPS = [
  {
    n: "01",
    title: "Create a humanoid bootcamp",
    body: "Teach people to build humanoids end to end — assembly, simulation, and deployment — on real open-source platforms.",
  },
  {
    n: "02",
    title: "Become a robotics installer",
    body: "Use the profit and the talent we produce to put humanoids to work across Thai industry.",
  },
  {
    n: "03",
    title: "Make the parts",
    body: "Use the profit to manufacture the actuators and sensors the replacement market will need.",
  },
];

export default function MasterPlanPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Minimal header */}
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-200 group-hover:rotate-[-4deg]">
            <Image src="/logo.png" alt="Humanoice" width={24} height={24} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">
            ฮิวแมนน้อยส์
          </span>
        </Link>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-crimson"
        >
          ← Home
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-28 pt-10 sm:pt-16">
        {/* Title */}
        <p className="hero-rise font-mono text-xs uppercase tracking-[0.28em] text-crimson">
          The Master Plan
        </p>
        <h1
          className="hero-rise mt-5 font-display text-[clamp(2.4rem,7vw,4rem)] font-black uppercase leading-[0.95] tracking-tight"
          style={{ animationDelay: "0.08s" }}
        >
          Make Thailand the Shenzhen of Southeast Asia.
        </h1>
        <p
          className="hero-rise mt-6 font-mono text-xs uppercase tracking-[0.16em] text-ink/40"
          style={{ animationDelay: "0.16s" }}
        >
          Bangkok · 2026
        </p>

        {/* Manifesto */}
        <div className="mt-14 space-y-7 text-lg leading-relaxed text-ink/80">
          <p>
            The world&apos;s robots are dreamed up in one country and bolted
            together in another. We don&apos;t think the next wave — humanoids —
            has to follow that old map. It can be designed, built, and shipped
            from right here.
          </p>
          <p>
            But you can&apos;t manufacture what you can&apos;t build, and you
            can&apos;t build what no one&apos;s been taught to build. So we start
            with people. Thailand already has the makers, the curiosity, and the
            manufacturing roots. What&apos;s missing is a place to learn
            humanoids end to end — from the first bolt to a robot that walks out
            the door. That&apos;s where we begin.
          </p>
          <p>
            From there, the plan compounds. Skilled builders become a business
            that puts robots to work. That business funds the factory that makes
            the parts.{" "}
            <span className="font-semibold text-ink">
              Each step pays for the next.
            </span>
          </p>
        </div>

        {/* In short — the signature list */}
        <hr className="mt-16 border-t-2 border-ink/15" />
        <h2 className="mt-12 font-display text-xl font-extrabold uppercase tracking-tight">
          So, in short, the master plan is:
        </h2>

        <ol className="mt-10 space-y-10">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-5 sm:gap-7">
              <span
                aria-hidden
                className="font-display text-3xl font-black leading-none text-crimson sm:text-4xl"
              >
                {step.n}
              </span>
              <div className="pt-0.5">
                <h3 className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Close */}
        <div className="mt-20 border-t-2 border-ink/15 pt-10">
          <p className="font-display text-xl font-extrabold tracking-tight">
            Three steps. One mission.{" "}
            <span className="text-crimson">First batch starts Q4 2026.</span>
          </p>
          <Link
            href="/#early-list"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[4px_4px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--ink)]"
          >
            Join the early list
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
