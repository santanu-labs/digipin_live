import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Playground } from "@/components/Playground";
import { breadcrumbLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Know Your DIGIPIN — Find the 10-character code for any location in India",
  description:
    "Use GPS or a map pin to generate your India Post DIGIPIN. Official continuous 10-character format, 3-4-3 display, no hyphens.",
  alternates: { canonical: `${SITE.url}/know-your-digipin` },
};

export default async function KnowPage({
  searchParams,
}: {
  searchParams: Promise<{ lat?: string; lon?: string; digipin?: string }>;
}) {
  const params = await searchParams;
  const mode = params.digipin ? "decode" : "encode";

  return (
    <main className="section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Know your DIGIPIN",
          step: [
            { "@type": "HowToStep", text: "Allow location or click the map." },
            { "@type": "HowToStep", text: "Read the continuous 10-character DIGIPIN." },
            { "@type": "HowToStep", text: "Share the code or open the cell in a map app." },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: "Know your DIGIPIN", href: "/know-your-digipin" }])} />
      <Breadcrumbs items={[{ name: "Know your DIGIPIN" }]} />
      <p className="kicker">Get my DIGIPIN</p>
      <h1>Know your DIGIPIN</h1>
      <p className="lede">
        This is the search people type into Google. Drop a pin, use the device GPS, or paste a
        code. You do not need an account for the converter.
      </p>
      <Playground
        initialMode={mode}
        initialLatitude={params.lat}
        initialLongitude={params.lon}
        initialDigipin={params.digipin}
      />
    </main>
  );
}
