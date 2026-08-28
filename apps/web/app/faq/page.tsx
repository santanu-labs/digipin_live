import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN FAQ — coverage, hyphens, PIN codes, privacy",
  description:
    "Answers to common DIGIPIN questions: official format, India bounding box, PIN vs DIGIPIN, privacy, and whether you need an account.",
  alternates: { canonical: `${SITE.url}/faq` },
};

export default function FaqPage() {
  return (
    <main className="section">
      <JsonLd data={{ "@context": "https://schema.org", ...faqLd() }} />
      <Breadcrumbs items={[{ name: "FAQ" }]} />
      <p className="kicker">Knowledge base</p>
      <h1>DIGIPIN frequently asked questions</h1>
      <p className="lede">
        Written against the published India Post / IIT Hyderabad document — not against unofficial
        hyphenated converters.
      </p>
      <FaqList />
    </main>
  );
}
