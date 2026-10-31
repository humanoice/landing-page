import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Eyebrow, InkAtmosphere, SectionHeading } from "@/components/ui";
import type { HomeDictionary } from "@/lib/i18n";

type PartnersProps = { copy: HomeDictionary["partners"] };

export function Partners({ copy }: PartnersProps) {
  const partners = [
    {
      name: "Roboparty",
      logo: "/partners/roboparty.png",
      alt: "Roboparty — ROBOTO ORIGIN open-source humanoid robot",
      blurb: copy.roboparty,
    },
    {
      name: "LeRobot",
      logo: "/partners/lerobot.png",
      alt: "LeRobot — SO-ARM 101 open-source robot arm",
      blurb: copy.lerobot,
    },
  ];

  return (
    <section
      id="partners"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-cream sm:py-28"
    >
      <InkAtmosphere />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow tone="dark">{copy.eyebrow}</Eyebrow>
          <SectionHeading tone="dark" title={copy.title} highlight={copy.highlight} />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {partners.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 130}>
              <article className="group flex h-full flex-col rounded-3xl border-[3px] border-cream/15 bg-cream p-7 text-ink shadow-[8px_8px_0_0_var(--orange-secondary)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--orange-secondary)]">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  width={72}
                  height={72}
                  className="size-16 rounded-2xl object-contain transition-transform duration-200 group-hover:rotate-[-6deg]"
                />
                <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
                  {partner.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{partner.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
