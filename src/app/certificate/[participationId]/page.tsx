import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/certificate-view";
import { certificateCopy as copy, getCertificate } from "@/lib/certificate";
import { siteConfig } from "@/lib/site";

type CertificateRouteProps = {
  params: Promise<{ participationId: string }>;
};

export async function generateMetadata({ params }: CertificateRouteProps): Promise<Metadata> {
  const certificate = await getCertificate((await params).participationId);
  if (!certificate) return { robots: { index: false } };

  const title = `${certificate.studentName} — ${certificate.courseName}`;
  const description = `${copy.heading}: ${certificate.studentName} completed ${certificate.courseName} at ${siteConfig.name}.`;
  return {
    title,
    description,
    // Public by link so it can be shared, but a student's name never goes in an index.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: `/certificate/${certificate.id}`,
      locale: "en_US",
      images: [siteConfig.ogImage],
    },
  };
}

export default async function CertificateRoute({ params }: CertificateRouteProps) {
  const certificate = await getCertificate((await params).participationId);
  if (!certificate) notFound();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-200 group-hover:rotate-[-4deg]">
            <Image src="/logo.png" alt="Humanoice" width={30} height={30} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">ฮิวแมนน้อย</span>
        </Link>
        <a
          href={`/certificate/${certificate.id}/pdf`}
          download={certificate.fileName}
          className="rounded-full border-2 border-ink bg-yellow px-5 py-2.5 font-display text-sm font-bold uppercase tracking-tight shadow-[3px_3px_0_0_var(--ink)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_var(--ink)] active:translate-y-0 active:shadow-[1px_1px_0_0_var(--ink)]"
        >
          {copy.download}
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-8 sm:pt-8">
        <div className="border-2 border-ink shadow-[6px_6px_0_0_var(--ink)]">
          <CertificateView certificate={certificate} />
        </div>
        <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
          <Link href="/" className="underline decoration-2 underline-offset-4 hover:text-crimson">
            {copy.back}
          </Link>
        </p>
      </main>
    </div>
  );
}
