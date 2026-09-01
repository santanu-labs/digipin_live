import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN SDK — TypeScript encode and decode (offline)",
  description:
    "DIGIPIN SDK for JavaScript and TypeScript. Encode GPS to an official 10-character India Post DIGIPIN and decode back to cell bounds offline. Same algorithm as the hosted DIGIPIN API.",
  keywords: ["DIGIPIN SDK", "DIGIPIN JavaScript", "DIGIPIN TypeScript", "DIGIPIN npm", "offline DIGIPIN"],
  alternates: { canonical: `${SITE.url}/digipin-sdk` },
  openGraph: {
    title: "DIGIPIN SDK",
    description: "Offline TypeScript engine for official DIGIPIN encode and decode.",
    url: `${SITE.url}/digipin-sdk`,
  },
};

export default function DigipinSdkPage() {
  return (
    <main className="section prose">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: "DIGIPIN SDK",
          programmingLanguage: "TypeScript",
          codeRepository: SITE.url,
          url: `${SITE.url}/digipin-sdk`,
          description:
            "Stateless TypeScript encode/decode for the official India Post DIGIPIN grid.",
          license: "https://www.apache.org/licenses/LICENSE-2.0",
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: "DIGIPIN SDK", href: "/digipin-sdk" }])} />
      <Breadcrumbs items={[{ name: "DIGIPIN SDK" }]} />
      <p className="kicker">DIGIPIN SDK</p>
      <h1>DIGIPIN SDK</h1>
      <p className="lede">
        The DIGIPIN SDK is the same stateless engine this site and the DIGIPIN API use: encode a
        GPS point to a 10-character India Post code, or decode a code to cell bounds. It runs
        offline. It is not a people database.
      </p>

      <h2>When to use the SDK vs the API</h2>
      <ul>
        <li>
          <strong>SDK</strong> — batch jobs, mobile/offline apps, or when you do not want an HTTP
          hop. Ship the engine in your process.
        </li>
        <li>
          <strong>
            <Link href="/digipin-api">DIGIPIN API</Link>
          </strong>{" "}
          — browsers, third-party integrations, or when you want hashed keys and rate limits
          without embedding the math.
        </li>
      </ul>

      <h2>TypeScript usage</h2>
      <pre>{`import { encodeDigipin, decodeDigipin, formatDigipinDisplay } from "@digipin/engine";

const { digipin } = encodeDigipin(13.11179621, 80.20264269);
// "4T396F42L7"
formatDigipinDisplay(digipin);
// "4T3 96F4 2L7"

const { latitude, longitude, bounds } = decodeDigipin("4P3JK852C9");`}</pre>

      <h2>Rules the SDK enforces</h2>
      <ul>
        <li>Alphabet <code>23456789CJKLMPFT</code> (no 0, 1, I, O).</li>
        <li>India box 2.5–38.5°N, 63.5–99.5°E.</li>
        <li>Hyphens are invalid. Spaces in 3-4-3 display form are accepted on decode.</li>
      </ul>
      <p>
        Golden fixtures match the official README: encode Chennai sample → <code>4T396F42L7</code>;
        decode <code>4P3JK852C9</code> → Bengaluru cell centre.
      </p>
      <p>
        Need HTTP instead? Open the <Link href="/digipin-api">DIGIPIN API</Link> and create a key.
        Need GPS in the browser? Use <Link href="/digipin-gps">DIGIPIN from GPS</Link>.
      </p>
    </main>
  );
}
