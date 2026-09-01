import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Playground } from "@/components/Playground";
import { breadcrumbLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN GPS — convert GPS location to a DIGIPIN",
  description:
    "Get a DIGIPIN from GPS. Use device location or paste latitude and longitude to generate the official 10-character India Post grid code. No account required.",
  keywords: ["DIGIPIN GPS", "GPS to DIGIPIN", "location to DIGIPIN", "DIGIPIN from coordinates"],
  alternates: { canonical: `${SITE.url}/digipin-gps` },
  openGraph: {
    title: "DIGIPIN GPS",
    description: "Convert a GPS reading to an official India Post DIGIPIN.",
    url: `${SITE.url}/digipin-gps`,
  },
};

export default function DigipinGpsPage() {
  return (
    <main className="section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Get a DIGIPIN from GPS",
          step: [
            { "@type": "HowToStep", text: "Allow location or paste latitude and longitude." },
            { "@type": "HowToStep", text: "Read the 10-character DIGIPIN for that GPS cell." },
            { "@type": "HowToStep", text: "Share the code or open the cell in Maps." },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: "DIGIPIN GPS", href: "/digipin-gps" }])} />
      <Breadcrumbs items={[{ name: "DIGIPIN GPS" }]} />
      <p className="kicker">DIGIPIN GPS</p>
      <h1>DIGIPIN from GPS</h1>
      <p className="lede">
        A DIGIPIN is a GPS cell, not a person. Allow the browser location, click the map, or paste
        WGS84 decimals. You get the official 10-character India Post code for that ~4 m cell —
        no hyphens, no account.
      </p>
      <Playground initialMode="encode" />
      <div className="prose" style={{ marginTop: 32 }}>
        <h2>What the GPS reading becomes</h2>
        <p>
          The encoder snaps your latitude and longitude to the published India Post grid (2.5–38.5°N,
          63.5–99.5°E). Decode returns the <em>cell centre</em>, not your exact raw GPS fix. Two
          nearby readings can share one DIGIPIN.
        </p>
        <p>
          Building an app? Call the <Link href="/digipin-api">DIGIPIN API</Link> with the same
          coordinates, or embed the <Link href="/digipin-sdk">DIGIPIN SDK</Link> offline. The
          converter on this page is the search people type as “DIGIPIN GPS”.
        </p>
      </div>
    </main>
  );
}
