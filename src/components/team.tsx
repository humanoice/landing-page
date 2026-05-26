import Image from "next/image";
import { Reveal } from "@/components/reveal";

/**
 * Placeholder roles + blurbs — easy to edit. Photos live in /public/team.
 */
const MEMBERS = [
  {
    name: "Son",
    role: "Main Instructor",
    photo: "/team/son.jpg",
    color: "var(--yellow-main)",
    linkedin: "https://www.linkedin.com/in/sitthaveet/",
    blurb:
      "On a mission to make Thailand to be the Shenzhen of Southeast Asia",
  },
  {
    name: "Bill",
    role: "Senior Robotic Engineer",
    photo: "/team/bill.jpeg",
    color: "var(--orange-secondary)",
    linkedin: "https://www.linkedin.com/in/tanawit-sinsukudomchai/",
    blurb:
      "Robot enthusiast with intensive background in automation industry",
  },
  {
    name: "Mild",
    role: "Head of AI",
    photo: "/team/mild.jpg",
    color: "var(--red)",
    linkedin: "https://www.linkedin.com/in/punthira-chinotaikul-15163a100/",
    blurb:
      "Senior product manager who love applied intelligence to physical world",
  },
];

export function Team() {
  return (
    <section
      id="team"
      className="relative scroll-mt-20 border-t-2 border-ink bg-cream-deep py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
            <span className="inline-block h-px w-8 bg-crimson" />
            // Team
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
            Meet your <span className="text-crimson">instructors</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((member, i) => (
            <Reveal key={member.name} delay={i * 130}>
              <article className="group mx-auto max-w-xs">
                <div
                  className="relative overflow-hidden rounded-3xl border-[3px] border-ink shadow-[8px_8px_0_0_var(--shadow)] transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[12px_12px_0_0_var(--shadow)]"
                  style={{ "--shadow": member.color } as React.CSSProperties}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.role} at Humanoice`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span
                    className="absolute right-3 top-3 rounded-full border-2 border-ink px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink"
                    style={{ background: member.color }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_0_var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--shadow)]"
                  style={{ "--shadow": member.color } as React.CSSProperties}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                </a>

                <div className="mt-5">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                    {member.name}
                  </h3>
                  <p
                    className="mt-0.5 font-mono text-xs font-bold uppercase tracking-[0.16em]"
                    style={{ color: "var(--red)" }}
                  >
                    {member.role}
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
                    {member.blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
