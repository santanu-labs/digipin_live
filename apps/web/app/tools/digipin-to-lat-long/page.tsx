import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Playground } from "@/components/Playground";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Decode DIGIPIN to latitude and longitude",
  description:
    "Paste a 10-character DIGIPIN (or unofficial hyphenated form). We return the cell centre, bounds, and official spacing.",
  alternates: { canonical: `${SITE.url}/tools/digipin-to-lat-long` },
};

export default function DecodeToolPage() {
  return (
    <main className="section">
      <Breadcrumbs items={[{ name: "DIGIPIN to lat/long" }]} />
      <p className="kicker">Decoder</p>
      <h1>DIGIPIN to latitude longitude</h1>
      <p className="lede">
        Accepts continuous codes or 3-4-3 spaces. Hyphenated pastes are corrected to the official
        form with a warning.
      </p>
      <Playground initialMode="decode" />
    </main>
  );
}
