import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Playground } from "@/components/Playground";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Convert latitude and longitude to DIGIPIN online",
  description:
    "Lat long to DIGIPIN converter. Official India Post 10-character grid, no hyphens. Click the map or paste WGS84 coordinates.",
  alternates: { canonical: `${SITE.url}/tools/lat-long-to-digipin` },
};

export default function EncodeToolPage() {
  return (
    <main className="section">
      <Breadcrumbs items={[{ name: "Lat/long to DIGIPIN" }]} />
      <p className="kicker">Converter</p>
      <h1>Latitude longitude to DIGIPIN</h1>
      <p className="lede">
        Paste WGS84 decimals inside the official India box. Output is a continuous 10-character
        DIGIPIN plus 3-4-3 display grouping.
      </p>
      <Playground initialMode="encode" />
    </main>
  );
}
