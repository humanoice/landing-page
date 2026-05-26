import { Reveal } from "@/components/reveal";

const ICON_PROPS = {
  width: 34,
  height: 34,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function AssembleIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z" />
      <circle cx="6.5" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <circle cx="13.5" cy="4" r="1.8" />
      <path d="M12.8 6.6 11 12l2.6 2.2 1 6.2" />
      <path d="M12.1 10.4 8.6 12l-1.6 4.6" />
      <path d="M12.6 7.6l3.4 1.6 2.2-1.2" />
    </svg>
  );
}

const PARTS = [
  {
    n: "01",
    name: "Assemble",
    tag: "Build the body",
    span: "Months 1–2 · Sessions 1–8",
    color: "var(--yellow-main)",
    icon: <AssembleIcon />,
    blurb:
      "The curriculum can change based on the pace of learners",
    sessions: [
      {
        s: "01",
        t: "Foundations & safety",
        d: "Robotics fundamentals, shop tooling and safety, the bill of materials, and the open-source platform you build on.",
      },
      {
        s: "02",
        t: "Actuators & joints",
        d: "BLDC motors, FOC drivers, and cycloidal gearboxes — the joint modules that make a robot move.",
      },
      {
        s: "03",
        t: "Legs & drivetrain",
        d: "Assemble the hip, knee, and ankle joints that carry the robot's weight and define its gait.",
      },
      {
        s: "04",
        t: "Torso & arms",
        d: "Build out the spine, shoulders, and arm linkages from 3D-printed and CNC structural parts.",
      },
      {
        s: "05",
        t: "Power system",
        d: "Battery, BMS, and power distribution sized to keep a moving humanoid running.",
      },
      {
        s: "06",
        t: "Wiring & buses",
        d: "Route the harness and wire the CAN / EtherCAT buses linking every joint to power and data.",
      },
      {
        s: "07",
        t: "Sensing",
        d: "Install and calibrate the IMU, joint encoders, and force-torque sensors the robot feels with.",
      },
      {
        s: "08",
        t: "Hardware bring-up",
        d: "First power-on: joint-by-joint checks, safe limits, and a skeleton that answers to commands.",
      },
    ],
  },
  {
    n: "02",
    name: "Software",
    tag: "Make it walk",
    span: "Month 3 · Sessions 9–12",
    color: "var(--red)",
    icon: <WalkIcon />,
    blurb:
      "The curriculum can change based on the pace of learners",
    sessions: [
      {
        s: "09",
        t: "Kinematics & control",
        d: "URDF modeling, forward / inverse kinematics, and PID joint loops on ROS 2 Control.",
      },
      {
        s: "10",
        t: "Digital twin",
        d: "Mirror your robot in Isaac Sim / MuJoCo, rehearse motions safely, and close the sim-to-real gap.",
      },
      {
        s: "11",
        t: "Balance & first steps",
        d: "Whole-body control and a learned walking gait — tune the policy until it holds balance and steps.",
      },
      {
        s: "12",
        t: "Capstone & demo day",
        d: "Get it walking on the floor, run a real task, and present to family and friends.",
      },
    ],
  },
];

export function Curriculum() {
  return (
    <section
      id="curriculum"
      className="relative scroll-mt-20 overflow-hidden bg-cream py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
            <span className="inline-block h-px w-8 bg-crimson" />
            {"// The Curriculum"}
          </p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-ink">
              From bolts <span className="text-crimson">to brains.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink/70">
              A three-month bootcamp that meets once a week — twelve hands-on
              sessions, no lecture marathons. Two months building the body, one
              month bringing it to life, and a humanoid that can walk.
            </p>
          </div>
        </Reveal>

        {/* Phase breadcrumb */}
        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
            {PARTS.map((p, i) => (
              <span key={p.n} className="flex items-center gap-3">
                <span className="text-ink/70">{p.name}</span>
                {i < PARTS.length - 1 && (
                  <span className="text-crimson" aria-hidden>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Phase panels — two parts, eight sessions then four */}
        <div className="mt-10 space-y-8">
          {PARTS.map((part, i) => (
            <Reveal key={part.n} delay={i * 130}>
              <article
                className="relative isolate overflow-hidden rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_0_var(--shadow)] sm:p-8"
                style={{ "--shadow": part.color } as React.CSSProperties}
              >
                <span className="pointer-events-none absolute -right-5 -top-12 z-0 select-none font-display text-[10rem] font-black leading-none text-ink/[0.04]">
                  {part.n}
                </span>

                {/* Panel header */}
                <div className="relative z-10 flex flex-col gap-5 border-b-2 border-dashed border-ink/15 pb-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <span
                      className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-ink text-ink"
                      style={{ background: part.color }}
                    >
                      {part.icon}
                    </span>
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                        {part.span}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
                        Part {part.n} — {part.name}
                        <span className="ml-2 align-middle font-sans text-sm font-medium normal-case tracking-normal text-ink/50">
                          {part.tag}
                        </span>
                      </h3>
                    </div>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-ink/70 md:text-right">
                    {part.blurb}
                  </p>
                </div>

                {/* Session-by-session syllabus */}
                <ol className="relative z-10 mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                  {part.sessions.map((session) => (
                    <li key={session.s} className="flex gap-3">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink font-mono text-[11px] font-bold text-ink">
                        {session.s}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
                          {session.t}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug text-ink/60">
                          {session.d}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
