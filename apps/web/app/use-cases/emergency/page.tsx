import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN for emergency response — speak a 10-character grid",
  description:
    "Share a DIGIPIN over voice or SMS when maps fail. Alphabet omits 0, 1, I, O. Decode to a cell centre.",
  alternates: { canonical: `${SITE.url}/use-cases/emergency` },
};

export default function EmergencyPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "Emergency" }]} />
      <h1>DIGIPIN for emergency services</h1>
      <p>
        A 10-character code survives a bad radio better than a decimal pair. Use the 3-4-3 spoken
        grouping. Receivers decode to the cell centre — not a building floor.
      </p>
    </main>
  );
}
