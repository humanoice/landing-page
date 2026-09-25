import { renderCertificatePdf } from "@/components/certificate-pdf";
import { getCertificate } from "@/lib/certificate";

// react-pdf reads fonts and images off disk — Node, not the edge.
export const runtime = "nodejs";

export async function GET(_request: Request, ctx: RouteContext<"/certificate/[participationId]/pdf">) {
  const certificate = await getCertificate((await ctx.params).participationId);
  if (!certificate) return new Response("Not found", { status: 404 });

  const pdf = await renderCertificatePdf(certificate);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificate.fileName}"`,
      // Same rule as the page: shareable, never indexed.
      "X-Robots-Tag": "noindex",
    },
  });
}
