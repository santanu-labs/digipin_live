import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DIGIPIN for rural and unaddressed India",
  description:
    "Farms, forests, and water bodies sit on the DIGIPIN grid even when no house number exists.",
  alternates: { canonical: `${SITE.url}/use-cases/rural` },
};

export default function RuralPage() {
  return (
    <main className="section prose">
      <Breadcrumbs items={[{ name: "Rural addressing" }]} />
      <h1>DIGIPIN where there is no street address</h1>
      <p>
        The grid does not care if a cell is a hut, a field, or a river. If the coordinates are
        inside 2.5–38.5°N and 63.5–99.5°E, there is a DIGIPIN.
      </p>
    </main>
  );
}
