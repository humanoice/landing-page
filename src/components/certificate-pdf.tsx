import "server-only";
import path from "node:path";
import { Document, Font, Image, Link, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { certificateCopy as copy, type Certificate } from "@/lib/certificate";
import { siteConfig } from "@/lib/site";

/*
 * The PDF twin of src/components/certificate-view.tsx. Same layout, same
 * numbers: the web view sizes everything in cqw, and on an A4 landscape page
 * (841.89pt wide) 1cqw = 8.42pt — `u()` does that conversion, so a tweak on one
 * side copies straight across to the other.
 *
 * Fonts and images are read off disk; next.config.ts traces them into this
 * route's bundle (outputFileTracingIncludes).
 */
const u = (cqw: number) => cqw * 8.4189;

const root = process.cwd();
const font = (file: string) => path.join(root, "src/assets/fonts", file);
const asset = (file: string) => path.join(root, "public", file);

Font.register({
  family: "Cormorant",
  fonts: [
    { src: font("cormorant-garamond-600-normal.ttf"), fontWeight: 600 },
    { src: font("cormorant-garamond-500-italic.ttf"), fontWeight: 500, fontStyle: "italic" },
  ],
});
Font.register({
  family: "Prompt",
  fonts: [
    { src: font("Prompt-Regular.ttf"), fontWeight: 400 },
    { src: font("Prompt-Medium.ttf"), fontWeight: 500 },
    { src: font("Prompt-SemiBold.ttf"), fontWeight: 600 },
  ],
});
Font.register({
  family: "SpaceMono",
  fonts: [
    { src: font("space-mono-400-normal.ttf"), fontWeight: 400 },
    { src: font("space-mono-700-normal.ttf"), fontWeight: 700 },
  ],
});
// A name or course title must never break across lines mid-word.
Font.registerHyphenationCallback((word) => [word]);

// globals.css tokens. react-pdf has no alpha blending for text, so ink at 70% /
// 60% on the ivory sheet is pre-mixed.
const INK = "#1b0a11";
const INK_70 = "#5f5356";
const INK_60 = "#766b6d";
const CRIMSON = "#bd114a";
const PAPER = "#fffdf7";

const s = StyleSheet.create({
  page: { backgroundColor: PAPER, color: INK, fontFamily: "Prompt" },
  frameOuter: {
    position: "absolute",
    top: u(2.2),
    left: u(2.2),
    right: u(2.2),
    bottom: u(2.2),
    borderWidth: u(0.3),
    borderColor: INK,
  },
  frameInner: {
    position: "absolute",
    top: u(3),
    left: u(3),
    right: u(3),
    bottom: u(3),
    borderWidth: u(0.1),
    borderColor: CRIMSON,
  },
  diamond: { position: "absolute", width: u(1), height: u(1), backgroundColor: CRIMSON, transform: "rotate(45deg)" },
  body: {
    position: "absolute",
    top: u(5.2),
    left: u(8),
    right: u(8),
    bottom: u(4.4),
    alignItems: "center",
    textAlign: "center",
  },
  logo: { width: u(18.67), height: u(7) },
  heading: {
    marginTop: u(0.4),
    fontFamily: "SpaceMono",
    fontWeight: 700,
    fontSize: u(1.25),
    letterSpacing: u(1.25) * 0.35,
    textTransform: "uppercase",
    color: CRIMSON,
  },
  ornament: { marginTop: u(1.2), flexDirection: "row", alignItems: "center" },
  ornamentLine: { width: u(6), height: u(0.08), backgroundColor: CRIMSON },
  ornamentDiamond: {
    width: u(0.6),
    height: u(0.6),
    marginHorizontal: u(0.8),
    backgroundColor: CRIMSON,
    transform: "rotate(45deg)",
  },
  middle: { flexGrow: 1, width: "100%", alignItems: "center", justifyContent: "center" },
  presented: { fontFamily: "Cormorant", fontStyle: "italic", fontWeight: 500, fontSize: u(1.9) },
  nameLatin: {
    marginTop: u(0.4),
    fontFamily: "Cormorant",
    fontFeatureSettings: ["lnum"],
    fontWeight: 600,
    fontSize: u(5.4),
    lineHeight: 1.1,
  },
  nameOther: { marginTop: u(0.4), fontFamily: "Prompt", fontWeight: 600, fontSize: u(4.2), lineHeight: 1.1 },
  nameRule: { marginTop: u(0.6), width: u(46), height: u(0.08), backgroundColor: INK_60 },
  completed: { marginTop: u(1.8), fontSize: u(1.35) },
  course: {
    marginTop: u(0.5),
    fontFamily: "Cormorant",
    fontFeatureSettings: ["lnum"],
    fontWeight: 600,
    fontSize: u(2.9),
    lineHeight: 1.25,
  },
  dates: {
    marginTop: u(0.5),
    fontFamily: "SpaceMono",
    fontSize: u(1.05),
    letterSpacing: u(1.05) * 0.08,
    color: INK_70,
  },
  bottom: { width: "100%", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  column: { width: u(26), alignItems: "center" },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.07,
  },
  signature: { width: u(16), height: u(5.6) },
  signatureRule: { width: u(20), height: u(0.08), backgroundColor: INK_60 },
  ceoName: { marginTop: u(0.7), fontWeight: 500, fontSize: u(1.2) },
  ceoTitle: { fontSize: u(0.95), color: INK_70 },
  label: {
    fontFamily: "SpaceMono",
    fontSize: u(0.85),
    letterSpacing: u(0.85) * 0.2,
    textTransform: "uppercase",
    color: INK_60,
  },
  value: { marginTop: u(0.2), fontWeight: 500, fontSize: u(1.2) },
  certNo: { marginTop: u(0.2), fontFamily: "SpaceMono", fontWeight: 700, fontSize: u(1.2) },
  footer: { marginTop: u(2), fontFamily: "SpaceMono", fontSize: u(0.8), letterSpacing: u(0.8) * 0.04, color: INK_60 },
  footerLink: { color: INK_60, textDecoration: "none" },
});

// Centred on the crimson frame's corners, like the web view's translate(±50%).
const DIAMONDS = [
  { top: u(2.5), left: u(2.5) },
  { top: u(2.5), right: u(2.5) },
  { bottom: u(2.5), left: u(2.5) },
  { bottom: u(2.5), right: u(2.5) },
];

function CertificatePdf({ certificate }: { certificate: Certificate }) {
  const { company } = siteConfig;

  return (
    <Document
      title={`${copy.heading} — ${certificate.studentName}`}
      author={company.legalName}
      subject={certificate.courseName}
      creator={siteConfig.name}
      producer={siteConfig.name}
    >
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.frameOuter} fixed />
        <View style={s.frameInner} fixed />
        {DIAMONDS.map((position, i) => (
          <View key={i} style={[s.diamond, position]} />
        ))}

        {/* The seal as a watermark, dead centre of the sheet and behind everything */}
        <View style={s.watermark}>
          <Seal size={SEAL_SIZE} />
        </View>

        <View style={s.body}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          <Image src={asset("logo/logo_horizontal_with_text.png")} style={s.logo} />
          <Text style={s.heading}>{copy.heading}</Text>
          <View style={s.ornament}>
            <View style={s.ornamentLine} />
            <View style={s.ornamentDiamond} />
            <View style={s.ornamentLine} />
          </View>

          <View style={s.middle}>
            <Text style={s.presented}>{copy.presented}</Text>
            <Text style={certificate.nameIsLatin ? s.nameLatin : s.nameOther}>{certificate.studentName}</Text>
            <View style={s.nameRule} />

            <Text style={s.completed}>{copy.completed}</Text>
            <Text style={s.course}>{certificate.courseName}</Text>
            {certificate.dates && <Text style={s.dates}>{certificate.dates}</Text>}
          </View>

          <View style={s.bottom}>
            <View style={s.column}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
              <Image src={asset("son-signature.png")} style={s.signature} />
              <View style={s.signatureRule} />
              <Text style={s.ceoName}>{company.ceo.name}</Text>
              <Text style={s.ceoTitle}>
                {company.ceo.title}, {siteConfig.name}
              </Text>
            </View>

            <View style={s.column}>
              <Text style={s.label}>{copy.issued}</Text>
              <Text style={s.value}>{certificate.issuedOn}</Text>
              <Text style={[s.label, { marginTop: u(1) }]}>{copy.number}</Text>
              <Text style={s.certNo}>{certificate.certNo}</Text>
            </View>
          </View>

          <Text style={s.footer}>
            {copy.issuedBy} {company.legalName} · {copy.registration} {company.registrationNo} · {copy.verify}{" "}
            <Link src={`https://${certificate.verifyUrl}`} style={s.footerLink}>
              {certificate.verifyUrl}
            </Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/** Watermark diameter in cqw — same as SEAL_SIZE in the web view. */
const SEAL_SIZE = 42;

/** The Humanoice seal, drawn at 11cqw and scaled by `size` — the web view's Seal, measure for measure. */
function Seal({ size }: { size: number }) {
  const k = size / 11;
  const m = (cqw: number) => u(cqw * k);

  return (
    <View
      style={{
        width: m(11),
        height: m(11),
        borderRadius: m(5.5),
        borderWidth: m(0.25),
        borderColor: CRIMSON,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: m(9.8),
          height: m(9.8),
          borderRadius: m(4.9),
          borderWidth: m(0.08),
          borderColor: CRIMSON,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "SpaceMono",
            fontWeight: 700,
            fontSize: m(0.75),
            letterSpacing: m(0.75) * 0.25,
            textTransform: "uppercase",
            color: CRIMSON,
          }}
        >
          {siteConfig.name}
        </Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
        <Image src={asset("logo.png")} style={{ width: m(3.8), height: m(3.8), marginVertical: m(0.3) }} />
        <Text
          style={{
            fontFamily: "SpaceMono",
            fontSize: m(0.65),
            letterSpacing: m(0.65) * 0.12,
            textTransform: "uppercase",
            color: CRIMSON,
          }}
        >
          {copy.seal}
        </Text>
      </View>
    </View>
  );
}

export function renderCertificatePdf(certificate: Certificate) {
  return renderToBuffer(<CertificatePdf certificate={certificate} />);
}
