import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN API — encode and decode India Post grid codes",
  description:
    "Hosted DIGIPIN API for developers. POST latitude/longitude to get a 10-character India Post DIGIPIN, or decode a DIGIPIN back to GPS cell bounds. Free 60 requests/minute.",
  keywords: ["DIGIPIN API", "DIGIPIN REST API", "lat long to DIGIPIN API", "India Post DIGIPIN API"],
  alternates: { canonical: `${SITE.url}/digipin-api` },
  openGraph: {
    title: "DIGIPIN API",
    description: "REST encode/decode for the official India Post DIGIPIN grid.",
    url: `${SITE.url}/digipin-api`,
  },
};

export default function DigipinApiPage() {
  return (
    <main className="section prose">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "DIGIPIN API",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          url: `${SITE.url}/digipin-api`,
          description:
            "REST API that encodes GPS coordinates to official 10-character DIGIPIN codes and decodes them back to cell bounds.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            description: "Free tier 60 requests per minute",
          },
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: "DIGIPIN API", href: "/digipin-api" }])} />
      <Breadcrumbs items={[{ name: "DIGIPIN API" }]} />
      <p className="kicker">DIGIPIN API</p>
      <h1>DIGIPIN API</h1>
      <p className="lede">
        A hosted REST API for the India Post DIGIPIN grid. Send GPS coordinates, get a
        10-character code. Send a code, get the cell centre and bounds. No hyphens. Keys are
        hashed. Spatial compute does not touch disk.
      </p>
      <div className="actions">
        <Link className="btn" href="/dashboard">
          Get a DIGIPIN API key
        </Link>
        <Link className="btn ghost" href="/docs/api-v1-specification">
          Full specification
        </Link>
      </div>

      <h2>Base URL</h2>
      <p>
        <code>{SITE.apiUrl}</code>
      </p>
      <p>
        Authenticate spatial calls with <code>X-API-Key: dp_live_…</code>. Create a key on the{" "}
        <Link href="/dashboard">dashboard</Link> after a magic-link sign-in.
      </p>

      <h2>Encode GPS to DIGIPIN</h2>
      <pre>{`curl -s -X POST ${SITE.apiUrl}/v1/spatial/encode \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: dp_live_…" \\
  -d '{"latitude":13.11179621,"longitude":80.20264269}'

# {"digipin":"4T396F42L7","digipinDisplay":"4T3 96F4 2L7"}`}</pre>

      <h2>Decode DIGIPIN to GPS</h2>
      <pre>{`curl -s -X POST ${SITE.apiUrl}/v1/spatial/decode \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: dp_live_…" \\
  -d '{"digipin":"4P3JK852C9"}'`}</pre>

      <h2>Limits and format</h2>
      <ul>
        <li>Coverage: latitude 2.5–38.5, longitude 63.5–99.5.</li>
        <li>Wire format: continuous 10 characters from <code>23456789CJKLMPFT</code>.</li>
        <li>Hyphens return <code>400 hyphens_not_permitted</code>.</li>
        <li>Free: 60 requests/minute. Commercial: 5,000/minute — <Link href="/contact">contact</Link>.</li>
        <li>Need offline math instead of HTTP? Use the <Link href="/digipin-sdk">DIGIPIN SDK</Link>.</li>
      </ul>
      <p>
        Health check (no key): <code>GET {SITE.apiUrl}/health</code>
      </p>
    </main>
  );
}
