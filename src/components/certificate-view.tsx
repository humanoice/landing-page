import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { certificateCopy as copy, type Certificate } from "@/lib/certificate";
import { siteConfig } from "@/lib/site";

// The one serif on the site — a certificate is the place it earns its keep.
// Scoped to this component; src/components/certificate-pdf.tsx embeds the same cut.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

/**
 * The certificate as A4 landscape. Every size is in cqw (1% of the sheet's
 * width), so it shrinks to a phone as one picture instead of reflowing — and
 * the numbers map 1:1 onto the PDF, where 1cqw = 8.42pt.
 */
export function CertificateView({ certificate }: { certificate: Certificate }) {
  const { company } = siteConfig;

  return (
    <div className="@container w-full">
      <article
        className={`${cormorant.variable} relative aspect-[297/210] w-full overflow-hidden bg-[#fffdf7] text-ink`}
      >
        {/* Frame: a heavy ink rule with a crimson hairline inside it, diamonds at the corners */}
        <div className="absolute inset-[2.2cqw] border-[0.3cqw] border-ink" />
        <div className="absolute inset-[3cqw] border-[0.1cqw] border-crimson" />
        {[
          "left-[3cqw] top-[3cqw]",
          "right-[3cqw] top-[3cqw]",
          "bottom-[3cqw] left-[3cqw]",
          "bottom-[3cqw] right-[3cqw]",
        ].map((corner) => (
          <span
            key={corner}
            className={`absolute ${corner} size-[1cqw] rotate-45 bg-crimson ${corner.includes("left") ? "-translate-x-1/2" : "translate-x-1/2"} ${corner.includes("top") ? "-translate-y-1/2" : "translate-y-1/2"}`}
          />
        ))}

        {/* The seal as a watermark, dead centre of the sheet and behind everything */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.07]" aria-hidden>
          <Seal size={SEAL_SIZE} />
        </div>

        <div className="absolute inset-x-[8cqw] bottom-[4.4cqw] top-[5.2cqw] flex flex-col items-center text-center">
          <Image
            src="/logo/logo_horizontal_with_text.png"
            alt="Humanoice"
            width={1600}
            height={600}
            priority
            className="h-[7cqw] w-auto"
          />

          <p className="mt-[0.4cqw] font-mono text-[1.25cqw] font-bold uppercase tracking-[0.35em] text-crimson">
            {copy.heading}
          </p>
          <Ornament />

          {/* The middle block takes the free height and centres in it, so a short course name doesn't leave a hole */}
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <p className="font-[family-name:var(--font-cormorant)] text-[1.9cqw] italic">{copy.presented}</p>
            <h1
              className={`mt-[0.4cqw] leading-[1.1] ${
                certificate.nameIsLatin
                  ? "font-[family-name:var(--font-cormorant)] text-[5.4cqw] font-semibold lining-nums"
                  : "font-sans text-[4.2cqw] font-semibold"
              }`}
            >
              {certificate.studentName}
            </h1>
            <span className="mt-[0.6cqw] h-[0.08cqw] w-[46cqw] bg-ink/60" />

            <p className="mt-[1.8cqw] font-sans text-[1.35cqw]">{copy.completed}</p>
            <h2 className="mt-[0.5cqw] font-[family-name:var(--font-cormorant)] text-[2.9cqw] font-semibold leading-tight lining-nums">
              {certificate.courseName}
            </h2>
            {certificate.dates && (
              <p className="mt-[0.5cqw] font-mono text-[1.05cqw] tracking-[0.08em] text-ink/70">{certificate.dates}</p>
            )}
          </div>

          <div className="flex w-full items-end justify-between">
            <div className="flex w-[26cqw] flex-col items-center">
              <Image
                src="/son-signature.png"
                alt={`Signature of ${company.ceo.name}`}
                width={400}
                height={140}
                className="h-[5.6cqw] w-auto"
              />
              <span className="h-[0.08cqw] w-[20cqw] bg-ink/60" />
              <p className="mt-[0.7cqw] font-sans text-[1.2cqw] font-medium">{company.ceo.name}</p>
              <p className="font-sans text-[0.95cqw] text-ink/70">
                {company.ceo.title}, {siteConfig.name}
              </p>
            </div>

            <dl className="flex w-[26cqw] flex-col items-center gap-[1cqw] font-sans">
              <div>
                <dt className="font-mono text-[0.85cqw] uppercase tracking-[0.2em] text-ink/60">{copy.issued}</dt>
                <dd className="mt-[0.2cqw] text-[1.2cqw] font-medium">{certificate.issuedOn}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.85cqw] uppercase tracking-[0.2em] text-ink/60">{copy.number}</dt>
                <dd className="mt-[0.2cqw] font-mono text-[1.2cqw] font-bold">{certificate.certNo}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-[2cqw] font-mono text-[0.8cqw] tracking-[0.04em] text-ink/60">
            {copy.issuedBy} {company.legalName} · {copy.registration} {company.registrationNo} · {copy.verify}{" "}
            {certificate.verifyUrl}
          </p>
        </div>
      </article>
    </div>
  );
}

/** Watermark diameter in cqw — most of the sheet's height (70.7cqw). */
const SEAL_SIZE = 42;

/** line — diamond — line, under the heading */
function Ornament() {
  return (
    <div className="mt-[1.2cqw] flex items-center gap-[0.8cqw]">
      <span className="h-[0.08cqw] w-[6cqw] bg-crimson" />
      <span className="size-[0.6cqw] rotate-45 bg-crimson" />
      <span className="h-[0.08cqw] w-[6cqw] bg-crimson" />
    </div>
  );
}

/**
 * The Humanoice seal, drawn at 11cqw and scaled by `size` — every inner measure
 * is a multiple of it. The PDF's seal() takes the same numbers.
 */
function Seal({ size }: { size: number }) {
  const k = size / 11;
  const cqw = (n: number) => `${n * k}cqw`;

  return (
    <div
      className="grid place-items-center rounded-full border-crimson"
      style={{ width: cqw(11), height: cqw(11), borderWidth: cqw(0.25) }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full border-dashed border-crimson"
        style={{ width: cqw(9.8), height: cqw(9.8), borderWidth: cqw(0.08) }}
      >
        <span className="font-mono font-bold uppercase tracking-[0.25em] text-crimson" style={{ fontSize: cqw(0.75) }}>
          {siteConfig.name}
        </span>
        <Image
          src="/logo.png"
          alt=""
          width={1443}
          height={1443}
          style={{ width: cqw(3.8), height: cqw(3.8), marginBlock: cqw(0.3) }}
        />
        <span className="font-mono uppercase tracking-[0.12em] text-crimson" style={{ fontSize: cqw(0.65) }}>
          {copy.seal}
        </span>
      </div>
    </div>
  );
}
