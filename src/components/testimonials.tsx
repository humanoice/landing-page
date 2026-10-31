import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { accent, Eyebrow, SectionHeading } from "@/components/ui";
import type { HomeDictionary } from "@/lib/i18n";

/**
 * Who said what, in card order. Quotes are kept in Thai, as written, on every
 * locale — so they live here rather than in i18n. Photos live in /public/review.
 *
 * The photos are mixed (studio portraits and a selfie), so each one carries its
 * own crop: `position` picks the square out of the frame (object-position), and
 * `zoom` + `origin` scale in until the face fills the avatar.
 */
const STUDENTS = [
  {
    name: "Sutthinee Theppariyapol",
    photo: "/review/sutthinee.jpg",
    position: "50% 50%",
    zoom: 2.6,
    origin: "48% 5%",
    quote:
      "เปิดโลกการทำงานของ Humanoid ครั้งแรก น่าจะเป็นที่แรกๆ เลยที่สอนครบทั้ง programming, protocol, การทำ simulation และการประกอบ humanoid ตัวจริง",
  },
  {
    name: "Nuttakit Kundum",
    photo: "/review/nuttakit.jpg",
    position: "50% 0%",
    zoom: 2.4,
    origin: "50% 24%",
    quote:
      "สองวันที่ผ่านมานี้ผมสนุกมาก ๆ เลย ทำให้การต่อหุ่นยนต์ humanoid ง่ายเหมือนซื้อเฟอร์นิเจอร์ IKEA มาประกอบเองครับ",
  },
  {
    name: "Boat Piyapong",
    photo: "/review/piyapong.jpg",
    position: "50% 50%",
    zoom: 1.5,
    origin: "8% 20%",
    quote:
      "เป็นโรงเรียนที่ instructor ทุกท่านตั้งใจมาก อุปกรณ์ล้ำ บรรยากาศเป็นกันเอง สนุกและได้ความรู้มากครับ",
  },
];

type TestimonialsProps = { copy: HomeDictionary["testimonials"] };

export function Testimonials({ copy }: TestimonialsProps) {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-20 border-t-2 border-ink bg-cream py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading title={copy.title} highlight={copy.highlight} />
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STUDENTS.map((student, i) => {
            const { color, ink } = accent(i);
            return (
              <Reveal key={student.name} delay={i * 130} className="h-full">
                <figure
                  className="flex h-full flex-col rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_0_var(--shadow)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[12px_12px_0_0_var(--shadow)] sm:p-7"
                  style={{ "--shadow": color } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    className={`flex size-12 items-center justify-center rounded-2xl border-2 border-ink font-display text-3xl font-black leading-none ${ink}`}
                    style={{ background: color }}
                  >
                    <span className="translate-y-2">“</span>
                  </span>

                  <blockquote lang="th" className="mt-5 flex-1 text-base leading-relaxed text-ink">
                    <p>{student.quote}</p>
                  </blockquote>

                  <div className="mt-6 border-t-2 border-dashed border-ink/15" />

                  <figcaption className="flex items-center gap-4 pt-5">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl border-2 border-ink bg-cream-deep">
                      <Image
                        src={student.photo}
                        alt={student.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                        style={{
                          objectPosition: student.position,
                          transform: `scale(${student.zoom})`,
                          transformOrigin: student.origin,
                        }}
                      />
                    </span>
                    <span className="min-w-0 font-display text-base font-extrabold leading-tight tracking-tight text-ink">
                      {student.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
