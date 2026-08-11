import type { Metadata, Viewport } from "next";
import { Prompt, Unbounded, Space_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Body + Thai script (ฮิวแมนน้อย)
const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

// Display — rounded geometric, echoes the pill-stroke logo
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

// Engineering / spec-sheet labels
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  // Resolves relative URLs below (OG image, canonical) to absolute ones.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    // Child pages set a bare title (e.g. "The Master Plan") and get the suffix.
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "humanoid robotics",
    "humanoid bootcamp",
    "robotics bootcamp",
    "robotics training Thailand",
    "Bangkok robotics",
    "open-source humanoid",
    "robot assembly",
    "robot simulation",
    "Humanoice",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      th: "/th",
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage.url],
  },
  // favicon.ico in app/ is picked up automatically; declare the rest that live in public/.
  icons: {
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
};

// EducationalOrganization structured data — helps search engines understand
// what Humanoice is and surface rich results for brand queries.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  alternateName: "ฮิวแมนน้อย",
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangkok",
    addressCountry: "TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${prompt.variable} ${unbounded.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          {/* Without JS the scroll-reveal observer never runs — keep content visible */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
