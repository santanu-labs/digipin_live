import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { SITE, jsonLdGraph } from "@/lib/site";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Know Your DIGIPIN — Official 10-character India Post Grid Converter",
    template: "%s · DIGIPIN Live",
  },
  description: SITE.description,
  keywords: [
    "DIGIPIN",
    "Know your DIGIPIN",
    "latitude longitude to DIGIPIN",
    "DIGIPIN converter",
    "DIGIPIN decoder",
    "India Post digital address",
    "DIGIPIN API",
    "DIGIPIN vs PIN code",
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    title: "Know Your DIGIPIN — India Post grid converter",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Your DIGIPIN",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efe4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <Analytics />
        <JsonLd data={jsonLdGraph()} />
        <div className="wrap">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
